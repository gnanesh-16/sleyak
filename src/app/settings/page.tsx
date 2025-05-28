
"use client";

import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import * as React from 'react'; // Added React import
import { 
    Keyboard, 
    Settings as SettingsIcon, 
    Info, 
    Palette, 
    DatabaseZap, 
    BellRing, 
    UserCircle, 
    Ticket, 
    MessageSquare, 
    Send, 
    HelpCircle, 
    DownloadCloud, 
    UploadCloud, 
    Menu as MenuIcon,
    CheckCircle,
    ListChecks,
    Clock,
    ExternalLink
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import useAnalyticsLog from '@/hooks/useAnalyticsLog'; 
import type { AnalyticsEvent } from '@/types/analytics'; 
import { format as formatDateFns, parseISO } from 'date-fns'; 
import { formatInTimeZone } from 'date-fns-tz'; 


type SettingsSection = 'shortcuts' | 'general' | 'data' | 'notifications' | 'account' | 'raiseTicket' | 'about';

const TicketTimelineStep = ({ step, label, status }: { step: number, label: string, status: 'completed' | 'pending' | 'current' }) => {
  let bgColor = 'bg-muted';
  let textColor = 'text-muted-foreground';
  if (status === 'completed') {
    bgColor = 'bg-green-500'; 
    textColor = 'text-green-50';
  } else if (status === 'current') {
    bgColor = 'bg-primary';
    textColor = 'text-primary-foreground';
  }

  return (
    <div className="flex flex-col items-center text-center">
      <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center font-bold ${textColor} mb-1 shadow-md`}>{step}</div>
      <p className={`text-xs ${status === 'current' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>{label}</p>
    </div>
  );
};

const TodlexLogo = ({className}: {className?: string}) => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={cn("text-primary", className)}>
    <path d="M6 18H18V16H6V18ZM6 14H18V12H6V14ZM6 10H18V8H6V10Z" />
    <path d="M4 20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V4C20 2.89543 19.1046 2 18 2H6C4.89543 2 4 2.89543 4 4V20ZM6 4H18V20H6V4Z" fillOpacity="0.3"/>
  </svg>
);


export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('shortcuts');
  const [ticketQuery, setTicketQuery] = useState('');
  const [ticketReferenceId, setTicketReferenceId] = useState('TODLEX-LOCAL-USER'); // Conceptual
  const { toast } = useToast();
  const [exportFormat, setExportFormat] = useState<string>("json_todlex");
  const [importJsonData, setImportJsonData] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const { events: analyticsEvents } = useAnalyticsLog(); 
  const indianTimeZone = 'Asia/Kolkata'; 

  const handleTicketSubmit = () => {
    if (!ticketQuery.trim()) {
      toast({
        title: "Empty Query",
        description: "Please describe your issue or suggestion before submitting.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Ticket Submitted (Conceptual)",
      description: "Your support ticket has been notionally submitted. For real support, please contact us via official channels. Your Reference ID: " + ticketReferenceId,
      duration: 5000,
    });
    setTicketQuery(''); 
  };

  const quickSelectQuery = (query: string) => {
    setTicketQuery(prev => `${prev}${prev ? '\n' : ''}${query}`);
  };
  
  const escapeCsvCell = (cellData: string | undefined): string => {
    if (cellData === undefined || cellData === null) return '';
    const stringData = String(cellData);
    if (stringData.includes(',') || stringData.includes('"') || stringData.includes('\n')) {
      return `"${stringData.replace(/"/g, '""')}"`;
    }
    return stringData;
  };
  
  const handleDownloadAnalytics = () => {
    if (analyticsEvents.length === 0) {
      toast({
        title: "No Data",
        description: "There is no analytics data to download.",
        variant: "default",
      });
      return;
    }

    const headers = ['ID', 'Type', 'Timestamp (IST)', 'Details_Title', 'Details_RelatedID', 'Details_Message'];
    const csvRows = [
      headers.join(','),
      ...analyticsEvents.map(event => {
        const timestampIST = formatInTimeZone(parseISO(event.timestamp), indianTimeZone, "yyyy-MM-dd HH:mm:ss zzz");
        return [
          escapeCsvCell(event.id),
          escapeCsvCell(event.type),
          escapeCsvCell(timestampIST),
          escapeCsvCell(event.details.title),
          escapeCsvCell(event.details.relatedId),
          escapeCsvCell(event.details.message),
        ].join(',');
      })
    ];
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const formattedDateForFile = formatDateFns(new Date(), "yyyy-MM-dd");
    link.setAttribute('download', `todlex_analytics_report_${formattedDateForFile}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: "Your analytics report is being downloaded.",
      variant: "default",
    });
  };


  const handleExportData = () => {
    if (exportFormat === "analytics_csv") {
        handleDownloadAnalytics(); 
        return;
    }
    
    let formatName = "JSON (Todlex Format)";
    if (exportFormat === "csv_links_conceptual") formatName = "CSV (Links Only - Conceptual)";
    else if (exportFormat === "pdf_report_conceptual") formatName = "PDF Report (Conceptual)";
    
    toast({
        title: "Export Started (Conceptual)",
        description: `Conceptual export as ${formatName}. In a real app, a file would be generated and downloaded.`,
    });
  };

  const handleImportData = () => {
    if (!importJsonData.trim()) {
        toast({
            title: "No Data to Import",
            description: "Please paste valid JSON data into the text area.",
            variant: "destructive",
        });
        return;
    }
    try {
        JSON.parse(importJsonData); 
        toast({
            title: "Import Successful (Conceptual)",
            description: "Data conceptually imported. In a real app, this would update your dashboard. Backend integration is required for full functionality.",
        });
        setImportJsonData(""); 
    } catch (e) {
        toast({
            title: "Invalid JSON Format",
            description: "The data you pasted is not valid JSON. Please check the format.",
            variant: "destructive",
        });
    }
  };
  
  const exampleJsonImport = `[
  {
    "title": "🔥 Comment \"Rork\" below and I'll DM you my exact prompts that build $1000 phone apps - YouTube",
    "url": "https://youtube.com/shorts/89fsHw94m5M?si=qhhuhrb9vVi8L8gy",
    "description": "This AI tool called Rork is a GAME CHANGER for building phone apps with minimal code 🤯I've used Lovable and Bolt before, but Rork lets you:Create FULL STACK...",
    "createdAt": "2025-05-25T00:00:00.000Z", 
    "todoDate": null
  },
  {
    "title": "Next.js Conf Highlights",
    "url": "https://nextjs.org/conf",
    "description": "Key takeaways from the latest Next.js conference.",
    "createdAt": "2025-05-20T00:00:00.000Z",
    "todoDate": "2025-06-01T00:00:00.000Z"
  }
]`;


  const renderSectionContent = () => {
    switch (activeSection) {
      case 'shortcuts':
        return (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Keyboard />Keyboard Shortcuts</CardTitle>
              <CardDescription>Boost your productivity with these essential shortcuts for Todlex.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Paste Link (to active tab)", keys: ["Ctrl", "V"], macKeys: ["Cmd", "V"], desc: "Quickly add links by pasting them anywhere on the active tab." },
                { label: "Open Mobile Navigation", icon: <MenuIcon className="inline h-4 w-4 text-primary" />, desc: "Access all app sections quickly on smaller screens." },
                { label: "Quick Add Tab (Future)", keys: ["Ctrl", "Shift", "T"], macKeys: ["Cmd", "Shift", "T"], desc: "Planned feature for rapidly creating new date tabs.", disabled: true },
              ].map(shortcut => (
                <div key={shortcut.label} className={cn("p-4 border rounded-lg bg-card-foreground/5 hover:bg-card-foreground/10 transition-colors duration-200 ease-in-out", shortcut.disabled && "opacity-60")}>
                  <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{shortcut.label}</span>
                      <div className="flex items-center gap-1.5">
                        {shortcut.keys && shortcut.keys.map((key, i) => (
                          <React.Fragment key={i}>
                            <kbd className="px-2 py-1 text-xs font-semibold text-muted-foreground bg-muted border border-border rounded shadow-sm">{key}</kbd>
                            {i < shortcut.keys!.length - 1 && <span className="text-muted-foreground">+</span>}
                          </React.Fragment>
                        ))}
                        {shortcut.macKeys && shortcut.keys && <span className="text-xs text-muted-foreground mx-1">/</span>}
                        {shortcut.macKeys && shortcut.macKeys.map((key, i) => (
                           <React.Fragment key={i}>
                            <kbd className="px-2 py-1 text-xs font-semibold text-muted-foreground bg-muted border border-border rounded shadow-sm">{key}</kbd>
                            {i < shortcut.macKeys!.length - 1 && <span className="text-muted-foreground">+</span>}
                          </React.Fragment>
                        ))}
                        {shortcut.icon && <span className="text-sm text-muted-foreground flex items-center gap-1">Click the {shortcut.icon} icon in header</span>}
                      </div>
                  </div>
                  {shortcut.desc && <p className="text-xs text-muted-foreground mt-1.5">{shortcut.desc}</p>}
                </div>
              ))}
               <p className="text-xs text-muted-foreground text-center pt-2">More shortcuts coming soon!</p>
            </CardContent>
          </Card>
        );
      case 'general':
        return (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><SettingsIcon />General Settings</CardTitle>
              <CardDescription>Configure core application behavior and preferences for Todlex.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-card-foreground/5 opacity-70">
                <div>
                  <h3 className="font-semibold text-foreground">Default Startup Tab</h3>
                  <p className="text-sm text-muted-foreground">Choose which tab is active when Todlex starts. (Coming Soon)</p>
                </div>
                <Button variant="outline" size="sm" disabled>Set Default</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg bg-card-foreground/5 opacity-70">
                <div>
                  <h3 className="font-semibold text-foreground">Link Opening Behavior</h3>
                  <p className="text-sm text-muted-foreground">Configure if links open in a new tab or the current tab. (Coming Soon)</p>
                </div>
                 <Button variant="outline" size="sm" disabled>Configure</Button>
              </div>
               <div className="flex items-center justify-between p-4 border rounded-lg bg-card-foreground/5">
                <div>
                  <h3 className="font-semibold text-foreground">History Retention Period</h3>
                  <p className="text-sm text-muted-foreground">Deleted items are kept in History for 24 days before automatic permanent removal. (Not configurable)</p>
                </div>
                 <Badge variant="secondary">24 Days</Badge>
              </div>
              <Separator />
               <div className="p-4 border rounded-lg bg-destructive/10 opacity-70">
                  <h3 className="font-semibold text-destructive mb-1">Reset Application Data (Conceptual)</h3>
                  <p className="text-sm text-destructive/80 mb-3">This would clear all your links, tabs, analytics, and history from local storage. This action cannot be undone. (Button Disabled)</p>
                  <Button variant="destructive" size="sm" disabled>Reset All Data (Careful!)</Button>
              </div>
            </CardContent>
          </Card>
        );
      case 'data':
         return (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><DatabaseZap />Data Management</CardTitle>
              <CardDescription>Manage your Todlex data. Export options are conceptual for now.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Export My Data</h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border rounded-lg bg-card-foreground/5">
                    <div className="flex-grow w-full sm:w-auto">
                        <Label htmlFor="export-format" className="text-xs text-muted-foreground">Select Format</Label>
                        <Select value={exportFormat} onValueChange={setExportFormat}>
                        <SelectTrigger id="export-format" className="w-full sm:w-[240px] bg-background">
                            <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="json_todlex">JSON (Todlex Link Format)</SelectItem>
                            <SelectItem value="analytics_csv">CSV (Analytics Log)</SelectItem>
                            <SelectItem value="csv_links_conceptual">CSV (Links Only - Conceptual)</SelectItem>
                            <SelectItem value="pdf_report_conceptual">PDF Report (Conceptual)</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleExportData} size="sm" className="w-full sm:w-auto self-end sm:self-center">
                        <DownloadCloud className="mr-2 h-4 w-4" />
                        {exportFormat === "analytics_csv" ? "Download Analytics" : "Export Data (Conceptual)"}
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 px-1">
                    The Analytics Log CSV is functional. Other export formats are conceptual and require backend processing.
                </p>
              </div>
              <Separator />
              <div>
                 <h3 className="font-semibold text-foreground mb-2">Import Data (Conceptual)</h3>
                <div className="p-4 border rounded-lg bg-card-foreground/5">
                    <Label htmlFor="import-data-json" className="block mb-1 text-sm">Paste Todlex JSON Data Here:</Label>
                    <Textarea
                        id="import-data-json"
                        value={importJsonData}
                        onChange={(e) => setImportJsonData(e.target.value)}
                        placeholder={exampleJsonImport}
                        rows={8}
                        className="mb-3 font-mono text-xs bg-input"
                    />
                    <Button onClick={handleImportData} size="sm">
                        <UploadCloud className="mr-2 h-4 w-4" />Import Data (Conceptual)
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                        Importing data would merge with your existing board. Ensure the format is correct.
                        This is a conceptual feature; full import functionality requires backend processing and robust data validation.
                    </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 'notifications':
        return (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BellRing />Notification Preferences</CardTitle>
              <CardDescription>Configure when and how you receive notifications from Todlex.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-card-foreground/5">
                <div>
                  <h3 className="font-semibold text-foreground">To-Do Reminders (Desktop Notifications)</h3>
                  <p className="text-sm text-muted-foreground">Receive a desktop notification when a link's to-do date is approaching or due. (Conceptual - requires browser permissions and may need backend for reliability).</p>
                </div>
                <Switch 
                    id="todo-reminders-switch"
                    checked={notificationsEnabled}
                    onCheckedChange={(checked) => {
                        setNotificationsEnabled(checked);
                        toast({ title: `To-Do Reminders ${checked ? 'Enabled' : 'Disabled'} (Conceptual)`});
                    }}
                 />
              </div>
              {notificationsEnabled && (
                <div className="p-3 bg-primary/10 rounded-md text-sm text-primary-foreground/80">
                  Conceptual: Desktop notifications for To-Do reminders are now 'enabled'. Browser permission would be requested.
                </div>
              )}
              <p className="text-center text-muted-foreground text-sm pt-4">
                Desktop notification features are conceptual and would require browser permission handling and potentially backend services for reliable delivery.
              </p>
            </CardContent>
          </Card>
        );
      case 'account':
        return (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserCircle />Account Settings</CardTitle>
              <CardDescription>Manage your Todlex account details. (Conceptual - Requires Backend)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 opacity-70">
              <div className="p-4 border rounded-lg bg-card-foreground/5">
                <h3 className="font-semibold text-foreground mb-1">Profile Information</h3>
                <p className="text-sm text-muted-foreground mb-3">Update your name, email, or profile picture.</p>
                <Button variant="outline" size="sm" disabled><UserCircle className="mr-2 h-4 w-4" />Edit Profile</Button>
              </div>
              <div className="p-4 border rounded-lg bg-card-foreground/5">
                <h3 className="font-semibold text-foreground mb-1">Change Password</h3>
                <p className="text-sm text-muted-foreground mb-3">Keep your account secure by updating your password regularly.</p>
                <Button variant="outline" size="sm" disabled>Change Password</Button>
              </div>
              <Separator />
               <div className="p-4 border rounded-lg bg-destructive/10">
                  <h3 className="font-semibold text-destructive mb-1">Delete Account</h3>
                  <p className="text-sm text-destructive/80 mb-3">Permanently delete your Todlex account and all associated data. This action cannot be undone.</p>
                  <Button variant="destructive" size="sm" disabled>Delete Account (Careful!)</Button>
              </div>
               <p className="text-center text-muted-foreground text-sm pt-4">Account features require backend services and user authentication, planned for a future release.</p>
            </CardContent>
          </Card>
        );
      case 'raiseTicket':
        return (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Ticket />Raise a Support Ticket</CardTitle>
              <CardDescription>Need help or have a suggestion? Let us know. (Conceptual)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="ticketQuery" className="mb-2 block font-semibold">Describe your issue or suggestion:</Label>
                <Textarea
                  id="ticketQuery"
                  value={ticketQuery}
                  onChange={(e) => setTicketQuery(e.target.value)}
                  placeholder="E.g., I'm having trouble with link previews not showing for YouTube URLs..."
                  rows={5}
                  className="mb-2 bg-input"
                />
                 <Label htmlFor="ticketReferenceId" className="text-xs text-muted-foreground block mb-1">Your Reference ID (for local tracking):</Label>
                <Input
                  id="ticketReferenceId"
                  value={ticketReferenceId}
                  readOnly
                  className="text-xs bg-muted/50 mb-4"
                />
                <p className="text-sm text-muted-foreground mb-2">Common issues (click to add to your query):</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button variant="outline" size="sm" onClick={() => quickSelectQuery("Request to restore deleted history for tab/link...")}>Restore History Request</Button>
                  <Button variant="outline" size="sm" onClick={() => quickSelectQuery("Reporting a bug: ...")}>Report a Bug</Button>
                  <Button variant="outline" size="sm" onClick={() => quickSelectQuery("Feature suggestion: ...")}>Suggest a Feature</Button>
                  <Button variant="outline" size="sm" onClick={() => quickSelectQuery("General feedback: ...")}>General Feedback</Button>
                </div>
                <Button onClick={handleTicketSubmit} className="w-full sm:w-auto">
                  <Send className="mr-2 h-4 w-4" /> Submit Ticket (Conceptual)
                </Button>
              </div>

              <Separator />
              <div>
                <h4 className="font-semibold text-foreground mb-4 text-center">Conceptual Ticket Timeline:</h4>
                <div className="flex justify-around items-start p-4 border rounded-lg bg-card-foreground/5 relative">
                  <div className="absolute top-1/2 left-10 right-10 h-0.5 border-t-2 border-dashed border-border -translate-y-1/2 -z-10" style={{width: 'calc(100% - 5rem)'}}></div>
                  <TicketTimelineStep step={1} label="Ticket Sent" status="completed" />
                  <TicketTimelineStep step={2} label="Pending Review" status="current" />
                  <TicketTimelineStep step={3} label="In Progress" status="pending" />
                  <TicketTimelineStep step={4} label="Resolved" status="pending" />
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">This timeline is for illustrative purposes only. Actual ticket processing would occur via a backend system.</p>
              </div>
            </CardContent>
          </Card>
        );
      case 'about':
        return (
          <Card className="shadow-lg">
            <CardHeader className="text-center border-b pb-4">
                <TodlexLogo className="mx-auto h-16 w-16 text-primary mb-3"/>
                <CardTitle className="text-3xl font-bold text-primary">Todlex</CardTitle>
                <CardDescription className="text-sm">Version 1.0.0 (Current Prototype) - Reinventing Your Link Workflow</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6 text-sm leading-relaxed">
              
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center"><Info className="mr-2 h-5 w-5 text-primary"/>Why Todlex? Redefining Link Management.</h3>
                <p className="text-muted-foreground pl-2 border-l-2 border-primary/50">
                  In a digital world overflowing with information, Todlex offers a refreshingly simple yet powerful way to manage the links that truly matter to you. We believe that context, especially temporal context, is key to effective organization. Unlike generic Kanban boards or traditional bookmark managers, Todlex is built around a core, intuitive concept: <strong>your timeline</strong>.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center"><CheckCircle className="mr-2 h-5 w-5 text-primary"/>Unique Features & Benefits:</h3>
                <ul className="space-y-4">
                  {[
                    { icon: <Clock className="h-5 w-5 text-primary/80 flex-shrink-0" />, title: "Date-Centric Workflow", text: "Links are automatically organized by the date you discover and paste them. This creates an intuitive, chronological view of your web discoveries, research, or items you need to revisit. Todlex builds your personal web knowledge base over time." },
                    { icon: <ExternalLink className="h-5 w-5 text-primary/80 flex-shrink-0" />, title: "Effortless Capture & Context", text: "Simply copy a link and paste it (Ctrl+V or Cmd+V) directly into the active date tab. Todlex instantly fetches titles, descriptions, favicons, and even preview images, providing rich context without any extra effort." },
                    { icon: <ListChecks className="h-5 w-5 text-primary/80 flex-shrink-0" />, title: "Integrated To-Do Scheduling", text: "Seamlessly turn any link into an actionable item by assigning a 'To-Do' date. Keep track of deadlines and follow-ups right where your links live." },
                    { icon: <Palette className="h-5 w-5 text-primary/80 flex-shrink-0" />, title: "Clean & Intuitive Interface", text: "We prioritize clarity and efficiency. Todlex's design is minimal and focused, ensuring you can manage your links without distraction. The tab-based date navigation is familiar and highly effective." },
                    { icon: <SettingsIcon className="h-5 w-5 text-primary/80 flex-shrink-0" />, title: "Flexible Tab Management", text: "Create tabs for any past or present date, allowing you to pre-organize for upcoming projects or backfill your link history. You control your timeline." },
                     { icon: <DatabaseZap className="h-5 w-5 text-primary/80 flex-shrink-0" />, title: "Deletion History & Analytics", text: "Accidentally deleted something? Todlex keeps a history for 24 days. Optional analytics provide insights into your link management habits." },
                  ].map(item => (
                    <li key={item.title} className="flex items-start gap-3 p-3 bg-card-foreground/5 rounded-md hover:bg-card-foreground/10 transition-colors">
                      {item.icon}
                      <div>
                        <h4 className="font-semibold text-foreground">{item.title}</h4>
                        <p className="text-muted-foreground text-xs">{item.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Separator />

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center"><HelpCircle className="mr-2 h-5 w-5 text-primary"/>Switch to Todlex if:</h3>
                 <ul className="list-disc list-inside text-muted-foreground space-y-2 pl-4 columns-1 md:columns-2 gap-x-6">
                  <li>You find traditional bookmarking clunky and lacking context.</li>
                  <li>You want to turn browsing history into an actionable timeline.</li>
                  <li>You need a lightning-fast way to save links with rich metadata.</li>
                  <li>You appreciate a clean, focused, and efficient user experience.</li>
                  <li>You think in terms of "When did I see that?".</li>
                  <li>You desire a lightweight tool that respects your workflow.</li>
                </ul>
              </div>
              <p className="text-md text-foreground pt-3 font-semibold text-center bg-primary/10 p-4 rounded-md">
                Todlex is designed to be the simplest, most intuitive bridge between your web exploration and your organized productivity.
              </p>
            </CardContent>
            <CardFooter className="justify-center border-t pt-4">
                <Button variant="link" onClick={() => toast({title: "Conceptual", description: "Privacy Policy / Terms of Service would be here."})}>
                    Privacy Policy & Terms (Conceptual)
                </Button>
            </CardFooter>
          </Card>
        );
      default:
        return null;
    }
  };
  
  const menuItems: { id: SettingsSection; label: string; icon: React.ElementType }[] = [
    { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'data', label: 'Data Management', icon: DatabaseZap },
    { id: 'notifications', label: 'Notifications', icon: BellRing },
    { id: 'account', label: 'Account', icon: UserCircle },
    { id: 'raiseTicket', label: 'Raise Ticket', icon: Ticket },
    { id: 'about', label: 'About Todlex', icon: HelpCircle },
  ];


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <div className="text-sm text-muted-foreground">
            Your Conceptual Reference ID: <Badge variant="outline" className="font-semibold text-foreground">{ticketReferenceId}</Badge>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <nav className="md:w-1/4 lg:w-1/5">
            <ul className="space-y-1.5">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <Button
                    variant={'ghost'}
                    className={cn(
                      "w-full justify-start text-left px-3 py-2 h-auto group",
                      activeSection === item.id && "bg-muted/50 border border-slate-300 dark:border-slate-700 shadow-sm" 
                    )}
                    onClick={() => setActiveSection(item.id)}
                  >
                    <item.icon className={cn(
                        "mr-3 h-5 w-5 transition-colors",
                        activeSection === item.id ? "text-foreground" : "text-muted-foreground group-hover:text-primary"
                      )} />
                    <span className={cn(
                        "text-sm font-medium transition-colors",
                        activeSection === item.id ? "text-foreground" : "text-muted-foreground group-hover:text-primary"
                      )}>
                        {item.label}
                    </span>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:w-3/4 lg:w-4/5">
            {renderSectionContent()}
          </div>
        </div>
      </main>
    </div>
  );
}

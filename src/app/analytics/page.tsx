
"use client";

import { AppHeader } from '@/components/AppHeader';
import useAnalyticsLog from '@/hooks/useAnalyticsLog';
import type { AnalyticsEvent } from '@/types/analytics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, XAxis, YAxis, Bar, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { parseISO, startOfDay, subDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { AlertTriangle, Trash2, CheckCircle, ListPlus, ListX, CalendarPlus, CalendarX, RotateCcw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, useMemo, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

const eventIcons: { [key in AnalyticsEvent['type']]: React.ElementType } = {
  LINK_CREATED: ListPlus,
  LINK_DELETED: ListX,
  TAB_CREATED: CalendarPlus,
  TAB_DELETED: CalendarX,
  ANALYTICS_CLEARED: RotateCcw,
};

const eventColors: { [key in AnalyticsEvent['type']]: string } = {
  LINK_CREATED: 'text-green-500',
  LINK_DELETED: 'text-red-500',
  TAB_CREATED: 'text-blue-500',
  TAB_DELETED: 'text-orange-500',
  ANALYTICS_CLEARED: 'text-yellow-500',
}

const indianTimeZone = 'Asia/Kolkata';

export default function AnalyticsPage() {
  const { events, clearLog } = useAnalyticsLog();
  const [showClearLogDialog, setShowClearLogDialog] = useState(false);
  const { toast } = useToast();

  const [clientEvents, setClientEvents] = useState<AnalyticsEvent[]>([]);
  useEffect(() => {
    setClientEvents(events);
  }, [events]);


  const recentEvents = useMemo(() => {
    return [...clientEvents].sort((a, b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime()).slice(0, 20);
  }, [clientEvents]);

  const chartData = useMemo(() => {
    const dataMap = new Map<string, { date: string; created: number; deleted: number; tabsCreated: number; tabsDeleted: number }>();
    const todayInIST = startOfDay(new Date(new Date().toLocaleString("en-US", {timeZone: indianTimeZone})));


    for (let i = 6; i >= 0; i--) {
      const date = subDays(todayInIST, i);
      const dateString = formatInTimeZone(date, indianTimeZone, 'MMM d');
      dataMap.set(dateString, { date: dateString, created: 0, deleted: 0, tabsCreated: 0, tabsDeleted: 0 });
    }

    clientEvents.forEach(event => {
      const eventDateInIST = startOfDay(parseISO(event.timestamp));
      if (eventDateInIST >= subDays(todayInIST, 6) && eventDateInIST <= todayInIST) {
        const dateString = formatInTimeZone(eventDateInIST, indianTimeZone, 'MMM d');
        const dayData = dataMap.get(dateString);
        if (dayData) {
          if (event.type === 'LINK_CREATED') dayData.created++;
          else if (event.type === 'LINK_DELETED') dayData.deleted++;
          else if (event.type === 'TAB_CREATED') dayData.tabsCreated++;
          else if (event.type === 'TAB_DELETED') dayData.tabsDeleted++;
        }
      }
    });
    return Array.from(dataMap.values());
  }, [clientEvents]);

  const handleClearLog = () => {
    clearLog();
    toast({
        title: "Analytics Cleared",
        description: "Your analytics log has been cleared.",
        variant: "default",
      });
    setShowClearLogDialog(false);
  };
  
  const totalLinks = useMemo(() => clientEvents.filter(e => e.type === 'LINK_CREATED').length - clientEvents.filter(e => e.type === 'LINK_DELETED').length, [clientEvents]);
  const totalTabs = useMemo(() => clientEvents.filter(e => e.type === 'TAB_CREATED').length - clientEvents.filter(e => e.type === 'TAB_DELETED').length, [clientEvents]);


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto p-6 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-foreground">Analytics Overview</h1>
          <div className="flex gap-2">
            {/* Download Report Button Moved to Settings Page */}
            <Button variant="outline" onClick={() => setShowClearLogDialog(true)}>
              <Trash2 className="mr-2 h-4 w-4" /> Clear Log
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Active Links</CardTitle>
                    <ListPlus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{Math.max(0, totalLinks)}</div>
                    <p className="text-xs text-muted-foreground">Current number of links</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Active Tabs</CardTitle>
                    <CalendarPlus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{Math.max(0, totalTabs)}</div>
                     <p className="text-xs text-muted-foreground">Current number of date tabs</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Links Created (Last 7 Days)</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {chartData.reduce((sum, day) => sum + day.created, 0)}
                    </div>
                     <p className="text-xs text-muted-foreground">Based on IST calendar days</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Links Deleted (Last 7 Days)</CardTitle>
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                         {chartData.reduce((sum, day) => sum + day.deleted, 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">Based on IST calendar days</p>
                </CardContent>
            </Card>
        </div>


        <Card>
          <CardHeader>
            <CardTitle>Daily Activity (Last 7 Days - IST)</CardTitle>
            <CardDescription>Overview of links and tabs created or deleted, by IST day.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] w-full">
            {clientEvents.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false}/>
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend wrapperStyle={{fontSize: "12px"}}/>
                  <Bar dataKey="created" name="Links Created" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="deleted" name="Links Deleted" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="tabsCreated" name="Tabs Created" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="tabsDeleted" name="Tabs Deleted" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No activity data to display yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity (IST)</CardTitle>
            <CardDescription>A log of the latest actions in your Todlex board.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentEvents.length > 0 ? (
              <ScrollArea className="h-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead className="text-right">Timestamp (IST)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentEvents.map(event => {
                       const IconComponent = eventIcons[event.type] || AlertTriangle;
                       const iconColor = eventColors[event.type] || 'text-muted-foreground';
                      return (
                        <TableRow key={event.id}>
                          <TableCell>
                            <IconComponent className={`h-5 w-5 ${iconColor}`} />
                          </TableCell>
                          <TableCell className="font-medium">{event.type.replace(/_/g, ' ')}</TableCell>
                          <TableCell className="text-muted-foreground text-sm truncate max-w-xs">
                            {event.details.title || event.details.message || `ID: ${event.details.relatedId || 'N/A'}`}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground text-xs">
                            {formatInTimeZone(parseISO(event.timestamp), indianTimeZone, "MMM d, HH:mm:ss")}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            ) : (
               <div className="flex items-center justify-center h-[200px]">
                 <p className="text-muted-foreground">No recent activity recorded.</p>
               </div>
            )}
          </CardContent>
        </Card>
      </main>

      <AlertDialog open={showClearLogDialog} onOpenChange={setShowClearLogDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Analytics Log?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete all analytics history? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowClearLogDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearLog} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                Clear Log
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

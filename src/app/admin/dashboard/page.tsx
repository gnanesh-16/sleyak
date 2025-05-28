
import { AppHeader } from '@/components/AppHeader';
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; // Import Button
import { User, ListChecks, BarChart2, Mail, ShieldAlert, Eye } from 'lucide-react'; // Added Eye
import { useToast } from '@/hooks/use-toast'; // Not used directly, but useful for conceptual actions

export const metadata: Metadata = {
  title: 'Admin Dashboard - Todlex',
  description: 'Administrator dashboard for Todlex.',
};

// Conceptual data - in a real app, this would come from a backend
const conceptualAdminEmail = "balusagnaneshsalesfor@gmail.com";

const conceptualUsers = [
  { id: 'user-alpha-123', email: 'user1@example.com', lastActivity: '2024-05-20', totalLinks: 15, totalTabs: 3, deletedItemsCount: 5 },
  { id: 'user-beta-456', email: 'user2@example.com', lastActivity: '2024-05-21', totalLinks: 5, totalTabs: 1, deletedItemsCount: 2 },
  { id: 'user-gamma-789', email: 'user3@example.com', lastActivity: '2024-05-19', totalLinks: 32, totalTabs: 7, deletedItemsCount: 10 },
];

const conceptualTickets = [
  { id: 'TICKET-001', userId: 'user-alpha-123', query: 'Issue with link preview for specific news site...', status: 'Open', submittedAt: '2024-05-21 10:00 IST' },
  { id: 'TICKET-002', userId: 'user-beta-456', query: 'Feature request for custom tags on links...', status: 'Pending Review', submittedAt: '2024-05-20 14:30 IST' },
  { id: 'TICKET-003', userId: 'user-gamma-789', query: 'Restore deleted history for tab "Project X Research"...', status: 'In Progress', submittedAt: '2024-05-19 09:15 IST' },
];

// No-op toast function for conceptual actions if useToast isn't set up for server components
const conceptualToast = ({ title, description, variant }: { title: string, description?: string, variant?: string}) => {
  console.log(`Conceptual Toast: ${title} - ${description} (Variant: ${variant})`);
};


export default function AdminDashboardPage() {
  // const { toast } = useToast(); // useToast can only be used in client components.
  // For this conceptual page, we'll use a console log or a simplified toast-like message.

  const handleViewDetails = (userId: string) => {
     conceptualToast({
      title: "View User Details (Conceptual)",
      description: `Displaying details for user ${userId}. Requires backend integration.`,
    });
  };

  const handleViewTicket = (ticketId: string) => {
    conceptualToast({
      title: "View Ticket (Conceptual)",
      description: `Opening ticket ${ticketId}. Requires backend integration for full ticket management system.`,
    });
  };


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto p-6 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" /> Logged in as: <span className="font-semibold text-foreground">{conceptualAdminEmail}</span>
            </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users (Conceptual)</CardTitle>
                    <User className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{conceptualUsers.length}</div>
                    <p className="text-xs text-muted-foreground">Number of registered users</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Open Tickets (Conceptual)</CardTitle>
                    <ListChecks className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{conceptualTickets.filter(t => t.status === 'Open').length}</div>
                    <p className="text-xs text-muted-foreground">Support tickets requiring attention</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">System Status (Conceptual)</CardTitle>
                    <ShieldAlert className="h-5 w-5 text-green-500" /> {/* Direct color for emphasis */}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">Operational</div>
                    <p className="text-xs text-muted-foreground">All systems functioning normally</p>
                </CardContent>
            </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Management (Conceptual)</CardTitle>
            <CardDescription>
              Overview of user accounts and activity. Full functionality requires backend integration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead className="text-right">Links / Tabs</TableHead>
                  <TableHead className="text-right">Deleted Items</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conceptualUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-mono text-xs">{user.id}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.lastActivity}</TableCell>
                    <TableCell className="text-right">{user.totalLinks} / {user.totalTabs}</TableCell>
                    <TableCell className="text-right">{user.deletedItemsCount}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(user.id)}>
                        <Eye className="mr-1.5 h-4 w-4" /> View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
             <p className="text-sm text-muted-foreground mt-4 text-center">
                Clicking "View Details" would conceptually show user-specific data, including their deleted items, and provide options for account management or data restoration if a backend were integrated.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Support Ticket Queue (Conceptual)</CardTitle>
            <CardDescription>
              Manage and respond to user-submitted support tickets. Full functionality requires backend integration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Ticket ID</TableHead>
                        <TableHead>User ID</TableHead>
                        <TableHead>Query Snippet</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {conceptualTickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                            <TableCell className="font-mono text-xs">{ticket.id}</TableCell>
                            <TableCell className="font-mono text-xs">{ticket.userId}</TableCell>
                            <TableCell className="truncate max-w-xs">{ticket.query}</TableCell>
                            <TableCell>
                                <Badge variant={ticket.status === 'Open' ? 'destructive' : ticket.status === 'In Progress' ? 'default' : 'secondary'}>
                                    {ticket.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{ticket.submittedAt}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="outline" size="sm" onClick={() => handleViewTicket(ticket.id)}>
                                   <Eye className="mr-1.5 h-4 w-4" /> View Ticket
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <p className="text-sm text-muted-foreground mt-4 text-center">
                Admins would be able to view full ticket details, assign them, update status, and communicate with users. Actions like restoring data based on a ticket would be performed here (requires backend).
            </p>
          </CardContent>
        </Card>
        
         <Card className="bg-primary/10 dark:bg-primary/20 border-primary/30 dark:border-primary/40">
          <CardHeader>
            <CardTitle className="text-primary dark:text-primary-foreground/90">Future Admin Features (Conceptual)</CardTitle>
          </CardHeader>
          <CardContent className="text-foreground/80 dark:text-foreground/70 text-sm space-y-2">
            <p>• Detailed system analytics and reporting dashboard.</p>
            <p>• Content moderation tools (if applicable).</p>
            <p>• User role and permission management (e.g., create new admins, assign tasks).</p>
            <p>• Feature flag management and A/B testing controls.</p>
            <p>• Audit logs for admin actions.</p>
            <p>• Backup and restore management for the entire platform.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

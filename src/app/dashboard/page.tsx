
import { AppHeader } from '@/components/AppHeader';
import { Dashboard } from '@/components/Dashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Todlex',
  description: 'Organize your links with ease on the Todlex Kanban board.',
};

// Conceptual obfuscated email for display
const conceptualUserEmail = "user@example.com";
const obfuscateEmail = (email: string) => {
  if (!email) return "";
  const atIndex = email.indexOf('@');
  if (atIndex === -1 || atIndex < 5) return email; // Return as is if no '@' or prefix is too short
  return `${email.substring(0, 5)}...@${email.substring(atIndex + 1)}`;
};


export default function DashboardPage() {
  // Note: This is a conceptual display. Actual user data would come from an auth system.
  // The ConceptualUserDisplay is now in AppHeader for a more global feel,
  // but if you wanted it specifically on this page, you could add:
  // <p className="text-sm text-muted-foreground text-center py-2">
  //   Logged in as: {obfuscateEmail(conceptualUserEmail)} (Conceptual)
  // </p>
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <Dashboard />
    </div>
  );
}

    
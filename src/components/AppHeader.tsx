
"use client";

import Link from 'next/link';
import { Menu, History, LayoutDashboard } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import * as React from 'react';
import { usePathname } from 'next/navigation'; // For checking current route

// Simple abstract SVG icon for Todlex
const TodlexIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="16" width="16" height="4" rx="1" />
    <rect x="6" y="10" width="12" height="4" rx="1" />
    <rect x="8" y="4" width="8" height="4" rx="1" />
  </svg>
);

export function AppHeader() {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const pathname = usePathname();
  const isAdminDashboard = pathname === '/admin/dashboard';

  const navItems = [
    { href: '/dashboard', label: isAdminDashboard ? 'User Dashboard' : 'Dashboard', icon: <LayoutDashboard className="mr-2 h-5 w-5" /> },
    { href: '/analytics', label: 'Analytics', icon: <LayoutDashboard className="mr-2 h-5 w-5" /> }, // Consider a more specific icon
    { href: '/history', label: 'History', icon: <History className="mr-2 h-5 w-5" /> },
    { href: '/settings', label: 'Settings', icon: <LayoutDashboard className="mr-2 h-5 w-5" /> }, // Consider a more specific icon
  ];

  return (
    <header className="py-3 px-6 sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/40 [@supports(backdrop-filter:blur(0))]:bg-background/55">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] sm:w-[300px]">
              <SheetHeader className="mb-6">
                <SheetTitle>
                  <Link href="/" className="flex items-center gap-2 text-primary" onClick={() => setIsSheetOpen(false)}>
                    <TodlexIcon />
                    <span className="text-xl font-semibold">Todlex</span>
                  </Link>
                </SheetTitle>
                <SheetDescription>
                  Navigate through your application.
                </SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-muted flex items-center"
                    >
                      {item.icon} {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href={isAdminDashboard ? "/admin/dashboard" : "/dashboard"} className="flex items-center gap-2 text-primary">
            <TodlexIcon />
            <h1 className="text-2xl font-semibold text-foreground">Todlex {isAdminDashboard ? <span className="text-sm text-muted-foreground">(Admin)</span> : ""}</h1>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-1 rounded-full bg-card/60 px-2 py-1 border border-border/40 backdrop-blur">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  `relative px-4 py-1.5 text-sm font-medium rounded-full transition-colors ` +
                  (active
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40')
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}


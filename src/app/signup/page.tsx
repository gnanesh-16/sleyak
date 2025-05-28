
"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from "@/lib/utils";

// Simple abstract SVG icon for Todlex
const TodlexLogo = ({className}: {className?: string}) => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M6 18H18V16H6V18ZM6 14H18V12H6V14ZM6 10H18V8H6V10Z" />
    <path d="M4 20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V4C20 2.89543 19.1046 2 18 2H6C4.89543 2 4 2.89543 4 4V20ZM6 4H18V20H6V4Z" fillOpacity="0.3"/>
  </svg>
);

export default function SignupPage() {
  const { toast } = useToast();
  const router = useRouter();

  const handleSignup = (event: React.FormEvent) => {
    event.preventDefault();
    // Conceptual signup
    toast({
      title: "Signup Attempt (Conceptual)",
      description: "In a real app, this would create a new user. Navigating to dashboard...",
    });
    // Simulate navigation after a delay
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className={cn("min-h-screen w-full lg:grid lg:grid-cols-2 dots-background dark")}>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-card text-card-foreground shadow-2xl lg:shadow-none relative">
         <Link href="/" className="absolute top-6 left-6 lg:hidden text-primary hover:underline text-sm flex items-center">
            <ArrowRight className="h-4 w-4 mr-1 transform rotate-180" /> Back to Home
        </Link>
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
             <Link href="/" className="flex justify-center items-center gap-2 mb-4">
                <TodlexLogo className="h-10 w-10 text-primary"/>
                <span className="text-3xl font-bold text-primary">Todlex</span>
            </Link>
            <h1 className="text-3xl font-bold">Create an Account</h1>
            <p className="text-balance text-muted-foreground">
              Join Todlex and start organizing your links smartly.
            </p>
          </div>
          <form onSubmit={handleSignup} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" required className="bg-input"/>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="bg-input"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required className="bg-input"/>
            </div>
            <Button type="submit" className="w-full text-lg py-6 mt-2">
             <UserPlus className="mr-2 h-5 w-5" /> Create Account
            </Button>
             <Button variant="outline" className="w-full" type="button" onClick={() => toast({title: "Conceptual Signup", description: "Google Sign-Up (Conceptual)"})}>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21.35 12.04C21.35 11.36 21.29 10.72 21.17 10.11H12.21V13.74H17.39C17.16 14.94 16.53 15.94 15.52 16.61V18.8H18.48C20.24 17.2 21.35 14.82 21.35 12.04Z" fill="#4285F4"/><path d="M12.21 22C14.88 22 17.11 21.11 18.48 19.56L15.52 17.36C14.69 17.93 13.54 18.27 12.21 18.27C9.84 18.27 7.82 16.76 7.03 14.56H4V16.84C5.37 19.53 8.53 22 12.21 22Z" fill="#34A853"/><path d="M7.03 13.71C6.85 13.19 6.74 12.62 6.74 12C6.74 11.38 6.85 10.81 7.03 10.29V8H4C3.16 9.66 2.65 11.11 2.65 12C2.65 12.89 3.16 14.34 4 16L7.03 13.71Z" fill="#FBBC05"/><path d="M12.21 5.73C13.62 5.73 14.96 6.21 15.95 7.14L18.54 4.55C17.03 3.23 14.81 2.5 12.21 2.5C8.53 2.5 5.37 4.47 4 7.16L7.03 9.44C7.82 7.24 9.84 5.73 12.21 5.73Z" fill="#EA4335"/></svg>
              Sign up with Google
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline text-primary hover:text-primary/80">
              Login
            </Link>
          </div>
        </div>
      </div>
       <div className="hidden bg-background/40 lg:flex items-center justify-center p-10">
         <div className="text-center">
            <Image
              src="https://placehold.co/600x400.png"
              alt="Todlex Feature Showcase"
              width={500}
              height={350}
              className="rounded-lg shadow-2xl object-cover"
              data-ai-hint="app interface design"
            />
            <h2 className="mt-8 text-3xl font-bold text-foreground">Unlock Seamless Organization</h2>
            <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                Join Todlex today and experience a new era of link management. Effortless, intuitive, and powerful.
            </p>
        </div>
      </div>
    </div>
  );
}

    
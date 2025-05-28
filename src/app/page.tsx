
"use client";

import { Button } from '@/components/ui/button';
import {
    ArrowRight,
    CheckCircle,
    Zap,
    Eye,
    Users,
    Edit,
    Search,
    ClipboardPaste,
    CalendarClock,
    Settings2,
    UserCog,
    Palette as PaletteIcon,
    HelpCircle as HelpCircleIcon,
    ChevronDown,
    LayoutDashboard,
    ShieldCheck,
    MessageSquareQuestion,
    LayoutGrid,
    Sparkles,
    Target,
    BookOpen,
    Lightbulb,
    Briefcase,
    FileText,
    Bookmark,
    Share2,
    Copy,
    Link as LinkIconLucide, // Renamed to avoid conflict with Next.js Link
    Instagram,
    Twitter,
    Globe
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardSkeleton } from '@/components/DashboardSkeleton';
import Image from 'next/image';
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';


const TodlexLogo = ({className}: {className?: string}) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={cn("text-primary", className)}>
    <path d="M6 18H18V16H6V18ZM6 14H18V12H6V14ZM6 10H18V8H6V10Z" />
    <path d="M4 20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V4C20 2.89543 19.1046 2 18 2H6C4.89543 2 4 2.89543 4 4V20ZM6 4H18V20H6V4Z" fillOpacity="0.3"/>
  </svg>
);

const CompanyLogoPlaceholder = ({ name, className }: { name: string, className?: string }) => (
  <div className={cn("h-12 w-32 flex items-center justify-center text-sm font-semibold bg-card/10 text-foreground/70 rounded-lg shadow-sm mx-4", className)}>
    {name}
  </div>
);


const AdminLoginModal = ({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (open: boolean) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  const handleAdminLogin = () => {
    if (email === "balusagnaneshsalesfor@gmail.com" && password === "mygnaneshsales@1234&^%$8") {
      toast({
        title: "Admin Login Successful (Conceptual)",
        description: "Redirecting to conceptual admin dashboard...",
      });
      onOpenChange(false);
      router.push('/admin/dashboard');
    } else {
      toast({
        title: "Admin Login Failed (Conceptual)",
        description: "Invalid email or password.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md data-[state=open]:motion-safe:animate-fadeIn data-[state=closed]:motion-safe:animate-fadeOut bg-card/95 backdrop-blur-md dark">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2 text-foreground"><UserCog className="h-6 w-6 text-primary"/> Admin Login</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter administrator credentials to access the admin panel.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email" className="text-muted-foreground">Email</Label>
            <Input
              id="admin-email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-input border-border focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password" className="text-muted-foreground">Password</Label>
            <Input
              id="admin-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-input border-border focus:ring-primary"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="button" onClick={handleAdminLogin} className="bg-primary text-primary-foreground hover:bg-primary/90">Login</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const AnimatedScrollSection: React.FC<{children: React.ReactNode, className?: string, delay?: string }> = ({ children, className, delay }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        threshold: 0.1, 
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current && observer) { // Ensure ref.current and observer exist before unobserving
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div 
      ref={ref} 
      className={cn("scroll-animate", isVisible && "is-visible", className)}
      style={{ transitionDelay: isVisible ? delay : undefined }}
    >
      {children}
    </div>
  );
};


export default function LandingPage() {
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const handleGetStartedClick = () => {
    setIsLoadingDashboard(true);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoadingDashboard) {
      timer = setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoadingDashboard, router]);

  if (isLoadingDashboard) {
    return <DashboardSkeleton />;
  }

  const coreFeatures = [
    {
      icon: <Zap className="h-7 w-7 text-primary" />,
      title: "Effortless Capture",
      description: "Paste links. Todlex auto-organizes by date.",
    },
    {
      icon: <Eye className="h-7 w-7 text-primary" />,
      title: "Visual Timeline",
      description: "Clean board, rich previews, grouped by date.",
    },
    {
      icon: <CheckCircle className="h-7 w-7 text-primary" />,
      title: "Actionable Links",
      description: "Assign to-do dates. Turn links into tasks.",
    },
     {
      icon: <LayoutGrid className="h-7 w-7 text-primary" />,
      title: "Organized Views",
      description: "Navigate history with intuitive date tabbing.",
    },
  ];

  const useCases = [
    {
      icon: <Search className="h-8 w-8 text-primary" />,
      title: "Researchers & Students",
      description: "Collect sources, organized by discovery date. Add to-do dates for review.",
    },
    {
      icon: <Edit className="h-8 w-8 text-primary" />,
      title: "Content Creators",
      description: "Save inspiration. Build your content repository chronologically.",
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Project Managers",
      description: "Track resources related to project milestones over time.",
    },
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: "Personal Productivity",
      description: "Save articles, tutorials. Create a personal knowledge timeline.",
    }
  ];

  const howItWorksSteps = [
    {
      step: 1,
      icon: <ClipboardPaste className="h-10 w-10 text-primary mb-3" />,
      title: "Paste Any Link",
      description: "Copy a URL and paste it into your active Todlex date tab."
    },
    {
      step: 2,
      icon: <CalendarClock className="h-10 w-10 text-primary mb-3" />,
      title: "Auto-Organized",
      description: "Todlex fetches metadata and organizes your link by date."
    },
    {
      step: 3,
      icon: <Settings2 className="h-10 w-10 text-primary mb-3" />,
      title: "Manage & Act",
      description: "Find links easily, view previews, and assign to-do dates."
    }
  ];

  return (
    <div className={cn(
        "flex flex-col min-h-screen bg-background text-foreground dark dots-background", 
        isAdminLoginOpen && "blur-sm" 
      )}>
      {/* Header */}
      <header className="py-3 px-6 sm:px-8 sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TodlexLogo />
            <span className="text-xl font-semibold text-foreground">Todlex</span>
          </div>
          <div className="flex items-center gap-2">
             <Button variant="ghost" size="sm" onClick={() => router.push('/login')} className="text-xs text-muted-foreground hover:text-foreground hidden sm:inline-flex">
              Login
            </Button>
            <Button variant="ghost" size="sm" onClick={() => router.push('/signup')} className="text-xs text-muted-foreground hover:text-foreground hidden sm:inline-flex">
              Sign Up
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsAdminLoginOpen(true)} className="text-xs text-muted-foreground hover:text-foreground">
              <UserCog className="mr-1.5 h-3.5 w-3.5" /> Admin
            </Button>
             <Button variant="default" onClick={handleGetStartedClick} className="text-sm font-medium rounded-full px-5 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Go to App <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="relative hero-gradient-background rounded-b-3xl md:rounded-b-[3rem] overflow-hidden">
          <div className="container mx-auto px-6 py-24 md:py-40 text-center flex flex-col items-center">
            {/* Title removed as per request */}
            <AnimatedScrollSection delay="0.1s">
              <p className="text-lg sm:text-xl text-slate-200/90 mb-10 leading-relaxed max-w-2xl mx-auto">
                Transform scattered links into an organized, actionable, and visual timeline. Capture, manage, and revisit content effortlessly.
              </p>
            </AnimatedScrollSection>
            <AnimatedScrollSection delay="0.2s">
              <Button
                size="lg"
                className="text-lg py-7 px-12 rounded-full shadow-2xl bg-white text-slate-900 hover:bg-slate-200 transition-all duration-300 transform hover:scale-105"
                onClick={handleGetStartedClick}
              >
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </AnimatedScrollSection>
          </div>
        </section>
        
        
        {/* Core Features Section */}
        <AnimatedScrollSection className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-16 [text-shadow:0_1px_3px_hsl(var(--foreground)/0.1)]">
              Why Todlex is Different
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {coreFeatures.map((feature, index) => (
                <AnimatedScrollSection key={index} delay={`${index * 0.1}s`}>
                  <div className="bg-card/80 backdrop-blur-sm p-6 rounded-xl shadow-lg perspective-hover flex flex-col items-center text-center border border-border/50">
                    <div className="p-3 bg-primary/10 rounded-full mb-5 inline-block">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </AnimatedScrollSection>
              ))}
            </div>
          </div>
        </AnimatedScrollSection>

        {/* How It Works Section */}
        <AnimatedScrollSection className="py-16 md:py-24 bg-card/30">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4 [text-shadow:0_1px_3px_hsl(var(--foreground)/0.1)]">Get Started in Seconds</h2>
            <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
              Organizing your digital life with Todlex is simple and intuitive.
            </p>
            <div className="grid md:grid-cols-3 gap-x-8 gap-y-12">
              {howItWorksSteps.map((step, index) => (
                 <AnimatedScrollSection key={step.step} delay={`${index * 0.1}s`}>
                    <div className="bg-card p-8 rounded-xl shadow-lg text-center border border-border/50 perspective-hover">
                      <div className="relative mb-5">
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground h-10 w-10 rounded-full flex items-center justify-center text-lg font-bold shadow-md border-2 border-background">
                          {step.step}
                        </div>
                        <div className="pt-6 flex justify-center">{step.icon}</div>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                      <p className="text-muted-foreground text-sm">{step.description}</p>
                    </div>
                 </AnimatedScrollSection>
              ))}
            </div>
          </div>
        </AnimatedScrollSection>
        
        {/* "Todlex in Action" Visual Section Placeholder */}
        <AnimatedScrollSection className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5 [text-shadow:0_1px_3px_hsl(var(--foreground)/0.1)]">Todlex in Action</h2>
            <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
              See how Todlex transforms your link management into a visual and organized experience.
            </p>
            <div className="bg-card p-2 md:p-3 rounded-xl shadow-2xl inline-block border border-border/50 hover:scale-[1.02] transition-transform duration-300 max-w-4xl mx-auto">
              <Image
                src="https://placehold.co/800x500.png"
                alt="Todlex Dashboard Preview"
                width={800}
                height={500}
                className="rounded-lg"
                data-ai-hint="kanban board productivity"
              />
            </div>
          </div>
        </AnimatedScrollSection>

        {/* Use Cases Section */}
        <AnimatedScrollSection className="py-16 md:py-24 bg-card/30">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4 [text-shadow:0_1px_3px_hsl(var(--foreground)/0.1)]">Perfect For...</h2>
                <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
                    Todlex adapts to your workflow, whether you're a student, professional, or curious learner.
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {useCases.map((useCase, index) => (
                       <AnimatedScrollSection key={index} delay={`${index * 0.05}s`}>
                        <div className="bg-card p-8 rounded-xl shadow-lg perspective-hover border border-border/50">
                            <div className="mb-5 flex justify-center">
                                {useCase.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2 text-center">{useCase.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed text-center">{useCase.description}</p>
                        </div>
                       </AnimatedScrollSection>
                    ))}
                </div>
            </div>
        </AnimatedScrollSection>

      </main>

      {/* Footer */}
      <footer className="py-10 border-t border-border/30 bg-card/20">
        <div className="container mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
                <TodlexLogo className="h-7 w-7"/> <span className="text-lg font-semibold text-foreground">Todlex</span>
            </div>
            <p className="text-sm text-muted-foreground">
                Simplifying your digital life, one link at a time.
            </p>
            <p className="text-xs text-muted-foreground mt-6">
                {currentYear !== null ? `© ${currentYear} Todlex. All rights reserved.` : '© Todlex. All rights reserved.'}
            </p>
        </div>
      </footer>
      {isAdminLoginOpen && (
         <div
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm" 
            onClick={() => setIsAdminLoginOpen(false)}
          />
      )}
      <AdminLoginModal isOpen={isAdminLoginOpen} onOpenChange={setIsAdminLoginOpen} />
    </div>
  );
}

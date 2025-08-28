
"use client";

import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Eye, CheckCircle, LayoutGrid, Sparkles, Cpu, Workflow, Globe2, Calendar as CalendarIcon } from 'lucide-react';
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


const TodlexLogo = ({ className }: { className?: string }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={cn("text-primary", className)}>
    <path d="M6 18H18V16H6V18ZM6 14H18V12H6V14ZM6 10H18V8H6V10Z" />
    <path d="M4 20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V4C20 2.89543 19.1046 2 18 2H6C4.89543 2 4 2.89543 4 4V20ZM6 4H18V20H6V4Z" fillOpacity="0.3" />
  </svg>
);

const CompanyLogoPlaceholder = ({ name, className }: { name: string, className?: string }) => (
  <div className={cn("h-12 w-32 flex items-center justify-center text-sm font-semibold bg-card/10 text-foreground/70 rounded-lg shadow-sm mx-4", className)}>
    {name}
  </div>
);


// Admin & auth removed per 2025 redesign requirements.

const AnimatedScrollSection: React.FC<{ children: React.ReactNode, className?: string, delay?: string }> = ({ children, className, delay }) => {
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
  // Auth removed; state cleaned.
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const handleGetStartedClick = () => setIsLoadingDashboard(true);

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

  const featureHighlights = [
    { icon: <Zap className="h-6 w-6" />, title: "Zero-Friction Capture", blurb: "Just paste. We enrich & categorize instantly." },
    { icon: <Eye className="h-6 w-6" />, title: "Temporal Memory", blurb: "Revisit what you found—organized by day." },
    { icon: <CheckCircle className="h-6 w-6" />, title: "Act On It", blurb: "Convert links into dated micro‑tasks." },
    { icon: <LayoutGrid className="h-6 w-6" />, title: "Adaptive Tabs", blurb: "Date-driven views that evolve with you." },
    { icon: <Sparkles className="h-6 w-6" />, title: "Smart Metadata", blurb: "Auto preview, favicon, OG & context." },
    { icon: <Cpu className="h-6 w-6" />, title: "Future‑Ready AI", blurb: "Genkit pipeline foundation for next upgrades." },
    { icon: <Workflow className="h-6 w-6" />, title: "Flow-State UX", blurb: "Keyboard & paste-first interactions." },
    { icon: <CalendarIcon className="h-6 w-6" />, title: "Time Awareness", blurb: "Today / Yesterday semantics built‑in." },
  ];

  const processPillars = [
    { step: "01", title: "Capture", desc: "Paste or drop any URL. Instant ingestion." },
    { step: "02", title: "Enrich", desc: "Metadata, visuals & ordering applied." },
    { step: "03", title: "Organize", desc: "Date tabs + manual grouping when needed." },
    { step: "04", title: "Act", desc: "Assign dates; surface what matters today." },
  ];

  return (
    <div className={cn("dark flex flex-col min-h-screen bg-black text-foreground relative")}>
      {/* Header */}
      <header className="py-4 px-6 sm:px-10 sticky top-0 z-50 backdrop-blur-xl bg-black/70 border-b border-border/40">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TodlexLogo />
            <span className="text-xl font-semibold tracking-tight">Todlex</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="default" onClick={handleGetStartedClick} className="text-sm font-medium rounded-full px-6 h-10 shadow-md shadow-primary/20">
              Open App <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="relative overflow-hidden bg-black">
          <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(circle_at_center,white,transparent)] bg-[radial-gradient(circle_at_30%_30%,hsl(var(--primary)/0.15),transparent_60%),radial-gradient(circle_at_70%_70%,hsl(var(--primary)/0.08),transparent_60%)]" />
          <div className="container mx-auto px-6 pt-28 pb-24 md:pt-36 md:pb-40 text-center flex flex-col items-center relative">
            <AnimatedScrollSection delay="0.05s">
              <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-foreground mb-6 max-w-5xl leading-[1.05]">
                The temporal workspace <br className="hidden md:block" />
              </h1>
            </AnimatedScrollSection>
            <AnimatedScrollSection delay="0.15s">
              <p className="text-base md:text-xl text-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
                Capture first. Structure emerges automatically. Stop shoving URLs into endless folders—experience a living day‑by‑day canvas.
              </p>
            </AnimatedScrollSection>
            <AnimatedScrollSection delay="0.25s">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button size="lg" onClick={handleGetStartedClick} className="h-14 px-10 rounded-full text-base font-medium bg-primary relative overflow-hidden">
                  <span className="relative z-10 flex items-center">Start Organizing <ArrowRight className="ml-2 h-5 w-5" /></span>
                </Button>
                <Button size="lg" variant="outline" onClick={handleGetStartedClick} className="h-14 px-10 rounded-full text-base font-medium backdrop-blur supports-[backdrop-filter]:bg-background/50">
                  Live Demo
                </Button>
              </div>
            </AnimatedScrollSection>
          </div>
        </section>


        {/* Core Features Section */}
        <AnimatedScrollSection className="py-24 bg-black border-t border-border/30">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 mb-14">
              <div>
                <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">Built for velocity</h2>
                <p className="text-foreground max-w-xl text-base md:text-lg">A modern spatial layer over your research, learning & execution. Design language optimized for 2025 attention patterns: low chrome, high semantic contrast.</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {featureHighlights.map((f, i) => (
                <AnimatedScrollSection key={f.title} delay={`${i * 0.05}s`}>
                  <div className="group relative h-full rounded-2xl border border-border/40 bg-gradient-to-b from-card/80 to-card/40 backdrop-blur-sm p-5 flex flex-col overflow-hidden">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.12),transparent_60%)]" />
                    <div className="flex items-center gap-3 mb-4">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">{f.icon}</span>
                      <h3 className="text-base font-medium leading-tight">{f.title}</h3>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed pr-2">{f.blurb}</p>
                  </div>
                </AnimatedScrollSection>
              ))}
            </div>
          </div>
        </AnimatedScrollSection>

        {/* How It Works Section */}
        <AnimatedScrollSection className="py-24 bg-black border-y border-border/30">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-center mb-4">Flow pipeline</h2>
            <p className="text-center text-foreground max-w-2xl mx-auto mb-16">A four stage lifecycle. Optimized for mental load reduction and recall.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {processPillars.map((p, i) => (
                <AnimatedScrollSection key={p.step} delay={`${i * 0.07}s`}>
                  <div className="relative h-full rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-6 flex flex-col">
                    <div className="mb-6 flex items-center justify-between">
                      <span className="text-xs font-mono tracking-widest text-primary/80">{p.step}</span>
                      <span className="w-2 h-2 rounded-full bg-primary/70 shadow-[0_0_0_4px_hsl(var(--primary)/0.15)]" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">{p.title}</h3>
                    <p className="text-sm text-foreground leading-relaxed">{p.desc}</p>
                  </div>
                </AnimatedScrollSection>
              ))}
            </div>
          </div>
        </AnimatedScrollSection>

        {/* "Todlex in Action" Visual Section Placeholder */}
        <AnimatedScrollSection className="py-28 bg-black relative">
          <div className="container mx-auto px-6">
            <div className="relative rounded-3xl border border-border/40 bg-gradient-to-br from-card/70 via-card/40 to-card/20 p-10 md:p-16 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-60 bg-[linear-gradient(120deg,hsl(var(--primary)/0.08),transparent_40%,transparent),radial-gradient(circle_at_80%_20%,hsl(var(--primary)/0.12),transparent_55%)]" />
              <div className="relative z-10 max-w-3xl">
                <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-6">Your cognition layer</h2>
                <p className="text-foreground text-base md:text-lg leading-relaxed mb-10">A single temporal surface for research bursts, learning sprints & execution context. No account required—jump straight into structured clarity.</p>
                <Button size="lg" onClick={handleGetStartedClick} className="h-14 px-10 rounded-full text-base font-medium shadow-lg shadow-primary/25">Launch Now <ArrowRight className="ml-2 h-5 w-5" /></Button>
              </div>
            </div>
          </div>
        </AnimatedScrollSection>

        {/* Use Cases Section */}
        {/* Removed "Perfect For" section per new concise narrative focus */}

      </main>

      {/* Footer */}
      <footer className="py-10 border-t border-border/30 bg-black">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <TodlexLogo className="h-7 w-7" /> <span className="text-lg font-semibold text-foreground">Todlex</span>
          </div>
          <p className="text-sm text-foreground">
            Simplifying your digital life, one link at a time.
          </p>
          <p className="text-xs text-foreground mt-6">
            {currentYear !== null ? `© ${currentYear} Todlex. All rights reserved.` : '© Todlex. All rights reserved.'}
          </p>
        </div>
      </footer>
      {/* Auth/admin modal removed */}
    </div>
  );
}

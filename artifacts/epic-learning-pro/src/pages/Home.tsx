import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ArrowRight, BookOpen, Star, Mail, CheckCircle2, 
  MessageCircle, Users, FileEdit, Award, ChevronLeft, ChevronRight,
  Send, Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import logoPath from "@assets/logo_1786572107482.png";
import oliviaPath from "@assets/olivia.cropped_1786576741119.png";
import octaviaPath from "@assets/octavia.cropped_1786576741121.png";
import mikellePath from "@assets/mikelle.cropped_1786576741122.png";

// Gold spark particle effect on click
function useSparks() {
  useEffect(() => {
    const handleMouseClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a') || target.closest('input') || target.closest('textarea') || target.closest('select')) return;
      const { clientX, clientY } = e;
      const numSparks = Math.floor(Math.random() * 5) + 8;
      for (let i = 0; i < numSparks; i++) createSpark(clientX, clientY);
    };

    const createSpark = (x: number, y: number) => {
      const spark = document.createElement("div");
      spark.className = "fixed pointer-events-none rounded-full bg-[#CAA747] z-[9999]";
      spark.style.width = "4px";
      spark.style.height = "4px";
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 60 + 30;
      const duration = Math.random() * 500 + 500;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;
      spark.animate(
        [{ transform: 'translate(0, 0) scale(1)', opacity: 0.8 }, { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }],
        { duration, easing: 'cubic-bezier(0.25, 1, 0.5, 1)', fill: 'forwards' }
      );
      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), duration);
    };

    window.addEventListener("click", handleMouseClick);
    return () => window.removeEventListener("click", handleMouseClick);
  }, []);
}

const FadeIn = ({ children, delay = 0, className = "", direction = "up" }: { children: React.ReactNode, delay?: number, className?: string, direction?: "up" | "left" | "right" | "none" }) => {
  let initial: any = { opacity: 0 };
  if (direction === "up") initial = { ...initial, y: 30 };
  if (direction === "left") initial = { ...initial, x: 30 };
  if (direction === "right") initial = { ...initial, x: -30 };
  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const testimonials = [
  { name: "Will F.", text: "Olivia is an icon in the teaching industry. Highly recommended!" },
  { name: "Robert W.", text: "Extremely knowledgeable and compassionate. Very professional." },
  { name: "Shannon D.", text: "The owner is amazing, hardworking and cares about everyone she does business with." },
  { name: "Irene B.", text: "Epic Pro teaches on a level that, learning never ends so why not enjoy it all the time cuz it's fun" },
  { name: "Dan D.", text: "Very knowledgeable and experienced!" },
];

const serviceOptions = [
  "Consulting & Coaching",
  "Professional Seminars",
  "Proofreading & Editing",
  "GED Coaching",
  "Homeschooling Coaching",
  "Special Needs Educational Coaching",
  "Other / Not Sure Yet",
];

export default function Home() {
  useSparks();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Testimonial carousel
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const prevTestimonial = useCallback(() => {
    setDirection(-1);
    setActiveIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);
  const nextTestimonial = useCallback(() => {
    setDirection(1);
    setActiveIdx((prev) => (prev + 1) % testimonials.length);
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => { setDirection(1); setActiveIdx((p) => (p + 1) % testimonials.length); }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Contact form
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = 'Name is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email';
    if (!form.service) errors.service = 'Please select a service';
    if (!form.message.trim()) errors.message = 'Message is required';
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setFormErrors({});
    setSubmitting(true);
    const subject = `Website Inquiry – ${form.service} – from ${form.name}`;
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      form.phone ? `Phone: ${form.phone}` : '',
      `Service of Interest: ${form.service}`,
      '',
      `Message:`,
      form.message,
    ].filter(Boolean).join('\n');
    window.open(`mailto:contact@epiclearningpro.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 400);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const navLinks = [
    { name: "Services", id: "services" },
    { name: "Testimonials", id: "social-proof" },
    { name: "About", id: "about" },
    { name: "FAQ", id: "faq" },
  ];

  const inputBase = "w-full rounded-xl border px-4 py-3 text-sm bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 transition-all";
  const inputError = "border-red-300 focus:ring-red-300/40";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">

      {/* ── Sticky Header ── */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/85 backdrop-blur-md shadow-sm border-b border-border/50 py-3" : "bg-transparent py-5"}`}>
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
          <button onClick={() => scrollTo('hero')} className="flex items-center gap-2 group outline-none" data-testid="link-logo-home">
            <img src={logoPath} alt="Epic Learning Pro Logo" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md" />
            <span className="font-serif font-semibold text-base sm:text-xl tracking-tight text-foreground transition-colors group-hover:text-primary hidden sm:block">Epic Learning Pro</span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <button key={link.name} onClick={() => scrollTo(link.id)} data-testid={`link-nav-${link.id}`}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors outline-none relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100">
                {link.name}
              </button>
            ))}
            <Button onClick={() => scrollTo('contact')} className="rounded-full shadow-md hover:shadow-lg transition-all" data-testid="button-header-cta">
              Let's Connect
            </Button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} data-testid="button-mobile-menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
              className="md:hidden absolute top-full left-0 w-full bg-white border-b border-border shadow-lg py-4 px-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <button key={link.name} onClick={() => scrollTo(link.id)}
                  className="text-left py-3 px-4 text-base font-medium text-foreground hover:bg-muted rounded-xl transition-colors">
                  {link.name}
                </button>
              ))}
              <Button onClick={() => scrollTo('contact')} className="w-full mt-2 rounded-full">Let's Connect</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Hero ── */}
      <section id="hero" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex items-center min-h-[90svh]">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-secondary/5 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20">
                <Star size={14} className="text-accent fill-accent" />
                <span>Making good lives great</span>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-semibold tracking-tight text-foreground mb-6 leading-tight">
                Professional Training{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">&amp; Services</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Imagine. Believe. Achieve. With over 30 years of experience, we help individuals and teams transform their potential into tangible results.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" onClick={() => scrollTo('contact')} data-testid="button-hero-cta"
                  className="rounded-full w-full sm:w-auto text-base h-14 px-8 shadow-lg hover:shadow-primary/25 transition-all group">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => scrollTo('services')} data-testid="button-hero-explore"
                  className="rounded-full w-full sm:w-auto text-base h-14 px-8">
                  Explore Services
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Problem / Agitate ── */}
      <section className="py-16 md:py-28 bg-muted/50 border-y border-border/50">
        <div className="container mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">Feeling stuck or overwhelmed?</h2>
              <p className="text-lg text-muted-foreground">You are not alone. Whether you're an individual facing a hurdle or a team struggling to connect, the path forward isn't always clear.</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {[
              { title: "Homeschooling & Special Needs", desc: "Overwhelmed parents trying to navigate homeschooling or a child's unique educational needs.", icon: Users },
              { title: "Career Roadblocks", desc: "Stuck without credentials like a GED, limiting your opportunities for advancement.", icon: Award },
              { title: "Team Friction", desc: "Teams with poor communication, unclear leadership, and misaligned goals.", icon: MessageCircle },
              { title: "Unprofessional Presence", desc: "Professional documents with errors that silently undermine your credibility.", icon: FileEdit },
              { title: "Weak Training Programs", desc: "Businesses lacking strong, engaging training that retains and empowers employees.", icon: BookOpen }
            ].map((pain, i) => (
              <FadeIn key={i} delay={0.08 * i} direction="up" className={i === 4 ? "sm:col-span-2 lg:col-span-1 lg:col-start-2" : ""}>
                <div className="bg-background rounded-2xl p-6 shadow-sm border border-border/50 h-full transition-transform hover:-translate-y-1 duration-300">
                  <div className="h-11 w-11 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
                    <pain.icon size={22} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{pain.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{pain.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.4} className="mt-12 text-center">
            <p className="text-xl font-medium text-foreground">We see you. We understand. And we know exactly how to help.</p>
          </FadeIn>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="py-16 md:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <FadeIn className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
            <h2 className="text-sm font-bold tracking-wider text-primary uppercase mb-3">Our Services</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold mb-5">Expertise that drives results.</h3>
            <p className="text-lg text-muted-foreground">From corporate training programs to individual coaching and professional editing, we tailor our approach to your specific goals.</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
            <FadeIn delay={0.1} className="flex h-full">
              <Card className="flex flex-col h-full border-border/60 shadow-md hover:shadow-xl hover:border-primary/30 transition-all duration-500 overflow-hidden group w-full">
                <div className="h-1.5 w-full bg-gradient-to-r from-primary to-primary/50" />
                <CardHeader className="pb-4">
                  <div className="h-13 w-13 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 text-primary p-2.5">
                    <Users size={26} />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-serif">Consulting & Coaching</CardTitle>
                  <CardDescription className="text-base pt-1">For Businesses & Individuals</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground mb-5 text-sm leading-relaxed">If your business values progress and proactivity, you need a strong training program. We create exciting educational plans unique to your team's needs. Well-trained, happy people perform better!</p>
                  <h4 className="font-semibold text-sm uppercase tracking-wide text-foreground mb-3">Specialties</h4>
                  <ul className="space-y-2">
                    {["Business Training Programs", "Leadership & HR Coaching", "GED Coaching", "Homeschooling & Special Needs"].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-0 pb-6 border-t border-border/50 mt-auto bg-muted/20">
                  <div className="pt-4 w-full text-sm text-muted-foreground italic">Negotiated hourly/weekly/monthly. Coaching bundles available.</div>
                </CardFooter>
              </Card>
            </FadeIn>

            <FadeIn delay={0.2} className="flex h-full">
              <Card className="flex flex-col h-full border-border/60 shadow-md hover:shadow-xl hover:border-secondary/30 transition-all duration-500 overflow-hidden group relative w-full">
                <div className="h-1.5 w-full bg-gradient-to-r from-secondary to-secondary/50" />
                <CardHeader className="pb-4 relative z-10">
                  <div className="h-13 w-13 rounded-2xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-secondary group-hover:text-white transition-all duration-300 text-secondary p-2.5">
                    <Award size={26} />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-serif">Professional Seminars</CardTitle>
                  <CardDescription className="text-base pt-1">Transform Your Team</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow relative z-10">
                  <p className="text-muted-foreground mb-5 text-sm leading-relaxed">Improve communication skills, gain expert knowledge, and expand focus with actionable seminars. Topics are matched to your training goals and team's specific interests.</p>
                  <h4 className="font-semibold text-sm uppercase tracking-wide text-foreground mb-3">Popular Topics</h4>
                  <ul className="space-y-2">
                    {["Intuitive Leadership Series", "Confident Communication", "Mental Health for Professionals", "Workflow & Organization"].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-0 pb-6 border-t border-border/50 mt-auto bg-muted/20 relative z-10">
                  <div className="pt-4 w-full text-sm text-muted-foreground italic">Offered as 1-3 day formats or 5 half-day sessions.</div>
                </CardFooter>
              </Card>
            </FadeIn>

            <FadeIn delay={0.3} className="flex h-full md:col-span-2 lg:col-span-1">
              <Card className="flex flex-col h-full border-border/60 shadow-md hover:shadow-xl hover:border-accent/50 transition-all duration-500 overflow-hidden group w-full">
                <div className="h-1.5 w-full bg-gradient-to-r from-accent to-accent/50" />
                <CardHeader className="pb-4">
                  <div className="h-13 w-13 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all duration-300 text-accent p-2.5">
                    <FileEdit size={26} />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-serif">Proofreading & Editing</CardTitle>
                  <CardDescription className="text-base pt-1">Polish Your Presence</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground mb-5 text-sm leading-relaxed">Ensure your company's written communication is flawless. Any professional document will be edited to perfection—accuracy of grammar, punctuation, usage, and context.</p>
                  <h4 className="font-semibold text-sm uppercase tracking-wide text-foreground mb-3">Documents Covered</h4>
                  <ul className="space-y-2">
                    {["Blogs, Newsletters & Emails", "Proposals & Contracts", "Professional Posts", "Essays & Articles"].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-0 pb-6 border-t border-border/50 mt-auto bg-muted/20">
                  <div className="pt-4 w-full text-sm text-muted-foreground italic">Pricing by word count or by project.</div>
                </CardFooter>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Social Proof — Carousel ── */}
      <section id="social-proof" className="py-16 md:py-28 bg-primary/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-4 sm:px-6">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 md:mb-14 gap-6">
            <FadeIn className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-3">Trusted by professionals.</h2>
              <p className="text-lg text-muted-foreground">Don't just take our word for it — here's what real clients say about working with Epic Learning Pro.</p>
            </FadeIn>
            <FadeIn delay={0.2} direction="left">
              <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-2xl shadow-sm border border-border shrink-0">
                <div className="text-4xl font-bold text-primary">30+</div>
                <div className="text-sm font-medium text-muted-foreground leading-tight">Years of<br />Experience</div>
              </div>
            </FadeIn>
          </div>

          {/* Carousel */}
          <FadeIn delay={0.1}>
            <div className="relative max-w-2xl mx-auto">
              {/* Card area */}
              <div className="overflow-hidden rounded-3xl">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={activeIdx}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -60 }}
                    transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                  >
                    <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
                      <CardHeader className="pb-3 pt-8 px-8 sm:px-10">
                        <div className="flex gap-1 mb-4">
                          {[...Array(5)].map((_, j) => <Star key={j} size={18} className="text-accent fill-accent" />)}
                        </div>
                      </CardHeader>
                      <CardContent className="px-8 sm:px-10 pb-8">
                        <p className="text-foreground text-lg sm:text-xl font-serif italic leading-relaxed mb-6">
                          "{testimonials[activeIdx].text}"
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-base shrink-0">
                            {testimonials[activeIdx].name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{testimonials[activeIdx].name}</p>
                            <p className="text-xs text-muted-foreground">Verified Alignable Review</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Arrow buttons */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={prevTestimonial}
                  data-testid="button-testimonial-prev"
                  className="h-11 w-11 rounded-full bg-white border border-border shadow-sm flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-all hover:shadow-md"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={20} />
                </button>

                {/* Dot indicators */}
                <div className="flex items-center gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setDirection(i > activeIdx ? 1 : -1); setActiveIdx(i); }}
                      data-testid={`button-testimonial-dot-${i}`}
                      className={`rounded-full transition-all duration-300 ${i === activeIdx ? 'w-6 h-2.5 bg-primary' : 'w-2.5 h-2.5 bg-primary/25 hover:bg-primary/50'}`}
                      aria-label={`Go to testimonial ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextTestimonial}
                  data-testid="button-testimonial-next"
                  className="h-11 w-11 rounded-full bg-white border border-border shadow-sm flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-all hover:shadow-md"
                  aria-label="Next testimonial"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Review count */}
              <p className="text-center text-sm text-muted-foreground mt-4">
                {activeIdx + 1} of {testimonials.length} reviews
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="py-16 md:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16 md:mb-24">
            <FadeIn direction="right">
              <h2 className="text-sm font-bold tracking-wider text-primary uppercase mb-3">About Us</h2>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold mb-5">Imagine. Believe. Achieve.</h3>
              <p className="text-xl font-medium text-foreground mb-5 border-l-4 border-accent pl-4">
                Epic Learning Pro is all about making good lives great!
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our certified educators have over 30 years of experience in enlightening minds, providing accurate information, and transforming dreams into reality. Whatever you can imagine, we'll help you achieve!
              </p>
              <div className="bg-muted p-6 rounded-2xl relative">
                <div className="absolute top-4 left-4 text-4xl text-primary/20 font-serif">"</div>
                <p className="text-lg font-serif italic text-foreground relative z-10 text-center">Whatever the mind can think and perceive, it can achieve.</p>
                <p className="text-sm text-muted-foreground text-center mt-3">— Napoleon Hill</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2} direction="left" className="relative order-first lg:order-last">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[2rem] transform rotate-3 scale-105 -z-10" />
              <img src={logoPath} alt="Epic Learning Pro" className="w-full max-w-xs sm:max-w-sm mx-auto rounded-full shadow-2xl bg-white p-4" />
            </FadeIn>
          </div>

          <FadeIn>
            <h3 className="text-2xl sm:text-3xl font-serif font-semibold mb-10 md:mb-14 text-center">Meet the Team</h3>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { name: "Olivia D Barlow", title: "Owner & Educator", suffix: "BS, MEd", img: oliviaPath },
              { name: "Octavia Barlow", title: "Scheduling & Operations Coordinator", suffix: "", img: octaviaPath },
              { name: "Mikelle Barlow", title: "Office Manager", suffix: "", img: mikellePath },
            ].map((member, i) => (
              <FadeIn key={i} delay={0.15 + i * 0.1} direction="up">
                <div className="group text-center">
                  <div className="relative mb-5 inline-block">
                    <div className="absolute inset-0 bg-primary rounded-full transform translate-y-2 translate-x-2 opacity-0 group-hover:opacity-20 transition-all duration-300" />
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 object-cover object-center rounded-full shadow-md border-4 border-white relative z-10"
                      data-testid={`img-team-${member.name.split(' ')[0].toLowerCase()}`}
                    />
                  </div>
                  <h4 className="text-lg sm:text-xl font-serif font-semibold">
                    {member.name}
                    {member.suffix && <span className="text-sm font-sans text-muted-foreground font-normal">, {member.suffix}</span>}
                  </h4>
                  <p className="text-primary font-medium mt-1 text-sm sm:text-base">{member.title}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-16 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <FadeIn className="text-center mb-10 md:mb-14">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">Common Questions</h2>
            <p className="text-lg text-muted-foreground">Everything you need to know about working with us.</p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <Accordion type="single" collapsible className="w-full space-y-3">
              {[
                {
                  q: "What types of coaching do you offer?",
                  a: "We offer coaching for both individuals and businesses. For individuals, we specialize in GED preparation, homeschooling guidance, and supporting parents of children with special needs. For businesses, we provide leadership coaching, HR professional coaching, and custom training program development."
                },
                {
                  q: "How are your seminars structured and priced?",
                  a: "Seminars are flexible to fit your team's schedule. They can be structured as 1-day, 2-day, or 3-day formats, or broken into 5 half-day sessions. After discussing your goals, we submit a tailored proposal for your review before any commitment is made."
                },
                {
                  q: "Do you work with individuals as well as businesses?",
                  a: "Absolutely. While we develop extensive corporate training and seminars for teams, we are deeply committed to individual success through one-on-one coaching bundles and educational support."
                },
                {
                  q: "How does proofreading and editing pricing work?",
                  a: "We offer flexible pricing structures to suit your needs. Depending on the size and frequency of the work, pricing is negotiated either by word count or as a flat fee per project."
                },
                {
                  q: "How do I get started?",
                  a: "The first step is a simple conversation. Fill out the form below or reach out to us directly. From there, we'll discuss your needs and craft a written proposal outlining the strategy, timeline, and pricing — with no pressure and no commitment until you're ready."
                },
              ].map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="bg-white border rounded-xl px-5 py-1 shadow-sm">
                  <AccordionTrigger className="text-base sm:text-lg font-medium hover:no-underline hover:text-primary transition-colors text-left py-4">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm sm:text-base pt-1 pb-4 leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeIn>
        </div>
      </section>

      {/* ── Contact / Final CTA ── */}
      <section id="contact" className="py-16 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#8B5FE6,#36A6DD)] -z-10" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(202,167,71,0.25)_0%,transparent_60%)] -z-10" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,95,230,0.3)_0%,transparent_60%)] -z-10" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Heading */}
            <FadeIn className="text-center mb-10 md:mb-14">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold text-white mb-4">Let's work together.</h2>
              <p className="text-lg sm:text-xl text-white/85 max-w-xl mx-auto font-light leading-relaxed">
                Ready to transform your team or take the next step in your personal journey? We'd love to hear from you.
              </p>
            </FadeIn>

            {/* Form card */}
            <FadeIn delay={0.15}>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                      <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-5">
                        <CheckCircle2 size={32} className="text-white" />
                      </div>
                      <h3 className="text-2xl font-serif font-semibold text-white mb-3">Message Sent!</h3>
                      <p className="text-white/80 max-w-md mx-auto mb-6 leading-relaxed">
                        Thank you for reaching out! Your email client should have opened with your message ready to send. Olivia will be in touch soon.
                      </p>
                      <button
                        onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', service: '', message: '' }); }}
                        className="text-white/70 hover:text-white text-sm underline underline-offset-4 transition-colors"
                      >
                        Send another message
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form key="form" onSubmit={handleSubmit} noValidate className="space-y-5">
                      {/* Name + Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-1.5" htmlFor="name">Full Name <span className="text-accent">*</span></label>
                          <input
                            id="name" name="name" type="text" autoComplete="name"
                            placeholder="Your name"
                            value={form.name} onChange={handleChange}
                            data-testid="input-contact-name"
                            className={`${inputBase} ${formErrors.name ? inputError : ''}`}
                          />
                          {formErrors.name && <p className="text-red-300 text-xs mt-1">{formErrors.name}</p>}
                        </div>
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-1.5" htmlFor="email">Email Address <span className="text-accent">*</span></label>
                          <input
                            id="email" name="email" type="email" autoComplete="email"
                            placeholder="you@example.com"
                            value={form.email} onChange={handleChange}
                            data-testid="input-contact-email"
                            className={`${inputBase} ${formErrors.email ? inputError : ''}`}
                          />
                          {formErrors.email && <p className="text-red-300 text-xs mt-1">{formErrors.email}</p>}
                        </div>
                      </div>

                      {/* Phone + Service */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-1.5" htmlFor="phone">
                            <span className="inline-flex items-center gap-1"><Phone size={13} /> Phone <span className="text-white/40 font-normal">(optional)</span></span>
                          </label>
                          <input
                            id="phone" name="phone" type="tel" autoComplete="tel"
                            placeholder="(555) 000-0000"
                            value={form.phone} onChange={handleChange}
                            data-testid="input-contact-phone"
                            className={inputBase}
                          />
                        </div>
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-1.5" htmlFor="service">Service of Interest <span className="text-accent">*</span></label>
                          <select
                            id="service" name="service"
                            value={form.service} onChange={handleChange}
                            data-testid="select-contact-service"
                            className={`${inputBase} ${formErrors.service ? inputError : ''} appearance-none cursor-pointer`}
                          >
                            <option value="" className="text-foreground bg-white">Select a service…</option>
                            {serviceOptions.map((opt) => <option key={opt} value={opt} className="text-foreground bg-white">{opt}</option>)}
                          </select>
                          {formErrors.service && <p className="text-red-300 text-xs mt-1">{formErrors.service}</p>}
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-1.5" htmlFor="message">Message <span className="text-accent">*</span></label>
                        <textarea
                          id="message" name="message" rows={5}
                          placeholder="Tell us a little about your goals or what you're looking for…"
                          value={form.message} onChange={handleChange}
                          data-testid="textarea-contact-message"
                          className={`${inputBase} resize-none ${formErrors.message ? inputError : ''}`}
                        />
                        {formErrors.message && <p className="text-red-300 text-xs mt-1">{formErrors.message}</p>}
                      </div>

                      {/* Submit */}
                      <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                        <button
                          type="submit"
                          disabled={submitting}
                          data-testid="button-contact-submit"
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-13 px-8 rounded-full bg-white text-primary font-semibold text-base hover:bg-white/90 hover:scale-105 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {submitting ? 'Opening email…' : 'Send Message'}
                          <Send size={16} />
                        </button>
                        <p className="text-white/50 text-xs text-center sm:text-left leading-snug">
                          This will open your email client with your message pre-filled. We typically respond within 24 hours.
                        </p>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>

            {/* Alternative contact links */}
            <FadeIn delay={0.3} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <a href="mailto:contact@epiclearningpro.com"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors">
                <Mail size={16} /> contact@epiclearningpro.com
              </a>
              <span className="hidden sm:block text-white/30">·</span>
              <a href="https://www.alignable.com/paulden-az/epic-learning-pro" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors">
                Connect on Alignable
              </a>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-foreground text-background py-10 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 mb-7">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-3 outline-none hover:opacity-80 transition-opacity" data-testid="button-footer-home">
              <img src={logoPath} alt="Logo" className="h-9 w-9 rounded-full bg-white p-1" />
              <span className="font-serif font-semibold text-lg tracking-tight">Epic Learning Pro</span>
            </button>
            <div className="flex items-center gap-5 text-sm text-muted/80">
              <a href="https://www.alignable.com/paulden-az/epic-learning-pro" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Alignable</a>
              <a href="mailto:contact@epiclearningpro.com" className="hover:text-white transition-colors">Email</a>
            </div>
          </div>
          <div className="border-t border-white/10 pt-7 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted/60">
            <p>Copyright 2026 © Epic Learning Pro. All rights reserved.</p>
            <p>Website Design by{' '}
              <a href="https://cliquestudios.io" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors">Clique Studios IO</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Menu, X, ArrowRight, BookOpen, Star, Mail, CheckCircle2, 
  MessageCircle, Users, FileEdit, Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import logoPath from "@assets/logo_1786572107482.png";
import oliviaPath from "@assets/olivia_1786572107483.png";
import octaviaPath from "@assets/octavia_1786572107483.png";
import mikellePath from "@assets/mikelle_1786572107483.png";

// Hook for particle effect
function useSparks() {
  useEffect(() => {
    const handleMouseClick = (e: MouseEvent) => {
      // Don't trigger on interactive elements to not distract
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a')) return;

      const { clientX, clientY } = e;
      const numSparks = Math.floor(Math.random() * 5) + 8; // 8-12 sparks

      for (let i = 0; i < numSparks; i++) {
        createSpark(clientX, clientY);
      }
    };

    const createSpark = (x: number, y: number) => {
      const spark = document.createElement("div");
      // Gold spark
      spark.className = "fixed pointer-events-none rounded-full bg-[#CAA747] z-[9999]";
      spark.style.width = "4px";
      spark.style.height = "4px";
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 60 + 30; // 30-90px distance
      const duration = Math.random() * 500 + 500; // 500-1000ms

      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;

      spark.animate(
        [
          { transform: 'translate(0, 0) scale(1)', opacity: 0.8 },
          { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
        ],
        {
          duration,
          easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
          fill: 'forwards'
        }
      );

      document.body.appendChild(spark);

      setTimeout(() => {
        spark.remove();
      }, duration);
    };

    window.addEventListener("click", handleMouseClick);
    return () => window.removeEventListener("click", handleMouseClick);
  }, []);
}

const FadeIn = ({ children, delay = 0, className = "", direction = "up" }: { children: React.ReactNode, delay?: number, className?: string, direction?: "up" | "left" | "right" | "none" }) => {
  let initial = { opacity: 0 };
  if (direction === "up") initial = { ...initial, y: 30 } as any;
  if (direction === "left") initial = { ...initial, x: 30 } as any;
  if (direction === "right") initial = { ...initial, x: -30 } as any;

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

export default function Home() {
  useSparks();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const navLinks = [
    { name: "Services", id: "services" },
    { name: "Testimonials", id: "social-proof" },
    { name: "About", id: "about" },
    { name: "FAQ", id: "faq" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      {/* Sticky Header */}
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-border/50 py-3" 
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <button 
            onClick={() => scrollTo('hero')}
            className="flex items-center gap-2 group outline-none"
          >
            <img 
              src={logoPath} 
              alt="Epic Learning Pro Logo" 
              className="h-10 w-10 md:h-12 md:w-12 rounded-full shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md" 
            />
            <span className="font-serif font-semibold text-lg md:text-xl tracking-tight text-foreground transition-colors group-hover:text-primary hidden sm:block">
              Epic Learning Pro
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollTo(link.id)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors outline-none relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
              >
                {link.name}
              </button>
            ))}
            <Button 
              onClick={() => scrollTo('contact')}
              className="rounded-full shadow-md hover:shadow-lg transition-all"
            >
              Let's Connect
            </Button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-border shadow-lg py-4 px-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollTo(link.id)}
                className="text-left py-2 px-4 text-base font-medium text-foreground hover:bg-muted rounded-md transition-colors"
              >
                {link.name}
              </button>
            ))}
            <Button 
              onClick={() => scrollTo('contact')}
              className="w-full mt-2"
            >
              Let's Connect
            </Button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex items-center min-h-[90vh]">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(202,167,71,0.03)_0%,transparent_70%)] -z-10" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20">
                <Star size={14} className="text-accent fill-accent" />
                <span>Making good lives great</span>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.1}>
              <h1 className="text-5xl md:text-7xl font-serif font-semibold tracking-tight text-foreground mb-6 leading-tight">
                Professional Training <br className="hidden md:block"/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  & Services
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
                Imagine. Believe. Achieve. With over 30 years of experience, we help individuals and teams transform their potential into tangible results.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  onClick={() => scrollTo('contact')}
                  className="rounded-full w-full sm:w-auto text-base h-14 px-8 shadow-lg hover:shadow-primary/25 transition-all group"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => scrollTo('services')}
                  className="rounded-full w-full sm:w-auto text-base h-14 px-8"
                >
                  Explore Services
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Problem / Agitate Section */}
      <section className="py-20 md:py-32 bg-muted/50 border-y border-border/50 relative">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">Feeling stuck or overwhelmed?</h2>
              <p className="text-lg text-muted-foreground">You are not alone. Whether you're an individual facing a hurdle or a team struggling to connect, the path forward isn't always clear.</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { title: "Homeschooling & Special Needs", desc: "Overwhelmed parents trying to navigate homeschooling or a child's unique educational needs.", icon: Users },
              { title: "Career Roadblocks", desc: "Stuck without credentials like a GED, limiting your opportunities for advancement.", icon: Award },
              { title: "Team Friction", desc: "Teams with poor communication, unclear leadership, and misaligned goals.", icon: MessageCircle },
              { title: "Unprofessional Presence", desc: "Professional documents with errors that silently undermine your credibility.", icon: FileEdit },
              { title: "Weak Training Programs", desc: "Businesses lacking strong, engaging training that retains and empowers employees.", icon: BookOpen }
            ].map((pain, i) => (
              <FadeIn key={i} delay={0.1 * i} direction="up" className={i === 4 ? "md:col-span-2 lg:col-span-1 lg:col-start-2" : ""}>
                <div className="bg-background rounded-2xl p-6 shadow-sm border border-border/50 h-full transition-transform hover:-translate-y-1 duration-300">
                  <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
                    <pain.icon size={24} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{pain.title}</h3>
                  <p className="text-muted-foreground">{pain.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          
          <FadeIn delay={0.5} className="mt-16 text-center">
            <p className="text-xl font-medium text-foreground">We see you. We understand. <br className="md:hidden"/>And we know exactly how to help.</p>
          </FadeIn>
        </div>
      </section>

      {/* Solution / Services Section */}
      <section id="services" className="py-20 md:py-32 relative">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
            <h2 className="text-sm font-bold tracking-wider text-primary uppercase mb-3">Our Services</h2>
            <h3 className="text-3xl md:text-5xl font-serif font-semibold mb-6">Expertise that drives results.</h3>
            <p className="text-lg text-muted-foreground">From corporate training programs to individual coaching and professional editing, we tailor our approach to your specific goals.</p>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <FadeIn delay={0.1} className="flex h-full">
              <Card className="flex flex-col h-full border-border/60 shadow-md hover:shadow-xl hover:border-primary/30 transition-all duration-500 overflow-hidden group">
                <div className="h-2 w-full bg-gradient-to-r from-primary to-primary/50" />
                <CardHeader className="pb-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 text-primary">
                    <Users size={28} />
                  </div>
                  <CardTitle className="text-2xl font-serif">Consulting & Coaching</CardTitle>
                  <CardDescription className="text-base pt-2">For Businesses & Individuals</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground mb-6">
                    If your business culture values progress and proactivity, you need a strong training program. We create exciting educational plans unique to your team's needs. Well-trained, happy people perform better!
                  </p>
                  <div className="space-y-2 mb-6">
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-foreground">Specialties</h4>
                    <ul className="space-y-2">
                      {["Business Training Programs", "Leadership & HR Coaching", "GED Coaching", "Homeschooling & Special Needs"].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 pb-6 border-t border-border/50 mt-auto bg-muted/20">
                  <div className="pt-4 w-full text-sm text-muted-foreground italic">
                    Negotiated hourly/weekly/monthly. Coaching bundles available.
                  </div>
                </CardFooter>
              </Card>
            </FadeIn>

            {/* Service 2 */}
            <FadeIn delay={0.2} className="flex h-full">
              <Card className="flex flex-col h-full border-border/60 shadow-md hover:shadow-xl hover:border-secondary/30 transition-all duration-500 overflow-hidden group relative">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Award size={120} />
                </div>
                <div className="h-2 w-full bg-gradient-to-r from-secondary to-secondary/50" />
                <CardHeader className="pb-4 relative z-10">
                  <div className="h-14 w-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-secondary group-hover:text-white transition-all duration-300 text-secondary">
                    <Award size={28} />
                  </div>
                  <CardTitle className="text-2xl font-serif">Professional Seminars</CardTitle>
                  <CardDescription className="text-base pt-2">Transform Your Team</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow relative z-10">
                  <p className="text-muted-foreground mb-6">
                    Improve communication skills, gain expert knowledge, and expand focus with actionable seminars. Topics are matched to your training goals and team's specific interests.
                  </p>
                  <div className="space-y-2 mb-6">
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-foreground">Popular Topics</h4>
                    <ul className="space-y-2">
                      {["Intuitive Leadership Series", "Confident Communication", "Mental Health for Professionals", "Workflow & Organization"].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 pb-6 border-t border-border/50 mt-auto bg-muted/20 relative z-10">
                  <div className="pt-4 w-full text-sm text-muted-foreground italic">
                    Offered as 1-3 day formats, or 5 half-day sessions.
                  </div>
                </CardFooter>
              </Card>
            </FadeIn>

            {/* Service 3 */}
            <FadeIn delay={0.3} className="flex h-full">
              <Card className="flex flex-col h-full border-border/60 shadow-md hover:shadow-xl hover:border-accent/50 transition-all duration-500 overflow-hidden group">
                <div className="h-2 w-full bg-gradient-to-r from-accent to-accent/50" />
                <CardHeader className="pb-4">
                  <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all duration-300 text-accent">
                    <FileEdit size={28} />
                  </div>
                  <CardTitle className="text-2xl font-serif">Proofreading & Editing</CardTitle>
                  <CardDescription className="text-base pt-2">Polish Your Presence</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground mb-6">
                    Ensure your company's written communication is flawless. Any professional document will be edited to perfection—accuracy of grammar, punctuation, usage, and context.
                  </p>
                  <div className="space-y-2 mb-6">
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-foreground">Documents Covered</h4>
                    <ul className="space-y-2">
                      {["Blogs, Newsletters & Emails", "Proposals & Contracts", "Professional Posts", "Essays & Articles"].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 pb-6 border-t border-border/50 mt-auto bg-muted/20">
                  <div className="pt-4 w-full text-sm text-muted-foreground italic">
                    Pricing negotiated by word count or by project.
                  </div>
                </CardFooter>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section id="social-proof" className="py-20 md:py-32 bg-primary/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10" />
        
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
            <FadeIn className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">Trusted by professionals.</h2>
              <p className="text-lg text-muted-foreground">Don't just take our word for it. Here is what real clients have to say about working with Epic Learning Pro.</p>
            </FadeIn>
            <FadeIn delay={0.2} direction="left">
              <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-2xl shadow-sm border border-border">
                <div className="text-4xl font-bold text-primary">30+</div>
                <div className="text-sm font-medium text-muted-foreground leading-tight">Years of<br/>Experience</div>
              </div>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Will F.", text: "Olivia is an icon in the teaching industry. Highly recommended!" },
              { name: "Robert W.", text: "Extremely knowledgeable and compassionate. Very professional." },
              { name: "Shannon D.", text: "The owner is amazing, hardworking and cares about everyone she does business with." },
              { name: "Irene B.", text: "Epic Pro teaches on a level that, learning never ends so why not enjoy it all the time cuz it's fun" },
              { name: "Dan D.", text: "Very knowledgeable and experienced!" }
            ].map((review, i) => (
              <FadeIn key={i} delay={0.1 * i} direction="up" className={i === 3 ? "lg:col-start-1" : i === 4 ? "lg:col-start-2" : ""}>
                <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={16} className="text-accent fill-accent" />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground italic mb-4">"{review.text}"</p>
                    <p className="font-semibold text-sm">{review.name}</p>
                    <p className="text-xs text-muted-foreground">Alignable Review</p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <FadeIn direction="right">
              <h2 className="text-sm font-bold tracking-wider text-primary uppercase mb-3">About Us</h2>
              <h3 className="text-4xl md:text-5xl font-serif font-semibold mb-6">Imagine. Believe. Achieve.</h3>
              <p className="text-xl font-medium text-foreground mb-6 border-l-4 border-accent pl-4">
                Epic Learning Pro is all about making good lives great!
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Our certified educators have over 30 years of experience in enlightening minds, providing accurate information, and transforming dreams into reality. Whatever you can imagine, we'll help you achieve!
              </p>
              <div className="bg-muted p-6 rounded-2xl relative">
                <div className="absolute top-4 left-4 text-4xl text-primary/20 font-serif">"</div>
                <p className="text-lg font-serif italic text-foreground relative z-10 text-center">
                  Whatever the mind can think and perceive, it can achieve.
                </p>
                <p className="text-sm text-muted-foreground text-center mt-3">— Napoleon Hill</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2} direction="left" className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[2rem] transform rotate-3 scale-105 -z-10" />
              <img 
                src={logoPath} 
                alt="Epic Learning Pro Logo" 
                className="w-full max-w-md mx-auto rounded-full shadow-2xl bg-white p-4"
              />
            </FadeIn>
          </div>

          <FadeIn>
            <h3 className="text-3xl font-serif font-semibold mb-12 text-center">Meet the Team</h3>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Olivia D Barlow", title: "Owner & Educator", suffix: "BS, MEd", img: oliviaPath },
              { name: "Octavia Barlow", title: "Scheduling & Operations Coordinator", suffix: "", img: octaviaPath },
              { name: "Mikelle Barlow", title: "Office Manager", suffix: "", img: mikellePath }
            ].map((member, i) => (
              <FadeIn key={i} delay={0.2 + (i * 0.1)} direction="up">
                <div className="group text-center">
                  <div className="relative mb-6 inline-block">
                    <div className="absolute inset-0 bg-primary rounded-full transform translate-y-2 translate-x-2 opacity-0 group-hover:opacity-20 transition-all duration-300" />
                    <img 
                      src={member.img} 
                      alt={member.name} 
                      className="w-48 h-48 md:w-56 md:h-56 object-cover rounded-full shadow-md border-4 border-white relative z-10 object-top"
                    />
                  </div>
                  <h4 className="text-xl font-serif font-semibold">
                    {member.name} {member.suffix && <span className="text-sm font-sans text-muted-foreground font-normal">, {member.suffix}</span>}
                  </h4>
                  <p className="text-primary font-medium mt-1">{member.title}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">Common Questions</h2>
            <p className="text-lg text-muted-foreground">Everything you need to know about working with us.</p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="bg-white border rounded-lg px-6 py-2 shadow-sm">
                <AccordionTrigger className="text-lg font-medium hover:no-underline hover:text-primary transition-colors text-left">
                  What types of coaching do you offer?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base pt-2 pb-4 leading-relaxed">
                  We offer coaching for both individuals and businesses. For individuals, we specialize in GED preparation, homeschooling guidance, and supporting parents of children with special needs. For businesses, we provide leadership coaching, HR professional coaching, and custom training program development.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-white border rounded-lg px-6 py-2 shadow-sm">
                <AccordionTrigger className="text-lg font-medium hover:no-underline hover:text-primary transition-colors text-left">
                  How are your seminars structured and priced?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base pt-2 pb-4 leading-relaxed">
                  Seminars are flexible to fit your team's schedule. They can be structured as 1-day, 2-day, or 3-day formats, or broken into 5 half-day sessions. After discussing your goals, we submit a tailored proposal for your review before any commitment is made.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-white border rounded-lg px-6 py-2 shadow-sm">
                <AccordionTrigger className="text-lg font-medium hover:no-underline hover:text-primary transition-colors text-left">
                  Do you work with individuals as well as businesses?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base pt-2 pb-4 leading-relaxed">
                  Absolutely. While we develop extensive corporate training and seminars for teams, we are deeply committed to individual success through one-on-one coaching bundles and educational support.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-white border rounded-lg px-6 py-2 shadow-sm">
                <AccordionTrigger className="text-lg font-medium hover:no-underline hover:text-primary transition-colors text-left">
                  How does proofreading and editing pricing work?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base pt-2 pb-4 leading-relaxed">
                  We offer flexible pricing structures to suit your needs. Depending on the size and frequency of the work, pricing is negotiated either by the word count or as a flat fee per project.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-white border rounded-lg px-6 py-2 shadow-sm">
                <AccordionTrigger className="text-lg font-medium hover:no-underline hover:text-primary transition-colors text-left">
                  How do I get started or what's the first step?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base pt-2 pb-4 leading-relaxed">
                  The first step is a simple conversation. Reach out to us via email or Alignable to discuss your needs. From there, we will craft and submit a written proposal outlining the strategy, timeline, and pricing.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </FadeIn>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="contact" className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary -z-20" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8B5FE6,#36A6DD)] opacity-90 -z-10" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(202,167,71,0.2)_0%,transparent_60%)] -z-10" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-6xl font-serif font-semibold text-white mb-6">Let's work together.</h2>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-light">
              Ready to transform your team or take the next step in your personal journey? We're here to help you achieve it.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a 
                href="mailto:contact@epiclearningpro.com" 
                className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-white text-primary font-semibold text-lg hover:bg-muted hover:scale-105 transition-all shadow-xl"
              >
                <Mail className="mr-2 h-5 w-5" />
                Email Us Today
              </a>
              <a 
                href="https://www.alignable.com/paulden-az/epic-learning-pro" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-transparent border-2 border-white/30 text-white font-semibold text-lg hover:bg-white/10 hover:border-white transition-all"
              >
                Connect on Alignable
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-3 outline-none hover:opacity-80 transition-opacity"
            >
              <img src={logoPath} alt="Logo" className="h-10 w-10 rounded-full bg-white p-1" />
              <span className="font-serif font-semibold text-xl tracking-tight">Epic Learning Pro</span>
            </button>

            <div className="flex items-center gap-6 text-sm text-muted/80">
              <a href="https://www.alignable.com/paulden-az/epic-learning-pro" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Alignable
              </a>
              <a href="mailto:contact@epiclearningpro.com" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted/60">
            <p>Copyright 2026 © Epic Learning Pro. All rights reserved.</p>
            <p>
              Website Design by <a href="https://cliquestudios.io" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors">Clique Studios IO</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

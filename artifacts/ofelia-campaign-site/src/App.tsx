import { type AnchorHTMLAttributes, type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowRight, CalendarDays, CheckCircle2, ChevronDown, Clock3, Facebook, Instagram, MapPin, Menu, X } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const asset = (name: string) => `/campaign-assets/${name}`;

const navItems = [
  { label: 'Why Ofelia', href: '#about' },
  { label: 'Priorities', href: '#priorities' },
  { label: 'Her record', href: '#record' },
  { label: 'Kickoff', href: '#kickoff' },
];

const priorities = [
  { number: '01', title: 'Homes people can keep', text: 'Protecting renters, expanding affordable housing, and keeping longtime neighbors at the center of growth.' },
  { number: '02', title: 'A voice at City Hall', text: 'Clear decisions, open books, and a city government that answers to residents before special interests.' },
  { number: '03', title: 'Development with a conscience', text: 'Welcoming investment that creates opportunity without asking East Palo Alto families to move aside.' },
  { number: '04', title: 'A healthier EPA', text: 'Environmental and racial justice in every neighborhood, with safety and dignity for every resident.' },
  { number: '05', title: 'The work is local', text: 'Solutions built with the people who live here, from the block level up.' },
];

const recordItems = [
  { label: '6 years', title: 'Leading a grassroots nonprofit', text: 'Organized around social, environmental, and racial justice alongside East Palo Alto residents.' },
  { label: '5 years', title: 'East Palo Alto Planning Commission', text: 'Served as vice-chair and advocated for equitable development that respects our city’s vision.' },
  { label: '2022', title: 'Elected to the Sanitary District', text: 'Brought a steady, transparent voice to decisions affecting local ratepayers.' },
  { label: 'Today', title: 'Pahali Community Land Trust', text: 'Continuing the work of community ownership and housing stability as executive director.' },
];

function Anchor({ href, children, className = '', onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return <a href={href} onClick={onClick} className={className} {...props}>{children}</a>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);
  return (
    <header className="sticky top-0 z-20 border-b border-[hsl(var(--primary)/.12)] bg-[hsl(var(--background)/.94)] backdrop-blur-md">
      <div className="wrap flex h-[76px] items-center justify-between gap-5">
        <Anchor href="#" className="shrink-0" onClick={closeMenu}>
          <img data-testid="img-logo-header" src={asset('ofelia_logo.png')} alt="Ofelia Bello for East Palo Alto City Council" className="h-11 w-auto object-contain" />
        </Anchor>
        <nav aria-label="Primary navigation" className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => <Anchor key={item.href} href={item.href} className="nav-link text-[.72rem] font-bold uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">{item.label}</Anchor>)}
        </nav>
        <Anchor href="#involved" className="btn btn-primary hidden py-3 md:inline-flex" data-testid="link-nav-join">Join the movement <ArrowRight size={15} /></Anchor>
        <button type="button" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} onClick={() => setOpen(!open)} className="rounded-full p-2 text-[hsl(var(--primary))] md:hidden" data-testid="button-mobile-menu">
          {open ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-[hsl(var(--primary)/.12)] bg-[hsl(var(--background))] px-4 pb-5 pt-3 md:hidden">
          <nav aria-label="Mobile navigation" className="flex flex-col">
            {navItems.map((item) => <Anchor key={item.href} href={item.href} onClick={closeMenu} className="border-b border-[hsl(var(--primary)/.1)] py-4 text-sm font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))]">{item.label}</Anchor>)}
            <Anchor href="#involved" onClick={closeMenu} className="btn btn-primary mt-4" data-testid="link-mobile-join">Join the movement <ArrowRight size={15} /></Anchor>
          </nav>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[hsl(var(--primary))] text-[hsl(var(--card))]">
      <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full border border-[hsl(var(--accent)/.2)]" />
      <div className="hero-orbit absolute -right-16 -top-16 h-[340px] w-[340px] rounded-full border border-dashed border-[hsl(var(--accent)/.25)]" />
      <img src={asset('poppy_flower1.png')} alt="" className="float-slow absolute -left-7 top-24 z-0 w-32 opacity-80 md:left-5 md:top-28 md:w-44" />
      <div className="wrap relative z-10 grid min-h-[680px] items-center gap-8 pb-16 pt-20 md:grid-cols-[1.02fr_.98fr] md:pb-20 md:pt-24">
        <div className="max-w-[610px]">
          <div className="reveal is-visible eyebrow mb-6 text-[hsl(var(--gold))]">East Palo Alto City Council</div>
          <h1 className="reveal is-visible delay-1 display max-w-[13ch] text-[clamp(4rem,8vw,7.3rem)] leading-[.84] tracking-[-.035em] text-[hsl(var(--card))]">
            The city <em className="text-[hsl(var(--accent))]">we</em> call home.
          </h1>
          <p className="reveal is-visible delay-2 mt-8 max-w-[39rem] text-lg leading-8 text-[hsl(var(--card)/.75)] md:text-xl">
            Ofelia Bello is a lifelong East Palo Alto resident, housing advocate, and neighbor who knows that our best future is one we build together.
          </p>
          <div className="reveal is-visible delay-3 mt-9 flex flex-wrap gap-3">
            <Anchor href="#kickoff" className="btn btn-primary" data-testid="link-hero-kickoff">Come to the kickoff <ArrowRight size={16} /></Anchor>
            <Anchor href="#about" className="btn border border-[hsl(var(--card)/.36)] text-[hsl(var(--card))] hover:bg-[hsl(var(--card)/.1)]" data-testid="link-hero-about">Meet Ofelia</Anchor>
          </div>
          <div className="mt-12 flex items-center gap-3 border-t border-[hsl(var(--card)/.16)] pt-5 text-xs text-[hsl(var(--card)/.58)]">
            <span className="h-2 w-2 rounded-full bg-[hsl(var(--secondary))]" />
            <span>Rooted here. Ready to serve.</span>
          </div>
        </div>
        <div className="relative flex min-h-[410px] items-end justify-center md:min-h-[580px]">
          <div className="absolute bottom-4 h-[340px] w-[min(90%,420px)] rounded-[48%_48%_0_0] bg-[hsl(var(--secondary)/.25)] md:h-[440px]" />
          <div className="absolute bottom-0 right-[5%] h-[420px] w-[78%] border-l border-t border-[hsl(var(--accent)/.3)] md:h-[540px]" />
          <img data-testid="img-hero-ofelia" src={asset('ofelia_photo.png')} alt="Ofelia Bello smiling, standing with one hand on her hip" className="relative z-[1] max-h-[475px] w-auto object-contain md:max-h-[610px]" />
          <div className="absolute bottom-4 left-0 z-[2] max-w-[245px] border border-[hsl(var(--primary)/.1)] bg-[hsl(var(--card))] p-4 text-[hsl(var(--primary))] shadow-xl md:bottom-12 md:left-1">
            <div className="mono text-[.62rem] font-bold uppercase tracking-[.15em] text-[hsl(var(--accent))]">Next up</div>
            <div className="mt-2 font-semibold leading-5">Campaign kickoff<br />at La Cazuela</div>
            <Anchor href="#kickoff" className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[hsl(var(--secondary))]" data-testid="link-hero-event">Details <ArrowRight size={13} /></Anchor>
          </div>
        </div>
      </div>
      <div className="relative z-10 border-t border-[hsl(var(--card)/.12)] bg-[hsl(var(--primary)/.7)]">
        <div className="wrap flex flex-wrap items-center justify-between gap-4 py-4 text-[.7rem] font-bold uppercase tracking-[.14em] text-[hsl(var(--card)/.6)]">
          <span>For the people who make EPA home</span>
          <span className="hidden md:block">A grassroots campaign · 2026</span>
          <Anchor href="#involved" className="text-[hsl(var(--gold))]" data-testid="link-hero-volunteer">Find your place <ArrowRight className="ml-1 inline" size={13} /></Anchor>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section-pad bg-[hsl(var(--card))]">
      <div className="wrap grid items-start gap-12 md:grid-cols-[.65fr_1.35fr] md:gap-24">
        <div className="reveal">
          <div className="eyebrow">Meet Ofelia</div>
          <div className="mt-8 hidden md:block">
            <img src={asset('poppy_flower1.png')} alt="" className="w-28 opacity-80" />
            <p className="display mt-5 max-w-[9ch] text-4xl leading-[.95] text-[hsl(var(--primary))]">This is a love letter to home.</p>
          </div>
        </div>
        <div className="reveal delay-1">
          <blockquote className="display max-w-[19ch] text-4xl leading-[1.02] text-[hsl(var(--primary))] md:text-6xl">
            “I will always keep in mind what is best for ordinary and working-class people in EPA.”
          </blockquote>
          <div className="mt-10 grid gap-6 text-[1.05rem] leading-8 text-[hsl(var(--muted-foreground))] md:grid-cols-2">
            <p>I’m a <strong className="text-[hsl(var(--primary))]">33-year-old Latina professional</strong>, proudly born and raised in East Palo Alto. As a first-generation college graduate with a master’s degree in Urban Affairs and Public Policy, I’ve spent the last decade volunteering and organizing with local neighbors.</p>
            <p>Today, as executive director of Pahali Community Land Trust, I’m still working for affordable housing, renters’ rights, and a healthier, safer community. This campaign is simply the next chapter of that work.</p>
          </div>
          <Anchor href="#record" className="mt-8 inline-flex items-center gap-2 border-b-2 border-[hsl(var(--accent))] pb-1 text-sm font-bold uppercase tracking-wider text-[hsl(var(--primary))]" data-testid="link-about-record">See the work behind the campaign <ArrowRight size={15} /></Anchor>
        </div>
      </div>
    </section>
  );
}

function Priorities() {
  return (
    <section id="priorities" className="section-pad border-y border-[hsl(var(--primary)/.12)] bg-[hsl(var(--background))]">
      <div className="wrap">
        <div className="reveal flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="eyebrow">The platform</div>
            <h2 className="section-title mt-5 max-w-[10ch] text-[hsl(var(--primary))]">A city that works for us.</h2>
          </div>
          <p className="max-w-sm text-base leading-7 text-[hsl(var(--muted-foreground))]">A platform built alongside EPA residents — specific enough to act on, spacious enough to grow with our community.</p>
        </div>
        <div className="mt-14 grid gap-3 md:grid-cols-12">
          {priorities.map((item, index) => (
            <article key={item.number} className={`reveal delay-${Math.min(index + 1, 3)} group border border-[hsl(var(--primary)/.15)] bg-[hsl(var(--card))] p-7 transition-colors hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--card))] ${index === 0 ? 'md:col-span-7 md:min-h-[255px]' : index === 1 ? 'md:col-span-5 md:min-h-[255px]' : index === 2 ? 'md:col-span-4' : index === 3 ? 'md:col-span-4' : 'md:col-span-4'}`}>
              <div className="flex items-start justify-between">
                <span className="mono text-sm font-bold text-[hsl(var(--accent))]">{item.number}</span>
                <ArrowRight size={18} className="text-[hsl(var(--secondary))] transition-transform group-hover:translate-x-1" />
              </div>
              <h3 className="display mt-12 max-w-[13ch] text-3xl leading-none text-[hsl(var(--primary))] group-hover:text-[hsl(var(--card))]">{item.title}</h3>
              <p className="mt-4 max-w-[34ch] text-sm leading-6 text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--card)/.72)]">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Record() {
  return (
    <section id="record" className="section-pad bg-[hsl(var(--card))]">
      <div className="wrap grid gap-14 md:grid-cols-[.8fr_1.2fr] md:gap-24">
        <div className="reveal">
          <div className="eyebrow">Track record</div>
          <h2 className="section-title mt-5 max-w-[8ch] text-[hsl(var(--primary))]">The work started long ago.</h2>
          <p className="mt-7 max-w-sm leading-7 text-[hsl(var(--muted-foreground))]">Ofelia’s leadership in East Palo Alto didn’t begin with a campaign logo. It began with showing up — and staying in the room.</p>
        </div>
        <div className="reveal delay-1 border-t border-[hsl(var(--primary)/.16)]">
          {recordItems.map((item) => (
            <div key={item.label} className="grid gap-2 border-b border-[hsl(var(--primary)/.16)] py-7 md:grid-cols-[100px_1fr] md:gap-7">
              <span className="mono pt-1 text-xs font-bold uppercase tracking-wider text-[hsl(var(--accent))]">{item.label}</span>
              <div><h3 className="display text-3xl leading-none text-[hsl(var(--primary))]">{item.title}</h3><p className="mt-3 max-w-xl text-sm leading-6 text-[hsl(var(--muted-foreground))]">{item.text}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Kickoff() {
  return (
    <section id="kickoff" className="section-pad overflow-hidden bg-[hsl(var(--primary))] text-[hsl(var(--card))]">
      <div className="wrap">
        <div className="reveal mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div><div className="eyebrow text-[hsl(var(--gold))]">Campaign kickoff</div><h2 className="display mt-5 max-w-[11ch] text-5xl leading-[.92] md:text-7xl">Come as you are. Bring a neighbor.</h2></div>
          <p className="max-w-sm leading-7 text-[hsl(var(--card)/.7)]">Good food, an honest conversation, and a chance to meet the people building what comes next for East Palo Alto.</p>
        </div>
        <div className="reveal delay-1 grid overflow-hidden border border-[hsl(var(--card)/.2)] md:grid-cols-[.9fr_1.1fr]">
          <div className="p-7 md:p-10">
            <div className="space-y-0">
              <div className="flex gap-5 border-b border-[hsl(var(--card)/.16)] py-5 first:pt-0"><CalendarDays className="mt-1 shrink-0 text-[hsl(var(--gold))]" size={19} /><div><div className="mono text-[.65rem] uppercase tracking-[.14em] text-[hsl(var(--card)/.55)]">Date</div><div className="mt-1 font-semibold">Saturday, September 5</div></div></div>
              <div className="flex gap-5 border-b border-[hsl(var(--card)/.16)] py-5"><Clock3 className="mt-1 shrink-0 text-[hsl(var(--gold))]" size={19} /><div><div className="mono text-[.65rem] uppercase tracking-[.14em] text-[hsl(var(--card)/.55)]">Time</div><div className="mt-1 font-semibold">11:30 AM – 12:30 PM</div></div></div>
              <div className="flex gap-5 border-b border-[hsl(var(--card)/.16)] py-5"><MapPin className="mt-1 shrink-0 text-[hsl(var(--gold))]" size={19} /><div><div className="mono text-[.65rem] uppercase tracking-[.14em] text-[hsl(var(--card)/.55)]">Where</div><div className="mt-1 font-semibold">Taqueria La Cazuela</div><div className="mt-1 text-sm text-[hsl(var(--card)/.62)]">2390 Clarke Ave · garden / patio</div></div></div>
            </div>
            <p className="mt-7 text-sm leading-6 text-[hsl(var(--card)/.66)]"><strong className="text-[hsl(var(--card))]">En español:</strong> Lanzamiento de campaña para consejo municipal. Sábado 5 de septiembre, 11:30 am–12:30 pm.</p>
            <Anchor href="#involved" className="btn btn-primary mt-7" data-testid="link-kickoff-rsvp">I’ll be there <ArrowRight size={15} /></Anchor>
          </div>
          <div className="relative min-h-[290px] bg-[hsl(var(--secondary)/.2)]">
            <img data-testid="img-event-map" src={asset('venue_map.png')} alt="Aerial map of Taqueria La Cazuela at Clarke Avenue and Bay Road" className="absolute inset-0 h-full w-full object-cover opacity-90" />
            <div className="absolute bottom-5 left-5 bg-[hsl(var(--card))] px-4 py-3 text-xs font-bold text-[hsl(var(--primary))] shadow-lg"><MapPin className="mr-1 inline text-[hsl(var(--accent))]" size={14} /> East Palo Alto, CA</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Involved() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (email.trim()) setSubmitted(true); };
  return (
    <section id="involved" className="section-pad bg-[hsl(var(--background))]">
      <div className="wrap">
        <div className="reveal grid gap-10 border-b border-[hsl(var(--primary)/.15)] pb-16 md:grid-cols-[1fr_1fr] md:items-end">
          <div><div className="eyebrow">Get involved</div><h2 className="section-title mt-5 max-w-[10ch] text-[hsl(var(--primary))]">There’s a place for you here.</h2></div>
          <div>
            <p className="max-w-md leading-7 text-[hsl(var(--muted-foreground))]">Campaigns like this run on neighbors, not corporate donors. Get updates, invitations, and ways to lend a hand.</p>
            {submitted ? (
              <div className="mt-7 flex items-center gap-3 border border-[hsl(var(--secondary)/.45)] bg-[hsl(var(--secondary)/.1)] px-5 py-4 text-sm font-semibold text-[hsl(var(--primary))]" role="status" data-testid="status-newsletter-success"><CheckCircle2 className="text-[hsl(var(--secondary))]" size={19} /> You’re on the neighbor list. Thank you.</div>
            ) : (
              <form onSubmit={submit} className="mt-7 flex flex-col gap-3 sm:flex-row" aria-label="Newsletter signup">
                <label className="sr-only" htmlFor="campaign-email">Email address</label>
                <input id="campaign-email" data-testid="input-newsletter-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="your@email.com" className="min-h-12 flex-1 border border-[hsl(var(--primary)/.22)] bg-[hsl(var(--card))] px-4 text-sm text-[hsl(var(--primary))] outline-none placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--accent))]" />
                <button type="submit" className="btn btn-primary min-h-12" data-testid="button-newsletter-submit">Sign me up <ArrowRight size={15} /></button>
              </form>
            )}
          </div>
        </div>
        <div className="grid gap-0 pt-8 md:grid-cols-3">
          <div className="reveal border-b border-[hsl(var(--primary)/.15)] py-7 md:border-b-0 md:border-r md:pr-8"><div className="mono text-xs font-bold text-[hsl(var(--accent))]">01 / SHOW UP</div><h3 className="display mt-4 text-3xl text-[hsl(var(--primary))]">Volunteer</h3><p className="mt-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">Knock doors, make calls, or help us welcome neighbors at the kickoff.</p><Anchor href="#kickoff" className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[hsl(var(--secondary))]" data-testid="link-involved-volunteer">Find an event <ArrowRight size={14} /></Anchor></div>
          <div className="reveal delay-1 border-b border-[hsl(var(--primary)/.15)] py-7 md:border-b-0 md:border-r md:px-8"><div className="mono text-xs font-bold text-[hsl(var(--accent))]">02 / SHARE</div><h3 className="display mt-4 text-3xl text-[hsl(var(--primary))]">Spread the word</h3><p className="mt-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">Tell a friend why this city matters to you, then follow along for the next conversation.</p><a href="https://www.instagram.com/ofelia_4epa/" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[hsl(var(--secondary))]" data-testid="link-involved-instagram">Follow @ofelia_4epa <Instagram size={14} /></a></div>
          <div className="reveal delay-2 py-7 md:pl-8"><div className="mono text-xs font-bold text-[hsl(var(--accent))]">03 / CONNECT</div><h3 className="display mt-4 text-3xl text-[hsl(var(--primary))]">Bring your question</h3><p className="mt-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">The best campaigns listen first. Bring your hopes, concerns, and ideas to the next gathering.</p><Anchor href="#kickoff" className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[hsl(var(--secondary))]" data-testid="link-involved-question">Join the conversation <ArrowRight size={14} /></Anchor></div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[hsl(var(--primary))] text-[hsl(var(--card))]">
      <div className="overflow-hidden bg-[hsl(var(--primary))]"><img src={asset('floral_border.png')} alt="" className="h-14 w-full object-cover object-center opacity-90" /></div>
      <div className="wrap py-12">
        <div className="grid gap-10 border-b border-[hsl(var(--card)/.16)] pb-10 md:grid-cols-[1.2fr_.8fr] md:items-end">
          <div><img src={asset('ofelia_logo.png')} alt="Ofelia Bello for East Palo Alto City Council" className="h-16 w-auto brightness-0 invert" /><p className="mt-5 max-w-md text-sm leading-6 text-[hsl(var(--card)/.64)]">A grassroots campaign for East Palo Alto City Council, powered by the residents who call this city home.</p></div>
          <div className="flex gap-4 md:justify-end"><a href="https://www.instagram.com/ofelia_4epa/" target="_blank" rel="noreferrer" aria-label="Follow Ofelia Bello on Instagram" className="rounded-full border border-[hsl(var(--card)/.25)] p-3 transition-colors hover:bg-[hsl(var(--card)/.12)]" data-testid="link-footer-instagram"><Instagram size={18} /></a><a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Follow the campaign on Facebook" className="rounded-full border border-[hsl(var(--card)/.25)] p-3 transition-colors hover:bg-[hsl(var(--card)/.12)]" data-testid="link-footer-facebook"><Facebook size={18} /></a></div>
        </div>
        <div className="flex flex-col gap-3 pt-6 text-xs text-[hsl(var(--card)/.48)] md:flex-row md:items-center md:justify-between"><span>© 2026 Ofelia Bello for East Palo Alto City Council.</span><span>Paid for by the neighbors of East Palo Alto.</span><Anchor href="#" className="inline-flex items-center gap-1 text-[hsl(var(--gold))]" data-testid="link-footer-top">Back to top <ChevronDown className="rotate-180" size={13} /></Anchor></div>
      </div>
      <img src={asset('epa_skyline.png')} alt="East Palo Alto skyline illustration" className="h-24 w-full object-cover object-top opacity-60" />
    </footer>
  );
}

function Home() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)'));
    if (!('IntersectionObserver' in window)) { elements.forEach((element) => element.classList.add('is-visible')); return; }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: .12 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  return <div className="site-shell paper-grain"><Header /><main><Hero /><About /><Priorities /><Record /><Kickoff /><Involved /></main><Footer /></div>;
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
import { type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Facebook,
  Instagram,
  MapPin,
  Menu,
  X,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const asset = (name: string) => `/campaign-assets/${name}`;

const chapters = [
  { id: 'home', label: 'Home', kicker: '01' },
  { id: 'about', label: 'Why Ofelia', kicker: '02' },
  { id: 'priorities', label: 'Priorities', kicker: '03' },
  { id: 'record', label: 'Her record', kicker: '04' },
  { id: 'kickoff', label: 'Kickoff', kicker: '05' },
  { id: 'involved', label: 'Get involved', kicker: '06' },
] as const;

type ChapterId = (typeof chapters)[number]['id'];

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

function readChapter(): ChapterId {
  const value = window.location.hash.replace('#', '');
  return chapters.some((chapter) => chapter.id === value) ? value as ChapterId : 'home';
}

function goToChapter(id: ChapterId) {
  const hash = `#${id}`;
  if (window.location.hash !== hash) {
    window.history.pushState({}, '', hash);
  }
  window.dispatchEvent(new Event('hashchange'));
}

function HashLink({
  href,
  children,
  className = '',
  onClick,
  ...props
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  'data-testid'?: string;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        onClick?.();
        goToChapter(href.slice(1) as ChapterId);
      }}
      {...props}
    >
      {children}
    </a>
  );
}

function Header({ current }: { current: ChapterId }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="campaign-header">
      <div className="header-inner">
        <HashLink href="#home" className="brand-mark" data-testid="link-brand-home" onClick={() => setOpen(false)}>
          <img src={asset('ofelia_logo.png')} alt="Ofelia Bello for East Palo Alto City Council" />
        </HashLink>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {chapters.slice(1, 5).map((chapter) => (
            <HashLink
              key={chapter.id}
              href={`#${chapter.id}`}
              className={`nav-item ${current === chapter.id ? 'is-current' : ''}`}
              data-testid={`link-nav-${chapter.id}`}
            >
              <span>{chapter.kicker}</span>{chapter.label}
            </HashLink>
          ))}
        </nav>
        <div className="header-actions">
          <HashLink href="#involved" className="header-cta" data-testid="link-nav-join">
            Join the movement <ArrowRight size={14} />
          </HashLink>
          <button
            type="button"
            className="menu-toggle"
            aria-label={open ? 'Close chapter menu' : 'Open chapter menu'}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            data-testid="button-mobile-menu"
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="mobile-menu">
          <div className="mobile-menu-label mono">Choose a chapter</div>
          <nav aria-label="Mobile chapter navigation">
            {chapters.map((chapter) => (
              <HashLink
                key={chapter.id}
                href={`#${chapter.id}`}
                onClick={() => setOpen(false)}
                className={`mobile-nav-item ${current === chapter.id ? 'is-current' : ''}`}
                data-testid={`link-mobile-${chapter.id}`}
              >
                <span className="mono">{chapter.kicker}</span>
                <span>{chapter.label}</span>
                {current === chapter.id && <span className="mobile-active-dot" aria-hidden="true" />}
              </HashLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="chapter chapter-hero" aria-labelledby="hero-title">
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">East Palo Alto City Council</div>
          <h1 id="hero-title" className="display hero-title">
            The city <em>we</em> call home.
          </h1>
          <p className="hero-lede">Ofelia Bello is a lifelong East Palo Alto resident, housing advocate, and neighbor who knows that our best future is one we build together.</p>
          <div className="chapter-actions">
            <HashLink href="#kickoff" className="button button-primary" data-testid="link-hero-kickoff">
              Come to the kickoff <ArrowRight size={15} />
            </HashLink>
            <HashLink href="#about" className="button button-outline-light" data-testid="link-hero-about">Meet Ofelia</HashLink>
          </div>
          <div className="hero-note">
            <span className="status-dot" />
            <span>Rooted here. Ready to serve.</span>
          </div>
        </div>
        <div className="hero-portrait">
          <div className="portrait-sun" />
          <div className="portrait-line" />
          <img src={asset('ofelia_photo.png')} alt="Ofelia Bello smiling, standing with one hand on her hip" data-testid="img-hero-ofelia" />
          <img src={asset('poppy_flower1.png')} alt="" className="hero-poppy" />
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="chapter chapter-light about-layout" aria-labelledby="about-title">
      <div className="about-aside">
        <div className="eyebrow">Meet Ofelia</div>
        <img src={asset('poppy_flower1.png')} alt="" className="about-poppy" />
        <p className="display aside-quote">A love letter to home.</p>
      </div>
      <div className="about-main">
        <h2 id="about-title" className="display quote-title">“I will always keep in mind what is best for ordinary and working-class people in EPA.”</h2>
        <div className="about-columns">
          <p>I’m a <strong>33-year-old Latina professional</strong>, proudly born and raised in East Palo Alto. As a first-generation college graduate with a master’s degree in Urban Affairs and Public Policy, I’ve spent the last decade volunteering and organizing with local neighbors.</p>
          <p>Today, as executive director of Pahali Community Land Trust, I’m still working for affordable housing, renters’ rights, and a healthier, safer community. This campaign is simply the next chapter of that work.</p>
        </div>
        <HashLink href="#record" className="text-link" data-testid="link-about-record">See the work behind the campaign <ArrowRight size={15} /></HashLink>
      </div>
    </section>
  );
}

function Priorities() {
  return (
    <section className="chapter chapter-light priorities-layout" aria-labelledby="priorities-title">
      <div className="chapter-heading">
        <div>
          <div className="eyebrow">The platform</div>
          <h2 id="priorities-title" className="display chapter-title">A city that<br /><em>works for us.</em></h2>
        </div>
        <p>A platform built alongside EPA residents — specific enough to act on, spacious enough to grow with our community.</p>
      </div>
      <div className="priority-grid">
        {priorities.map((item, index) => (
          <article key={item.number} className={`priority-card priority-card-${index + 1}`} data-testid={`card-priority-${item.number}`}>
            <div className="priority-top"><span className="mono">{item.number}</span><ArrowRight size={16} /></div>
            <h3 className="display">{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Record() {
  return (
    <section className="chapter chapter-light record-layout" aria-labelledby="record-title">
      <div className="record-intro">
        <div className="eyebrow">Track record</div>
        <h2 id="record-title" className="display chapter-title">The work started long ago.</h2>
        <p>Ofelia’s leadership in East Palo Alto didn’t begin with a campaign logo. It began with showing up — and staying in the room.</p>
      </div>
      <div className="record-list">
        {recordItems.map((item) => (
          <div key={item.label} className="record-item" data-testid={`row-record-${item.label.replace(/\s/g, '-').toLowerCase()}`}>
            <span className="mono record-label">{item.label}</span>
            <div>
              <h3 className="display">{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Kickoff() {
  return (
    <section className="chapter chapter-dark kickoff-layout" aria-labelledby="kickoff-title">
      <div className="kickoff-heading">
        <div className="eyebrow eyebrow-gold">Campaign kickoff</div>
        <h2 id="kickoff-title" className="display chapter-title chapter-title-light">Come as you are.<br /><em>Bring a neighbor.</em></h2>
        <p>Good food, an honest conversation, and a chance to meet the people building what comes next for East Palo Alto.</p>
      </div>
      <div className="kickoff-panel">
        <div className="kickoff-details">
          <div className="detail-row"><CalendarDays size={18} /><div><span className="mono detail-label">Date</span><strong>Saturday, September 5</strong></div></div>
          <div className="detail-row"><Clock3 size={18} /><div><span className="mono detail-label">Time</span><strong>11:30 AM – 12:30 PM</strong></div></div>
          <div className="detail-row"><MapPin size={18} /><div><span className="mono detail-label">Where</span><strong>Taqueria La Cazuela</strong><small>2390 Clarke Ave · garden / patio</small></div></div>
          <p className="spanish-note"><strong>En español:</strong> Lanzamiento de campaña para consejo municipal. Sábado 5 de septiembre, 11:30 am–12:30 pm.</p>
          <HashLink href="#involved" className="button button-primary" data-testid="link-kickoff-rsvp">I’ll be there <ArrowRight size={15} /></HashLink>
        </div>
        <div className="kickoff-map">
          <img src={asset('venue_map.png')} alt="Aerial map of Taqueria La Cazuela at Clarke Avenue and Bay Road" data-testid="img-event-map" />
          <div className="map-tag"><MapPin size={14} /> East Palo Alto, CA</div>
        </div>
      </div>
    </section>
  );
}

function Involved() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email.trim()) setSubmitted(true);
  };
  return (
    <section className="chapter chapter-light involved-layout" aria-labelledby="involved-title">
      <div className="involved-heading">
        <div className="eyebrow">Get involved</div>
        <h2 id="involved-title" className="display chapter-title">There’s a place<br />for you here.</h2>
      </div>
      <div className="involved-content">
        <p className="involved-lede">Campaigns like this run on neighbors, not corporate donors. Get updates, invitations, and ways to lend a hand.</p>
        {submitted ? (
          <div className="success-message" role="status" data-testid="status-newsletter-success"><CheckCircle2 size={19} /> You’re on the neighbor list. Thank you.</div>
        ) : (
          <form onSubmit={submit} className="signup-form" aria-label="Newsletter signup">
            <label className="sr-only" htmlFor="campaign-email">Email address</label>
            <input id="campaign-email" data-testid="input-newsletter-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="your@email.com" />
            <button type="submit" className="button button-primary" data-testid="button-newsletter-submit">Sign me up <ArrowRight size={15} /></button>
          </form>
        )}
        <div className="involved-actions">
          <HashLink href="#kickoff" className="involved-action" data-testid="link-involved-volunteer"><span className="mono">01 / SHOW UP</span><strong>Volunteer</strong><small>Knock doors, make calls, or help us welcome neighbors.</small><b>Find an event <ArrowRight size={14} /></b></HashLink>
          <a href="https://www.instagram.com/ofelia_4epa/" target="_blank" rel="noreferrer" className="involved-action" data-testid="link-involved-instagram"><span className="mono">02 / SHARE</span><strong>Spread the word</strong><small>Tell a friend why this city matters to you.</small><b>Follow @ofelia_4epa <Instagram size={14} /><Facebook size={14} /></b></a>
          <HashLink href="#kickoff" className="involved-action" data-testid="link-involved-question"><span className="mono">03 / CONNECT</span><strong>Bring your question</strong><small>The best campaigns listen first. Bring your hopes and ideas.</small><b>Join the conversation <ArrowRight size={14} /></b></HashLink>
        </div>
      </div>
    </section>
  );
}

function Footer({ current }: { current: ChapterId }) {
  const currentIndex = chapters.findIndex((chapter) => chapter.id === current);
  const previous = chapters[(currentIndex - 1 + chapters.length) % chapters.length];
  const next = chapters[(currentIndex + 1) % chapters.length];
  return (
    <footer className={`status-rail ${current === 'home' || current === 'kickoff' ? 'status-rail-dark' : ''}`}>
      <div className="rail-progress"><span style={{ width: `${((currentIndex + 1) / chapters.length) * 100}%` }} /></div>
      <div className="rail-inner">
        <button type="button" className="rail-control rail-prev" onClick={() => goToChapter(previous.id)} aria-label={`Previous chapter: ${previous.label}`} data-testid="button-previous-chapter"><ChevronLeft size={16} /><span className="rail-desktop-label">{previous.label}</span></button>
        <div className="rail-center"><span className="mono">{String(currentIndex + 1).padStart(2, '0')} / {String(chapters.length).padStart(2, '0')}</span><strong>{chapters[currentIndex].label}</strong></div>
        <button type="button" className="rail-control rail-next" onClick={() => goToChapter(next.id)} aria-label={`Next chapter: ${next.label}`} data-testid="button-next-chapter"><span className="rail-desktop-label">{next.label}</span><ChevronRight size={16} /></button>
      </div>
    </footer>
  );
}

function Home() {
  const [current, setCurrent] = useState<ChapterId>(() => readChapter());

  useEffect(() => {
    const sync = () => setCurrent(readChapter());
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    sync();
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('popstate', sync);
    };
  }, []);

  return (
    <div className="campaign-app paper-grain">
      <Header current={current} />
      <main className="chapter-stage" aria-live="polite">
        <div className={`chapter-panel chapter-panel-dark ${current === 'home' ? 'is-active' : ''}`} aria-hidden={current !== 'home'}><Hero /></div>
        <div className={`chapter-panel chapter-panel-light ${current === 'about' ? 'is-active' : ''}`} aria-hidden={current !== 'about'}><About /></div>
        <div className={`chapter-panel chapter-panel-light ${current === 'priorities' ? 'is-active' : ''}`} aria-hidden={current !== 'priorities'}><Priorities /></div>
        <div className={`chapter-panel chapter-panel-light ${current === 'record' ? 'is-active' : ''}`} aria-hidden={current !== 'record'}><Record /></div>
        <div className={`chapter-panel chapter-panel-dark ${current === 'kickoff' ? 'is-active' : ''}`} aria-hidden={current !== 'kickoff'}><Kickoff /></div>
        <div className={`chapter-panel chapter-panel-light ${current === 'involved' ? 'is-active' : ''}`} aria-hidden={current !== 'involved'}><Involved /></div>
      </main>
      <Footer current={current} />
    </div>
  );
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
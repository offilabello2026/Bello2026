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
  { id: 'gallery', label: 'In the community', kicker: '05' },
  { id: 'endorsements', label: 'Endorsements', kicker: '06' },
  { id: 'qa', label: 'Where she stands', kicker: '07' },
  { id: 'kickoff', label: 'Kickoff', kicker: '08' },
  { id: 'involved', label: 'Get involved', kicker: '09' },
] as const;

type ChapterId = (typeof chapters)[number]['id'];

const priorities = [
  { number: '01', title: 'Homes we can afford and keep', text: 'Protecting renters and building real paths to first-time homeownership so working families can stay in East Palo Alto.' },
  { number: '02', title: 'Streets, parks & the basics done right', text: 'Growing our tree canopy, funding parks and rec programming, and bringing transparency to paving, speed bumps, and equitable parking enforcement.' },
  { number: '03', title: 'Retail that actually serves us', text: 'Community benefits agreements that deliver real neighborhood retail, and activating empty lots into night markets.' },
  { number: '04', title: 'Community safety, not surveillance', text: 'Strengthening our sanctuary city policy, investing in emergency and climate preparedness, and moving mental health calls away from armed response.' },
  { number: '05', title: 'Transparent, communal governance', text: 'A city government that communicates clearly, governs alongside residents, and answers to us first.' },
];

const recordItems = [
  { label: '6 years', title: 'Leading a grassroots nonprofit', text: 'Organized around social, environmental, and racial justice alongside East Palo Alto residents.' },
  { label: '5 years', title: 'East Palo Alto Planning Commission', text: 'Served as vice-chair and advocated for equitable development that respects our city’s vision.' },
  { label: '2018', title: 'Led the Measure HH campaign', text: 'Mobilized the ballot initiative that now generates $1.7–2 million a year for affordable housing and workforce development in the trades.' },
  { label: '2020', title: 'COVID-19 renter relief effort', text: 'Initiated and managed a campaign that brokered housing resources, legal defense, and direct financial relief for 500+ East Palo Alto renter households.' },
  { label: '2022', title: 'Elected to the Sanitary District', text: 'Brought a steady, transparent voice to decisions affecting local ratepayers and District staff.' },
  { label: 'Today', title: 'Pahali Community Land Trust', text: 'Continuing the work of community ownership and housing stability as executive director.' },
];

const galleryPhotos = [
  { src: 'gallery-rent-relief.jpg', caption: 'Organizing COVID-era renter relief for EPA households' },
  { src: 'gallery-bcli-graduation.jpg', caption: 'BCLI graduation — building community land trust leadership' },
  { src: 'gallery-youth-farm-day.jpg', caption: 'Youth farm day in East Palo Alto' },
  { src: 'gallery-rent-stabilization-anniversary.jpg', caption: '35th anniversary of rent stabilization in EPA' },
  { src: 'gallery-yuca-celebration.jpg', caption: 'Celebrating the purchase of the YUCA building' },
  { src: 'gallery-dia-de-los-muertos.jpg', caption: 'Día de los Muertos with the community' },
];

const endorsementLogos = [
  { src: 'logo-working-families-party.png', name: 'Working Families Party of California' },
  { src: 'logo-smc-labor-council.jpg', name: 'San Mateo County Labor Council' },
  { src: 'logo-carpenters-union.png', name: 'North Coast States Carpenters Union' },
];

const endorsers = [
  { name: 'Javanni Brown', role: 'East Palo Alto Planning Commissioner' },
  { name: 'Francisco Guzman', role: 'Rent Stabilization Board Member' },
  { name: 'Laura Rubio', role: 'Rent Stabilization Board Member' },
];

const qaItems = [
  {
    q: 'What is your stance on the Flock cameras already being used in East Palo Alto?',
    a: 'Surveillance is not safety. Flock is a corporation facing lawsuits and backlash for good reason — at best it offers damage control after harm has occurred; at worst it profits off white supremacy, facilitates ICE violence, and violates reproductive rights, with high error rates on top of it. East Palo Alto deserves real safety, which means addressing harm at its root, not surveilling our way around it. In 2022 I supported the community member who catalyzed EPA’s Coalition Against Human Trafficking in defense of youth survivors — that’s the kind of real solution we should be investing in.',
  },
  {
    q: 'What is your stance on new data centers being built in East Palo Alto?',
    a: 'I am absolutely opposed. East Palo Alto didn’t kick the ROMIC toxic waste facility out of town in 2007 just to face another environmental assault, now worsened by climate change. As the only challenger with elected-office experience — at the East Palo Alto Sanitary District — I understand what it takes to responsibly steward our water and infrastructure systems. Data centers have no place in a responsible development path forward.',
  },
  {
    q: 'What is your stance on the use of generative AI in campaigns?',
    a: 'I’m against the unnecessary use of AI in general — conversations with labor, environmentalists, and neighbors have affirmed real concerns about water consumption, job automation, and impacts on critical thinking. I don’t use AI in my campaign materials or my writing. AI is already embedded in everyday software whether we like it or not, but that only means we need serious discernment, strict responsibility, and laws that catch up — fast.',
  },
  {
    q: 'What is your stance on ICE?',
    a: 'ICE must be abolished. It’s an agency that has only existed since 2003 — we lived without it before and can again. East Palo Alto’s Sanctuary City policy must be strictly upheld, and it’s time to strengthen it against city contracts with corporations known to work with ICE. I’m proud to have trained with and actively support local immigration defense and mutual aid efforts. We keep us safe.',
  },
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
          {chapters.filter((chapter) => !['home', 'involved'].includes(chapter.id)).map((chapter) => (
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
            <HashLink href="#involved" className="button button-primary" data-testid="link-hero-kickoff">
              Get involved <ArrowRight size={15} />
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
          <img src={asset('hero-portrait.jpg')} alt="Ofelia Bello" className="hero-photo-card" data-testid="img-hero-ofelia" />
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
        <img src={asset('about-portrait.jpg')} alt="Ofelia Bello" className="about-portrait" data-testid="img-about-portrait" />
        <div className="eyebrow">Meet Ofelia</div>
        <p className="display aside-quote">A love letter to home.</p>
      </div>
      <div className="about-main">
        <h2 id="about-title" className="display quote-title">“I will always keep in mind what is best for ordinary and working-class people in EPA.”</h2>
        <div className="about-columns">
          <p>I’m a <strong>33-year-old Latina professional</strong>, proudly born and raised in East Palo Alto — a product of Ravenswood City School District, valedictorian of Edison McNair Academy, and a graduate of Eastside College Prep.</p>
          <p>In 2015 I graduated from UC Santa Barbara, and in 2017 I joined the less than 5% of Latinas who hold master’s degrees, earning my MA in Urban and Public Affairs from the University of San Francisco.</p>
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

function Gallery() {
  return (
    <section className="chapter chapter-light gallery-layout" aria-labelledby="gallery-title">
      <div className="chapter-heading">
        <div>
          <div className="eyebrow">In the community</div>
          <h2 id="gallery-title" className="display chapter-title">Years of showing<br /><em>up together.</em></h2>
        </div>
        <p>A campaign doesn’t start the work — it continues it. A few moments from a decade of organizing alongside East Palo Alto.</p>
      </div>
      <div className="gallery-grid">
        {galleryPhotos.map((photo) => (
          <figure key={photo.src}>
            <img src={asset(photo.src)} alt={photo.caption} loading="lazy" />
            <figcaption>{photo.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Endorsements() {
  return (
    <section className="chapter chapter-light endorsements-layout" aria-labelledby="endorsements-title">
      <div className="chapter-heading">
        <div>
          <div className="eyebrow">Endorsements</div>
          <h2 id="endorsements-title" className="display chapter-title">Backed by people<br /><em>who do the work.</em></h2>
        </div>
        <p>Organizations and local leaders who know Ofelia’s record firsthand.</p>
      </div>
      <div className="endorsement-logos">
        {endorsementLogos.map((logo) => (
          <div key={logo.src} className="endorsement-logo-card">
            <img src={asset(logo.src)} alt={logo.name} />
            <span>{logo.name}</span>
          </div>
        ))}
      </div>
      <div className="endorsers-list">
        {endorsers.map((person) => (
          <div key={person.name} className="endorser-row">
            <strong className="display">{person.name}</strong>
            <span>{person.role}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function QA() {
  return (
    <section className="chapter chapter-light qa-layout" aria-labelledby="qa-title">
      <div className="eyebrow">Where she stands</div>
      <h2 id="qa-title" className="display chapter-title">Straight answers,<br /><em>no hedging.</em></h2>
      <div className="qa-list">
        {qaItems.map((item) => (
          <div key={item.q} className="qa-item">
            <h3 className="display">{item.q}</h3>
            <p>{item.a}</p>
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
        <div className="eyebrow eyebrow-gold">Kickoff recap</div>
        <h2 id="kickoff-title" className="display chapter-title chapter-title-light">Thank you for<br /><em>showing up.</em></h2>
        <p>On September 5, neighbors gathered at Taqueria La Cazuela for good food, honest conversation, and the launch of this campaign.</p>
      </div>
      <div className="kickoff-panel">
        <div className="kickoff-details">
          <div className="detail-row"><CalendarDays size={18} /><div><span className="mono detail-label">Held</span><strong>Saturday, September 5</strong></div></div>
          <div className="detail-row"><Clock3 size={18} /><div><span className="mono detail-label">Time</span><strong>11:30 AM – 12:30 PM</strong></div></div>
          <div className="detail-row"><MapPin size={18} /><div><span className="mono detail-label">Where</span><strong>Taqueria La Cazuela</strong><small>2390 Clarke Ave · garden / patio</small></div></div>
          <p className="spanish-note"><strong>En español:</strong> Lanzamiento de campaña para consejo municipal, celebrado el 5 de septiembre en La Cazuela.</p>
          <HashLink href="#involved" className="button button-primary" data-testid="link-kickoff-rsvp">See what’s next <ArrowRight size={15} /></HashLink>
          <div className="kickoff-fliers">
            <a href={asset('kickoff-flier-en.png')} target="_blank" rel="noreferrer" data-testid="link-flier-en">
              <img src={asset('kickoff-flier-en.png')} alt="Campaign kickoff flier in English" />
              <span>English flier</span>
            </a>
            <a href={asset('kickoff-flier-es.png')} target="_blank" rel="noreferrer" data-testid="link-flier-es">
              <img src={asset('kickoff-flier-es.png')} alt="Volante del lanzamiento de campaña en español" />
              <span>Volante en español</span>
            </a>
          </div>
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
        <div className={`chapter-panel chapter-panel-light ${current === 'gallery' ? 'is-active' : ''}`} aria-hidden={current !== 'gallery'}><Gallery /></div>
        <div className={`chapter-panel chapter-panel-light ${current === 'endorsements' ? 'is-active' : ''}`} aria-hidden={current !== 'endorsements'}><Endorsements /></div>
        <div className={`chapter-panel chapter-panel-light ${current === 'qa' ? 'is-active' : ''}`} aria-hidden={current !== 'qa'}><QA /></div>
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
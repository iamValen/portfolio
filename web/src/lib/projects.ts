export type ProjectMetric = { value: string; label: string }

export type ProjectSection = {
  heading: string
  body: string[]
  /** Optional screenshot rendered after this section's body. */
  screenshot?: ProjectScreenshot
}

export type ProjectScreenshot = {
  src: string
  alt: string
  caption?: string
}

export type ProjectStatus = 'online' | 'offline'

export type Project = {
  slug: string
  name: string
  role: string
  stack: string
  github?: string
  /** Hardcoded deployment state shown as a badge on the card + detail page. */
  status: ProjectStatus
  /** Public URL of the live deployment; the badge links to it when online. */
  liveUrl?: string
  /** Small preview image (in /public) shown dimmed on the project cards. */
  thumbnail?: string
  excerpt: string
  metrics: ProjectMetric[]
  screenshots?: ProjectScreenshot[]
  sections?: ProjectSection[]
}

export const PROJECTS: Project[] = [
  {
    slug: 'portfolio',
    name: 'Portfolio',
    role: 'Solo · Design + build',
    stack: 'React 19 · TypeScript · Vite · CSS',
    github: 'https://github.com/iamValen/portfolio',
    status: 'online',
    // liveUrl: 'https://your-domain.com',  // add the deployed URL to make the badge link out
    thumbnail: '/portfolio.png',
    excerpt:
      'This site. A hand-built portfolio with no UI framework and no router library, just a small custom client-side router, a typed and data-driven content layer, and a dark, monospace design system built from scratch.',
    metrics: [
      { value: '0 deps',  label: 'UI / router libs' },
      { value: 'SPA',     label: 'custom pushState router' },
      { value: 'Vite',    label: 'build + git versioning' },
    ],
    sections: [
      {
        heading: 'Why I built it this way',
        body: [
          'I wanted the portfolio itself to be a project, not a template. So no component library, no `react-router`, no CSS framework - everything from the routing to the design system is hand-rolled, which keeps the bundle tiny and means every line is something I can actually explain.',
        ],
      },
      {
        heading: 'Architecture',
        body: [
          'A single **React 19 + TypeScript + Vite** app. Routing is a ~30-line `useRoute` hook over the History API (`pushState` + `popstate`) with smooth in-page anchor scrolling - no router dependency.',
          'Content is **data-driven**: projects, lab notes, services and skills each live in a typed module under `lib/`, so adding a project or a note is a data edit, not a markup change - the pages and cards just render those arrays.',
          'The build injects the current **git tag and commit date** through Vite `define`, so the footer version always tracks the real release.',
        ],
      },
      {
        heading: 'Design',
        body: [
          'A dark, **monospace-led** design system: CSS custom properties drive the whole palette, IBM Plex Mono throughout, and a flat, zero-radius aesthetic. Sections reveal on scroll and the nav highlights the active section with an **IntersectionObserver**.',
        ],
      },
    ],
  },
  {
    slug: 'game-reviewer',
    name: 'Game Reviewer+',
    role: 'Team of 4 · Full-stack contributor · DevOps owner',
    stack: 'TS · React · Express · Prisma · PostgreSQL · Docker · GitHub Actions · Grafana · Prometheus · Loki',
    github: 'https://github.com/PantocaPipoca/Game-Reviewer',
    status: 'offline',
    thumbnail: '/game-reviewer.png',
    excerpt:
      'A platform where you can write, read, and share video game reviews. It is not a site for professional critic scores, but rather a real opinion from real players. Integrates the IGDB API for game data, with monitoring through Grafana dashboards and CI with GitHub Actions.',
    metrics: [
      { value: 'IGDB',           label: 'game data API' },
      { value: 'Logs & Metrics', label: 'monitoring' },
      { value: 'CI',             label: 'tests + scans on push' },
    ],
    screenshots: [
      {
        src: '/game-reviewer.png',
        alt: 'Game Reviewer+ homepage with featured reviews and game catalogue',
        caption: 'Homepage',
      },
    ],
    sections: [
      {
        heading: 'Why we built this',
        body: [
          'We wanted a place where the people actually playing the games could write, share, and argue about them with reactions, comments, and a follow system so you could track reviewers with taste close to yours, add friends and share gaming experiences.',
        ],
      },
      {
        heading: 'Architecture',
        body: [
          'Three layers: a React 19 + TypeScript + Vite frontend; a Node.js + Express 5 backend with JWT auth; and PostgreSQL with Prisma as the ORM and Database.',
          'Game data comes from the **IGDB API** and our database stays small and reviews-focused, while titles, covers and metadata are fetched on demand.',
        ],
      },
      {
        heading: 'How we worked',
        body: [
          'We worked in **Scrum** - sprint planning, weekly demos, retros. Three branches: `main` for stable, `dev` for feature integration, `tests` for workflow validation and each developing feature has its own branch. Commits used keyword prefixes (`ADD`, `FIX`, `DOC`, `TEST`) to make the history easier to read.',
          'Testing was strict about isolation - a dedicated **test database** truncated before each run, and separate `.env` files for Docker, runtime and testing so variables never crossed contexts.',
        ],
      },
      {
        heading: 'My contributions',
        body: [
          'My role was **full-stack** developer, where I built both the frontend and the backend, and owning the whole **DevOps** side of the project end to end.',
          'On the backend I did the JWT authentication flow (token issuance and verification, middleware for protected routes, and the user session lifecycle), the Services layer for the reviews and users endpoints, and **API integration tests**',
          'On the infra side: every **Docker** image and compose file; the **PostgreSQL** integration with **Prisma**; the dedicated **test database** that gets truncated before each test run; the split of **environment variables** across Docker / backend runtime / testing contexts.',
          '**CI** in GitHub Actions - pipelines running on every push: tests, **SAST** (static analysis), **DAST** (runtime security checks), **container scanning** on the built images, and dependency vulnerability scans.',
          '**Monitoring** stack - **Grafana** dashboards I built specifically for this project: API latency, request rates, error counts, and log streams from Prometheus and Loki.',
        ],
        screenshot: {
          src: '/game-reviewer-dashboard.png',
          alt: 'Custom Grafana dashboard with API metrics and logs for Game Reviewer+',
          caption: 'Grafana - custom dashboards for API metrics, request rates, and log streams',
        },
      },
    ],
  },
  {
    slug: 'packet-flow',
    name: 'PacketFlow',
    role: 'Full-stack · simulation engine',
    stack: 'React · TS · React Flow · Express · Prisma · PostgreSQL · Docker',
    github: 'https://github.com/iamValen/packet-flow',
    status: 'offline',
    thumbnail: '/packet-flow.png',
    excerpt:
      'A web-based network packet simulator for learning and exploration. Drop routers, switches, hosts and firewalls onto a canvas, wire them up, and step through how packets traverse the topology. Not a Cisco Packet Tracer replacement - focused on being understandable and developer-friendly.',
    metrics: [
      { value: '4',      label: 'device types' },
      { value: 'Live',   label: 'step-through simulation' },
      { value: 'Docker', label: 'one-command setup' },
    ],
    sections: [
      {
        heading: 'Why I built this',
        body: [
          'Enterprise network simulators (Cisco Packet Tracer, GNS3) are powerful but heavy, closed, and not exactly inviting if you just want to understand how a packet moves between two hosts through a router. I wanted a small, readable tool - open source, modern stack, the kind of project you can clone and figure out in an afternoon.',
          'Building it forces me to actually understand the protocols rather than just pass the network course exam.',
        ],
      },
      {
        heading: 'Architecture',
        body: [
          'Three layers: **React + TypeScript + Vite** on the frontend (**React Flow** handles the canvas + node graph), **Node.js + Express + Prisma** on the backend, and **PostgreSQL** for persistence. All three boot via `docker compose up --build` - Postgres on its own service, backend on `:3000`, frontend on `:5173`.',
          'Devices modelled today: hosts, routers, switches, firewalls. Each has its own rules for what to do when a packet arrives. The simulation engine walks the topology graph and emits step-by-step events the UI replays on the canvas.',
        ],
      },
      {
        heading: "What's next",
        body: [
          'The current focus is strengthening the simulation model before piling on features. Roadmap (in order):',
          '- Finish the protocol coverage so the basics are rock-solid',
          '- Implement static helpers (preconfigured topologies for common scenarios)',
          '- Add link-level details: latency, bandwidth, packet loss',
          '- Improve documentation so contributors can find their footing fast',
        ],
      },
      {
        heading: 'What I learned',
        body: [
          '[TODO - once you have a couple of months of distance from a working version, write here what surprised you. The hardest decision, the bug that ate a weekend, the design choice you would reverse.]',
        ],
      },
    ],
  },
]

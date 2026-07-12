export type Skill = {
  name: string
  icon?: string
  uses: { where: string; what: string }[]
}

export const SKILLS: Skill[] = [
  {
    name: 'Linux',
    icon: 'linux',
    uses: [
      { where: 'HomeLab', what: 'Every host runs Linux - Arch, Debian, Alpine inside containers.' },
      { where: 'Daily driver', what: 'Arch as my main OS.' },
    ],
  },
  {
    name: 'Docker',
    icon: 'docker',
    uses: [
      { where: 'HomeLab', what: 'Most services run as compose stacks grouped by purpose.' },
      { where: 'Game Reviewer+', what: 'Owned every Docker image and compose file. Dev/prod parity, isolated test environment, three separate .env files.' },
      { where: 'PacketFlow', what: 'docker compose up - Postgres, backend, and frontend each on their own service.' },
    ],
  },
  {
    name: 'VMs',
    uses: [
      { where: 'HomeLab', what: 'Kernels, distros, and isolated lab environments where containers aren\'t enough.' },
    ],
  },
  {
    name: 'Networking',
    uses: [
      { where: 'HomeLab', what: 'OPNsense routing, VLAN segmentation, default-deny firewall, WireGuard remote access.' },
      { where: 'PacketFlow', what: 'Built a visual topology + packet simulator: routers, switches, hosts, firewalls, basic protocol behaviour.' },
    ],
  },
  {
    name: 'GitHub Actions',
    icon: 'githubactions',
    uses: [
      { where: 'Game Reviewer+', what: 'CI on every push: tests, SAST (static analysis), DAST (runtime checks), container scanning, dependency vulnerability scans.' },
    ],
  },
  {
    name: 'Jenkins',
    icon: 'jenkins',
    uses: [
      { where: 'University', what: 'CI/CD coursework - pipelines, agents, plugins.' },
    ],
  },
  {
    name: 'C',
    icon: 'c',
    uses: [
      { where: 'University', what: 'Systems programming - memory, processes, low-level Linux APIs.' },
    ],
  },
  {
    name: 'Java',
    icon: 'openjdk',
    uses: [
      { where: 'University', what: 'OOP, data structures, algorithms.' },
      { where: 'Neural Network', what: 'Small feedforward net written from scratch to understand the math.' },
    ],
  },
  {
    name: 'JavaScript',
    icon: 'javascript',
    uses: [
      { where: 'Game Reviewer+', what: 'Express backend logic, validation, JWT auth middleware, test suite.' },
      { where: 'PacketFlow', what: 'Backend simulation engine and topology graph logic.' },
    ],
  },
  {
    name: 'TypeScript',
    icon: 'typescript',
    uses: [
      { where: 'Game Reviewer+', what: 'Strict typing across the whole frontend (React 19 + Vite).' },
      { where: 'PacketFlow', what: 'Strict typing on both sides - React Flow canvas + Express/Prisma backend.' },
      { where: 'This site', what: 'React + Vite + tiny custom router.' },
    ],
  },
  {
    name: 'Python',
    icon: 'python',
    uses: [
      { where: 'Personal', what: 'Scripts and automation for the lab and day-to-day.' },
    ],
  },
  {
    name: 'Node.js',
    icon: 'nodedotjs',
    uses: [
      { where: 'Game Reviewer+', what: 'Express 5 REST API, JWT auth, Prisma ORM, IGDB API integration.' },
      { where: 'PacketFlow', what: 'Express + Prisma backend, topology persistence, simulation API.' },
    ],
  },
]

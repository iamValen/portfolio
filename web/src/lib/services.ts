export type Service = {
  name: string
  what: string
  icon?: string // simpleicons slug, optional
}

export type ServiceGroup = {
  name: string
  blurb?: string
  services: Service[]
}

// The lab, grouped by what each stack is for. Edit freely - `icon` is an
// optional simpleicons slug (rendered via cdn.simpleicons.org).
export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    name: 'Edge & Network',
    blurb: 'Everything inbound passes through here first.',
    services: [
      { name: 'OPNsense', what: 'Router, firewall, default-deny rules, VLAN segmentation.', icon: 'opnsense' },
      { name: 'WireGuard', what: 'Remote access back into the lab from anywhere.', icon: 'wireguard' },
      { name: 'Reverse proxy', what: 'Single TLS entrypoint, automatic certificate renewal.' },
      { name: 'Local DNS', what: 'Internal resolver with custom records for lab hostnames.' },
    ],
  },
  {
    name: 'Compute & Orchestration',
    blurb: 'Where the services actually run.',
    services: [
      { name: 'Docker Compose', what: 'Most services run as compose stacks grouped by purpose.', icon: 'docker' },
      { name: 'Virtual machines', what: 'Kernels, distros and isolated labs where containers aren\'t enough.' },
      { name: 'Linux hosts', what: 'Arch, Debian and Alpine across bare metal and containers.', icon: 'linux' },
    ],
  },
  {
    name: 'Data & Backups',
    blurb: 'State that has to survive a rebuild.',
    services: [
      { name: 'Storage volume', what: 'Separate data volume with scheduled snapshots.' },
      { name: 'Backups', what: 'Rolling snapshots plus an off-box copy, with monthly restore tests.' },
      { name: 'PostgreSQL', what: 'Persistence for self-hosted apps that need a real database.', icon: 'postgresql' },
    ],
  },
  {
    name: 'Observability',
    blurb: 'Knowing what broke before someone tells me.',
    services: [
      { name: 'Metrics', what: 'Host and container metrics scraped on a schedule. (WIP)' },
      { name: 'Logs', what: 'Centralised log aggregation across the stacks. (WIP)' },
    ],
  },
]

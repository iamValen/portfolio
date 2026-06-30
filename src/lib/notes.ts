export type Note = {
  slug: string
  title: string
  date: string
  tags: string[]
  excerpt: string
  body?: string[]
}

export const NOTES: Note[] = [
  {
    slug: 'default-deny',
    title: 'Default-deny without locking yourself out',
    date: '2026-04-12',
    tags: ['networking', 'opnsense', 'firewall'],
    excerpt:
      'The firewall rule I was too clever about, the WAN session that died at 2am, and the rule order I now write down before touching anything.',
    body: [
      'I wanted the lab VLAN locked down by default - anything not explicitly allowed gets dropped. Sounds obvious until you push the rule and your own SSH session dies because the management subnet wasn\'t in the allow list yet.',
      'The fix is mechanical: write the allow rules first, leave them disabled, push, enable in order, only then add the default-deny at the bottom. The lesson took one night to learn and I write it down on every change now.',
    ],
  },
  {
    slug: 'backups-that-arent',
    title: 'Backups that weren\'t backups',
    date: '2026-02-03',
    tags: ['ops', 'backups'],
    excerpt:
      'I had nightly snapshots for months. The first time I tried to restore, half of what I wanted wasn\'t in the snapshot. Here\'s what was wrong.',
    body: [
      'The volume I was snapshotting was the application data volume. Easy mistake: the configuration the application reads on boot lives somewhere else. I had backups of "what the app writes" but nothing of "what the app needs to start".',
      'Now the backup checklist starts with: where does configuration live, where does state live, where does data live, and which of those have to come back together. The restore test goes into the calendar every month.',
    ],
  },
  {
    slug: 'reverse-proxy-websocket',
    title: 'When the reverse proxy ate my WebSocket',
    date: '2025-11-18',
    tags: ['proxy', 'tls', 'debugging'],
    excerpt:
      'A long-lived connection that worked locally but kept dying behind the proxy. The 60-second timeout was hiding in plain sight.',
    body: [
      'A self-hosted service was disconnecting every minute. Browser console said the WebSocket closed, no error code worth Googling. Worked perfectly when I bypassed the proxy. Classic timeout - except I had already raised the obvious one.',
      'Turned out two different timeouts apply to upgraded connections: the read timeout and the proxy idle timeout. Raising both fixed it. The annoying part: the documentation lists them in two different sections.',
    ],
  },
]

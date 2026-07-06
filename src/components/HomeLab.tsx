import type { ReactNode } from 'react'
import { Section } from './Section'
import { Link } from './Link'

export function HomeLab() {
  return (
    <Section id="homelab" title="HomeLab">
      <div className="status-line">
        <span className="status-dot" />
        <span>online</span>
        <span className="status-sep">·</span>
        <span>running since June 2023</span>
      </div>

      <p>
        The place I try every infra idea before it touches anything
        that matters. Production-shaped operations, on a small budget,
        documented as I go.
      </p>

      <div className="grid">
        <Card title="Network">
          <li><b>Router / firewall:</b> OPNsense</li>
          <li><b>Segmentation:</b> VLANs for trusted, IoT, lab</li>
          <li><b>Remote access:</b> WireGuard</li>
          <li><b>DNS:</b> local resolver with custom records</li>
        </Card>

        <Card title="Compute">
          <li><b>Containers:</b> Docker compose stacks</li>
          <li><b>VMs:</b> kernels, distros, lab environments</li>
          <li><b>Storage:</b> separate data volume, scheduled snapshots</li>
        </Card>

        <Card title="Services">
          <li><b>Reverse proxy + TLS:</b> single entry, auto-renew</li>
          <li><b>Backups:</b> rolling snapshots, off-box copy</li>
          <li><b>Monitoring:</b> WIP - logs and metrics first</li>
        </Card>
      </div>

      <Link to="/homelab" className="feature-card">
        <div className="feature-card-text">
          <span className="feature-card-label">Explore the lab</span>
          <span className="feature-card-title">
            Services, network, and the lab notes
          </span>
        </div>
        <span className="feature-card-arrow">→</span>
      </Link>
    </Section>
  )
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="card">
      <h3 className="card-title">{title}</h3>
      <ul className="list">{children}</ul>
    </article>
  )
}

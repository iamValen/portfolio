import { Section } from './Section'

type Language = { name: string; level: string }

const LANGUAGES: Language[] = [
  { name: 'Portuguese', level: 'Native' },
  { name: 'English',    level: 'Fluent' },
  { name: 'Russian',    level: 'Native' },
]

export function Education() {
  return (
    <Section id="education" title="Education & Certifications">
      <article className="cred">
        <h3 className="cred-title">BSc Computer Engineering</h3>
        <p className="cred-meta">University of Algarve · 2023 - 2026 (graduated)</p>
      </article>
      <article className="cred">
        <h3 className="cred-title">CompTIA Security+</h3>
        <p className="cred-meta">In progress</p>
      </article>

      <div className="languages-row">
        <span className="languages-label">Languages</span>
        <ul className="languages">
          {LANGUAGES.map(l => (
            <li key={l.name} className="language">
              <span className="language-name">{l.name}</span>
              <span className="language-level">{l.level}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}

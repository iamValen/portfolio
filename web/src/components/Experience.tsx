import { EXPERIENCES } from '../lib/experience'
import { Section } from './Section'

export function Experience() {
  return (
    <Section id="experience" title="Experience">
      {EXPERIENCES.map(job => (
        <article key={job.company} className="job">
          <header className="job-head">
            <h3 className="job-company">{job.company}</h3>
            <span className="job-period">{job.period}</span>
          </header>
          <p className="job-role">{job.role}</p>
          {job.description && <p className="job-desc">{job.description}</p>}
          {job.stack && <p className="job-stack">{job.stack}</p>}
        </article>
      ))}
    </Section>
  )
}

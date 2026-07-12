import { Hero } from '../components/Hero'
import { About } from '../components/About'
import { Experience } from '../components/Experience'
import { Projects } from '../components/Projects'
import { HomeLab } from '../components/HomeLab'
import { Stack } from '../components/Stack'
import { Education } from '../components/Education'

export function Home() {
  return (
    <>
      <Hero />
      <hr className="divider" />
      <About />
      <Experience />
      <Projects />
      <HomeLab />
      <Stack />
      <Education />
    </>
  )
}

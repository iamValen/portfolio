import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { HomeLabPage } from './pages/HomeLabPage'
import { NotePage } from './pages/NotePage'
import { ProjectsPage } from './pages/ProjectsPage'
import { ProjectPage } from './pages/ProjectPage'
import { WallPage } from './pages/WallPage'
import { useRoute } from './hooks/useRoute'

export default function App() {
  const { path } = useRoute()
  const pageKey = path.replace(/\/$/, '') || '/'

  return (
    <>
      <Nav />
      <main className="container">
        <div key={pageKey} className="page-fade">
          {renderPage(path)}
        </div>
        <Footer />
      </main>
    </>
  )
}

function renderPage(path: string) {
  const normalized = path.replace(/\/$/, '') || '/'

  if (normalized === '/wall') return <WallPage />
  if (normalized === '/homelab') return <HomeLabPage />
  // The lab notes index now lives on the HomeLab page; keep /notes resolving.
  if (normalized === '/notes') return <HomeLabPage />
  if (normalized.startsWith('/notes/')) {
    return <NotePage slug={normalized.slice('/notes/'.length)} />
  }
  if (normalized === '/projects') return <ProjectsPage />
  if (normalized.startsWith('/projects/')) {
    return <ProjectPage slug={normalized.slice('/projects/'.length)} />
  }
  return <Home />
}

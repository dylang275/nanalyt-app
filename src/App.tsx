import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import Dashboard from './pages/Dashboard'
import Findings from './pages/Findings'
import Competitors from './pages/Competitors'
import ActiveProducts from './pages/ActiveProducts'
import Studio from './pages/Studio'
import PdpEditor from './pages/PdpEditor'
import Research from './pages/Research'
import ResearchAnalysis from './pages/ResearchAnalysis'
import Tests from './pages/Tests'
import Settings from './pages/Settings'

function App() {
  return (
    <Routes>
      <Route path="studio/pdp/edit" element={<PdpEditor />} />
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="findings" element={<Findings />} />
        <Route path="active-products" element={<ActiveProducts />} />
        <Route path="competitors" element={<Competitors />} />
        <Route path="research" element={<Research />} />
        <Route path="research/analysis" element={<ResearchAnalysis />} />
        <Route path="studio" element={<Studio />} />
        <Route path="tests" element={<Tests />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App

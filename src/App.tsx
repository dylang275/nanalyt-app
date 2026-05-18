import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import Dashboard from './pages/Dashboard'
import Findings from './pages/Findings'
import Competitors from './pages/Competitors'
import ActiveProducts from './pages/ActiveProducts'
import Studio from './pages/Studio'
import Research from './pages/Research'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="findings" element={<Findings />} />
        <Route path="competitors" element={<Competitors />} />
        <Route path="active-products" element={<ActiveProducts />} />
        <Route path="studio" element={<Studio />} />
        <Route path="research" element={<Research />} />
      </Route>
    </Routes>
  )
}

export default App

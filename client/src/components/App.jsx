import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Saccos from './pages/Saccos'
import Matatus from './pages/Matatus'
import RoutesPage from './pages/RoutesPage'

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/saccos" element={<Saccos />} />
        <Route path="/matatus" element={<Matatus />} />
        <Route path="/routes" element={<RoutesPage />} />
      </Routes>
    </Router>
  )
}

export default App
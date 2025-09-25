import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Saccos from './pages/Saccos'
import Matatus from './pages/Matatus'

import Routes_pages from './pages/Routes_pages'


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Navbar />
        <main>
          <Routes>
            
            <Route path="/" element={<Home />} />

            <Route path="/saccos" element={<Saccos />} />
            <Route path="/matatus" element={<Matatus />} />
            <Route path="/routes" element={<Routes_pages />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
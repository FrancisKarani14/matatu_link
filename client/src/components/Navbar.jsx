import React, { useState } from "react"
import { Link, useLocation } from "react-router-dom"

const Navbar = () => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path) =>
    location.pathname === path ? "text-blue-600 font-semibold" : "text-gray-700"

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-xl font-bold text-blue-600">Matatu Link</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className={isActive("/")}>
            Home
          </Link>
          <Link to="/saccos" className={isActive("/saccos")}>
            Saccos
          </Link>
          <Link to="/matatus" className={isActive("/matatus")}>
            Matatus
          </Link>
          
          <Link to="/routes" className={isActive("/routes")}>
            Routes
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden focus:outline-none"
        >
          <span className="text-2xl">☰</span>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md border-t">
          <div className="flex flex-col space-y-4 p-4">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={isActive("/")}
            >
              Home
            </Link>
            <Link
              to="/matatus"
              onClick={() => setIsMobileMenuOpen(false)}
              className={isActive("/matatus")}
            >
              Matatus
            </Link>
            <Link
              to="/saccos"
              onClick={() => setIsMobileMenuOpen(false)}
              className={isActive("/saccos")}
            >
              Saccos
            </Link>
            <Link
              to="/routes"
              onClick={() => setIsMobileMenuOpen(false)}
              className={isActive("/routes")}
            >
              Routes
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

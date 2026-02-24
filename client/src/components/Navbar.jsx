import React, { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"

const Navbar = () => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")
    if (token && userData) {
      setUser(JSON.parse(userData))
    } else {
      setUser(null)
    }
  }, [location])

  const isActive = (path) =>
    location.pathname === path ? "text-red-900 font-semibold" : "text-gray-700"

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/images/fav.png" alt="Matatu Link" className="h-8 w-8" />
          <h1 className="text-xl font-bold text-red-900">Matatu Link</h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
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
          {user && (
            <Link 
              to={user.role === "super_admin" ? "/super-admin" : user.role === "admin" ? "/admin" : "/"}
              className="px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-950 transition font-semibold"
            >
              Dashboard
            </Link>
          )}
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
            {user && (
              <Link
                to={user.role === "super_admin" ? "/super-admin" : user.role === "admin" ? "/admin" : "/"}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-950 transition font-semibold text-center"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

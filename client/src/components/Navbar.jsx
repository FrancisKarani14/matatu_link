import React, { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")
    setUser(token && userData ? JSON.parse(userData) : null)
  }, [location])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/saccos", label: "Saccos" },
    { to: "/matatus", label: "Matatus" },
    { to: "/routes", label: "Routes" },
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    navigate("/login")
  }

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-gray-100"
          : "bg-white/80 backdrop-blur-md border-b border-gray-100/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center shadow-md group-hover:shadow-red-900/30 transition-shadow">
              <img src="/images/fav.png" alt="" className="w-5 h-5 object-contain" />
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              Matatu<span className="text-red-900">Link</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(to)
                    ? "text-red-900 bg-red-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {label}
                {isActive(to) && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-900" />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={user.role === "super_admin" ? "/super-admin" : "/admin"}
                  className="px-4 py-2 text-sm font-semibold text-red-900 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-semibold text-white rounded-lg btn-primary"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-semibold text-white rounded-lg btn-primary"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? "max-h-96 border-t border-gray-100" : "max-h-0"
        }`}
      >
        <div className="px-4 py-3 space-y-1 bg-white">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(to)
                  ? "text-red-900 bg-red-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="pt-2 pb-1 border-t border-gray-100 mt-2 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to={user.role === "super_admin" ? "/super-admin" : "/admin"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-semibold text-red-900 border border-red-200 rounded-lg text-center hover:bg-red-50 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                  className="w-full px-4 py-2.5 text-sm font-semibold text-white rounded-lg btn-primary text-center"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-semibold text-white rounded-lg btn-primary text-center"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

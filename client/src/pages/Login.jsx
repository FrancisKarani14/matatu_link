import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { API_BASE_URL } from "../config"

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (response.ok) {
        localStorage.setItem("token", data.access_token)
        localStorage.setItem("user", JSON.stringify(data.user))
        if (data.user.role === "super_admin") navigate("/super-admin")
        else if (data.user.role === "admin") navigate("/admin")
        else navigate("/")
      } else {
        setError(data.error || "Login failed")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/heroML.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/90 via-red-900/80 to-black/70" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <img src="/images/fav.png" alt="" className="w-5 h-5 object-contain" />
            </div>
            <span className="text-white font-bold text-xl">MatatuLink</span>
          </Link>
          <div>
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Navigate Kenya<br />with confidence
            </h2>
            <p className="text-red-200 text-lg leading-relaxed mb-8">
              Access real-time information on saccos, routes, and fares across the country.
            </p>
            <div className="grid grid-cols-3 gap-6">
              {[["50+", "Saccos"], ["200+", "Routes"], ["1000+", "Matatus"]].map(([val, lbl]) => (
                <div key={lbl} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/15">
                  <p className="text-2xl font-bold text-white">{val}</p>
                  <p className="text-red-200 text-sm">{lbl}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-red-300 text-sm">© {new Date().getFullYear()} Matatu Link</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-[#f8f7f5]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center">
              <img src="/images/fav.png" alt="" className="w-5 h-5 object-contain" />
            </div>
            <span className="font-bold text-gray-900">Matatu<span className="text-red-900">Link</span></span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h1>
            <p className="text-gray-500 mt-2">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
              <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 font-bold">!</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="input-field"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="input-field pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 btn-primary rounded-xl font-semibold text-base disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : "Sign in"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-8">
            Don't have an account?{" "}
            <Link to="/signup" className="text-red-900 font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { API_BASE_URL } from "../config"

const Signup = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", confirmPassword: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!")
      return
    }
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        localStorage.setItem("token", data.access_token)
        localStorage.setItem("user", JSON.stringify(data.user))
        navigate("/")
      } else {
        setError(data.error || "Registration failed")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const PasswordInput = ({ name, value, show, onToggle, placeholder, label }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={handleChange}
          required
          placeholder={placeholder}
          className="input-field pr-11"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {show ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
        </button>
      </div>
    </div>
  )

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
              Join thousands of<br />smart commuters
            </h2>
            <p className="text-red-200 text-lg leading-relaxed mb-8">
              Create your free account and start exploring routes, saccos, and fares across Kenya.
            </p>
            <div className="space-y-3">
              {["Access real-time route information", "Track matatus across all saccos", "Plan your journey with accurate fares"].map(item => (
                <div key={item} className="flex items-center gap-3 text-white/80">
                  <div className="w-5 h-5 rounded-full bg-red-500/30 border border-red-400/50 flex items-center justify-center shrink-0">
                    <span className="text-red-300 text-xs">✓</span>
                  </div>
                  <span className="text-sm">{item}</span>
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
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center">
              <img src="/images/fav.png" alt="" className="w-5 h-5 object-contain" />
            </div>
            <span className="font-bold text-gray-900">Matatu<span className="text-red-900">Link</span></span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create your account</h1>
            <p className="text-gray-500 mt-2">Get started for free — no credit card required</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
              <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 font-bold">!</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="input-field"
              />
            </div>

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

            <PasswordInput
              name="password"
              value={formData.password}
              show={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
              placeholder="Min. 8 characters"
              label="Password"
            />

            <PasswordInput
              name="confirmPassword"
              value={formData.confirmPassword}
              show={showConfirmPassword}
              onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
              placeholder="Repeat your password"
              label="Confirm Password"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 btn-primary rounded-xl font-semibold text-base disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : "Create account"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-red-900 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup

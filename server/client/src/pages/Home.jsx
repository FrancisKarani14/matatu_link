// src/pages/Home.jsx
import React from "react"
import { Link } from "react-router-dom"

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-700 mb-6 leading-tight">
            Matatu Link
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Your one-stop platform to discover Matatu Saccos, routes, fares, and
            matatus near you. Travel smarter, faster, and with confidence.
          </p>
          <Link
            to="/saccos"
            className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            What We Offer
          </h2>
          <p className="text-gray-600 mt-3">
            Everything you need to navigate the Matatu ecosystem at your
            fingertips.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow hover:shadow-xl transition">
            <div className="text-5xl mb-4">🚐</div>
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Matatus</h3>
            <p className="text-gray-600">
              Find Matatus across different routes and compare availability.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-green-100 p-8 rounded-2xl shadow hover:shadow-xl transition">
            <div className="text-5xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Saccos</h3>
            <p className="text-gray-600">
              Explore Matatu Saccos near you and learn about their services.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-100 p-8 rounded-2xl shadow hover:shadow-xl transition">
            <div className="text-5xl mb-4">🛣️</div>
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              Routes & Fares
            </h3>
            <p className="text-gray-600">
              Check routes, fares, and plan your journey with ease.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 bg-blue-600 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to start your journey?
        </h2>
        <p className="mb-6 text-lg">
          Discover Matatus, Saccos, and routes around you today.
        </p>
        <Link
          to="/routes"
          className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition"
        >
          Explore Routes
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6 text-center">
        <p>© {new Date().getFullYear()} Matatu Link. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Home

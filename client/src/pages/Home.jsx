// src/pages/Home.jsx
import React from "react"
import { Link } from "react-router-dom"

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center py-16 px-6 text-center min-h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: "url('/images/heroML.png')" }}
        />
        <div className="absolute inset-0 bg-red-900/40" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
            Matatu Link
          </h1>
          <p className="text-xl md:text-2xl text-white font-semibold mb-8 drop-shadow-md">
            Your one-stop platform to discover Matatu Saccos, routes, fares, and
            matatus near you. Travel smarter, faster, and with confidence.
          </p>
          <Link
            to="/login"
            className="px-8 py-4 bg-red-900 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-red-950 transition"
          >
            Get started
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

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto" style={{ minHeight: '70vh' }}>
          <Link to="/matatus" className="relative rounded-2xl shadow hover:shadow-xl transition overflow-hidden group">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
              style={{ backgroundImage: "url('/images/matatu.png')" }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-3xl font-bold text-white mb-4">Matatus</h3>
              <p className="text-white text-xl font-bold">
                Find Matatus across different routes and compare availability.
              </p>
            </div>
          </Link>

          <Link to="/saccos" className="relative rounded-2xl shadow hover:shadow-xl transition overflow-hidden group">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
              style={{ backgroundImage: "url('/images/saccos.png')" }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-3xl font-bold text-white mb-4">Saccos</h3>
              <p className="text-white text-xl font-bold">
                Explore Matatu Saccos near you and learn about their services.
              </p>
            </div>
          </Link>

          <Link to="/routes" className="relative rounded-2xl shadow hover:shadow-xl transition overflow-hidden group">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
              style={{ backgroundImage: "url('/images/Routes.png')" }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-3xl font-bold text-white mb-4">Routes & Fares</h3>
              <p className="text-white text-xl font-bold">
                Check routes, fares, and plan your journey with ease.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 bg-red-900 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to start your journey?
        </h2>
        <p className="mb-6 text-lg">
          Discover Matatus, Saccos, and routes around you today.
        </p>
        <Link
          to="/routes"
          className="px-8 py-4 bg-white text-red-900 text-lg font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition"
        >
          Explore Routes
        </Link>
      </section>

      {/* About Us Section */}
      <section className="min-h-screen flex items-center px-6 py-16 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center w-full">
          <div className="max-h-[600px]">
            <img 
              src="/images/matatu.png" 
              alt="Matatus" 
              className="w-full h-full object-cover rounded-2xl shadow-xl"
            />
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-red-900 mb-6">
              About Us
            </h2>
            <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-4">
              Matatu Link is your trusted platform for navigating Kenya's vibrant matatu transport system. 
              We connect commuters with reliable information about saccos, routes, and fares.
            </p>
            <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-4">
              Our mission is to make public transportation more accessible, transparent, and efficient for everyone. 
              Whether you're a daily commuter or a first-time traveler, we've got you covered.
            </p>
            <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
              Join thousands of users who trust Matatu Link to plan their journeys and discover the best routes across the city.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-red-900/20 text-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <Link to="/" className="hover:text-red-900 font-semibold transition">
              Home
            </Link>
            <Link to="/saccos" className="hover:text-red-900 font-semibold transition">
              Saccos
            </Link>
            <Link to="/matatus" className="hover:text-red-900 font-semibold transition">
              Matatus
            </Link>
            <Link to="/routes" className="hover:text-red-900 font-semibold transition">
              Routes
            </Link>
            <Link to="/login" className="hover:text-red-900 font-semibold transition">
              Login
            </Link>
            <Link to="/signup" className="hover:text-red-900 font-semibold transition">
              Sign Up
            </Link>
          </div>
          <p className="text-center text-gray-600">© {new Date().getFullYear()} Matatu Link. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home

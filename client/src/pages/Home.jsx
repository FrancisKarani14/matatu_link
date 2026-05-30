import React from "react"
import { Link } from "react-router-dom"
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaArrowRight } from "react-icons/fa"

const StatCard = ({ value, label }) => (
  <div className="text-center">
    <p className="text-3xl font-bold text-white">{value}</p>
    <p className="text-red-200 text-sm mt-1">{label}</p>
  </div>
)

const FeatureCard = ({ to, image, title, description, delay }) => (
  <Link
    to={to}
    className={`group relative overflow-hidden rounded-2xl animate-fade-up-delay-${delay} block`}
    style={{ minHeight: "320px" }}
  >
    <div
      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
      style={{ backgroundImage: `url('${image}')` }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
    <div className="absolute inset-0 bg-red-900/0 group-hover:bg-red-900/20 transition-colors duration-300" />
    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-300 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {description}
      </p>
      <div className="flex items-center gap-2 mt-3 text-red-300 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Explore <FaArrowRight className="text-xs" />
      </div>
    </div>
  </Link>
)

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f7f5]">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: "url('/images/heroML.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-red-950/50 to-black/60" />

        {/* Decorative circles */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-red-900/10 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-red-700/10 blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-white/80 text-sm font-medium mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Kenya's #1 Matatu Tracking Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight animate-fade-up">
            Navigate Kenya
            <br />
            <span className="text-gradient bg-gradient-to-r from-red-300 to-red-500" style={{WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'}}>
              Smarter
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up-delay-1">
            Discover Matatu Saccos, routes, fares, and vehicles near you.
            Travel with confidence — every route, every fare, at your fingertips.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up-delay-2">
            <Link
              to="/routes"
              className="px-8 py-4 bg-red-900 hover:bg-red-800 text-white font-semibold rounded-xl shadow-lg shadow-red-900/30 hover:shadow-red-900/50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Explore Routes <FaArrowRight className="text-sm" />
            </Link>
            <Link
              to="/saccos"
              className="px-8 py-4 glass text-white font-semibold rounded-xl hover:bg-white/15 transition-all duration-200"
            >
              Browse Saccos
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-up-delay-2">
            <StatCard value="50+" label="Saccos" />
            <StatCard value="200+" label="Routes" />
            <StatCard value="1000+" label="Matatus" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-[#f8f7f5]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-red-900 text-sm font-semibold tracking-widest uppercase">What We Offer</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 tracking-tight">
              Everything in one place
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              From saccos to routes to individual matatus — all the information you need to travel smarter.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              to="/matatus"
              image="/images/matatu.png"
              title="Matatus"
              description="Find matatus across different routes and compare availability in real time."
              delay="1"
            />
            <FeatureCard
              to="/saccos"
              image="/images/saccos.png"
              title="Saccos"
              description="Explore matatu saccos near you and learn about their services and coverage."
              delay="2"
            />
            <FeatureCard
              to="/routes"
              image="/images/Routes.png"
              title="Routes & Fares"
              description="Check routes, fares, and plan your journey with ease and confidence."
              delay="2"
            />
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6 bg-gradient-to-r from-red-950 via-red-900 to-red-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize: '60px 60px'}} />
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Ready to start your journey?
          </h2>
          <p className="text-red-200 text-lg mb-8 max-w-xl mx-auto">
            Discover matatus, saccos, and routes around you today.
          </p>
          <Link
            to="/routes"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-red-900 font-bold rounded-xl hover:bg-red-50 transition-colors shadow-xl"
          >
            Explore Routes <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* About */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-red-100 to-red-50 rounded-3xl -z-10" />
            <img
              src="/images/matatu.png"
              alt="Matatus"
              className="w-full h-[480px] object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-red-900 text-white p-6 rounded-2xl shadow-xl">
              <p className="text-3xl font-bold">10+</p>
              <p className="text-red-200 text-sm">Years of service</p>
            </div>
          </div>
          <div>
            <span className="text-red-900 text-sm font-semibold tracking-widest uppercase">About Us</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight tracking-tight">
              Connecting Kenya,<br />one route at a time
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-5">
              Matatu Link is your trusted platform for navigating Kenya's vibrant matatu transport system.
              We connect commuters with reliable information about saccos, routes, and fares.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Our mission is to make public transportation more accessible, transparent, and efficient for everyone.
              Whether you're a daily commuter or a first-time traveler, we've got you covered.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 btn-primary rounded-xl font-semibold"
            >
              Join thousands of users <FaArrowRight className="text-sm" />
            </Link>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="relative py-24 px-6 overflow-hidden bg-gray-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/pt.png')" }}
        />
        <div className="relative z-10 max-w-7xl mx-auto text-center mb-14">
          <span className="text-red-400 text-sm font-semibold tracking-widest uppercase">Partners</span>
          <h2 className="text-4xl font-bold text-white mt-3">Companies We Work With</h2>
          <p className="text-gray-400 mt-3">Trusted by leading transport companies across Kenya</p>
        </div>

        <div className="relative z-10 w-full space-y-6 overflow-hidden">
          <div className="flex animate-scroll gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-8 shrink-0">
                {["City Hoppa", "Citi Shuttle", "KBS", "Double M", "Embassava", "Super Metro"].map(name => (
                  <div key={name} className="flex items-center justify-center w-44 h-20 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <p className="text-lg font-bold text-white">{name}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="flex animate-scroll-reverse gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-8 shrink-0">
                {["Super Metro", "Embassava", "Double M", "KBS", "Citi Shuttle", "City Hoppa"].map(name => (
                  <div key={name} className="flex items-center justify-center w-44 h-20 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <p className="text-lg font-bold text-white">{name}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center">
                  <img src="/images/fav.png" alt="" className="w-5 h-5 object-contain" />
                </div>
                <span className="text-white font-bold text-lg">Matatu<span className="text-red-500">Link</span></span>
              </div>
              <p className="text-sm leading-relaxed text-gray-500">
                Your trusted platform for navigating Kenya's matatu transport system.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                {["/", "/saccos", "/matatus", "/routes", "/login", "/signup"].map((path, i) => (
                  <li key={path}>
                    <Link to={path} className="hover:text-red-400 transition-colors">
                      {["Home", "Saccos", "Matatus", "Routes", "Login", "Sign Up"][i]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <FaEnvelope className="text-red-500 shrink-0" />
                  <a href="mailto:info@matatulink.com" className="hover:text-red-400 transition-colors">info@matatulink.com</a>
                </li>
                <li className="flex items-center gap-2">
                  <FaPhone className="text-red-500 shrink-0" />
                  <span>+254 700 123 456</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-500 shrink-0" />
                  <span>Nairobi, Kenya</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-900/30 hover:border-red-900/50 hover:text-red-400 transition-all"
                  >
                    <Icon className="text-sm" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">© {new Date().getFullYear()} Matatu Link. All rights reserved.</p>
            <p className="text-sm text-gray-600">Built with ❤️ in Nairobi, Kenya</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home

"use client"
import { Github, Twitter, Linkedin, Mail, MapPin, Phone } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-white text-2xl font-bold mb-2">PharmaDataRegistry</h2>
              <div className="h-1 w-20 bg-indigo-500 rounded"></div>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Revolutionizing pharmaceutical supply chains through advanced blockchain technology. 
              Ensuring transparency, security, and compliance at every step.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <div>
              <h3 className="text-white text-xl font-semibold mb-2">Quick Links</h3>
              <div className="h-1 w-12 bg-indigo-500 rounded"></div>
            </div>
            <nav>
              <ul className="space-y-4">
                {[
                  'Home',
                  'Dashboard',
                  'EDUchain',
                  'Solutions',
                  'Documentation',
                  'Support'
                ].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-all duration-300 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-indigo-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-white text-xl font-semibold mb-2">Contact Us</h3>
              <div className="h-1 w-12 bg-indigo-500 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-indigo-500 mt-1" />
                <span className="text-gray-400">123 Innovation Drive<br />Tech Valley, CA 94043</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-indigo-500" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-indigo-500" />
                <span className="text-gray-400">contact@pharmadatareg.com</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <div>
              <h3 className="text-white text-xl font-semibold mb-2">Stay Updated</h3>
              <div className="h-1 w-12 bg-indigo-500 rounded"></div>
            </div>
            <p className="text-gray-400">Subscribe to our newsletter for the latest updates and insights.</p>
            <div className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-4">
              {[
                { icon: Twitter, label: 'Twitter' },
                { icon: Github, label: 'GitHub' },
                { icon: Linkedin, label: 'LinkedIn' }
              ].map((item) => (
                <a
                  key={item.label}
                  href="#"
                  aria-label={item.label}
                  className="p-2 rounded-full bg-gray-700 hover:bg-indigo-500 transition-all duration-300 transform hover:scale-110"
                >
                  <item.icon className="h-5 w-5 text-gray-300" />
                </a>
              ))}
            </div>
            <div className="text-gray-400 text-sm">
              &copy; {currentYear} PharmaDataRegistry. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
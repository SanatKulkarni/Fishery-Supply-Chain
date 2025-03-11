"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/Homepage/ui/button"
import { Menu, X, ChevronDown } from "lucide-react"
import ConnectMetaMask, { ConnectMetaMass } from "@/Homepage/Walletconnect"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed w-full z-10 transition-all duration-300 ${isScrolled ? "bg-white shadow-md" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span
                className={`text-xl font-bold transition-colors duration-300 ${isScrolled ? "text-blue-600" : "text-white"}`}
              >
                PharmaDataRegistry
              </span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link
              href="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isScrolled ? "text-gray-700 hover:text-gray-900" : "text-white hover:text-gray-200"}`}
            >
              Dashboard
            </Link>
            <div className="relative group">
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isScrolled ? "text-gray-700 hover:text-gray-900" : "text-white hover:text-gray-200"}`}
              >
                EDUchain <ChevronDown className="inline-block w-4 h-4 ml-1" />
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <Link href="/educhain/courses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Courses
                </Link>
                <Link
                  href="/educhain/certifications"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Certifications
                </Link>
              </div>
            </div>
            <ConnectMetaMask />
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md transition-colors duration-300 ${isScrolled ? "text-gray-400 hover:text-gray-500" : "text-white hover:text-gray-200"}`}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden bg-white">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Dashboard
            </Link>
            <Link
              href="/educhain"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              EDUchain
            </Link>
            <div className="px-3 py-2">
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}


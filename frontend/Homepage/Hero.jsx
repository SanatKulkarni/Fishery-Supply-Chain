"use client"

import { useState, useEffect } from "react"
import { Button } from "@/Homepage/ui/button"
import { motion } from "framer-motion"

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="relative bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 40 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl leading-tight">
            <span className="block">Revolutionizing</span>
            <motion.span
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="block text-transparent bg-clip-text bg-white"
            >
              Pharmaceutical Data Management
            </motion.span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-blue-100 sm:text-xl md:mt-6 md:text-2xl">
            Empowering the pharmaceutical supply chain with secure blockchain technology for unparalleled transparency.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Button className="px-8 py-3 text-white bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 shadow-xl rounded-full transition-transform transform hover:scale-105">
              Get Started
            </Button>
            <Button
              variant="outline"
              className="px-8 py-3 text-blue-600 border border-white hover:text-blue-600 shadow-lg rounded-full transition-transform transform hover:scale-105"
            >
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg
          className="absolute bottom-0 left-0 right-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,192L48,176C96,160,192,128,288,112C384,96,480,96,576,122.7C672,149,768,203,864,224C960,245,1056,235,1152,213.3C1248,192,1344,160,1392,144L1440,128V320H0Z"
          ></path>
        </svg>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Star } from "lucide-react"

const stats = [
  { id: 1, name: "Transactions", value: 0, target: 10000 },
  { id: 2, name: "Users", value: 0, target: 1000 },
  { id: 3, name: "Products Tracked", value: 0, target: 5000 },
  { id: 4, name: "Countries", value: 0, target: 30 },
]

export default function Stats() {
  const [counters, setCounters] = useState(stats.map((stat) => ({ ...stat, value: 0 })))

  useEffect(() => {
    const interval = setInterval(() => {
      setCounters((prevCounters) =>
        prevCounters.map((counter) => ({
          ...counter,
          value: Math.min(counter.value + Math.ceil(counter.target / 100), counter.target),
        }))
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-blue-600 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
            Empowering the Pharmaceutical Industry
          </h2>
          <p className="mt-4 text-xl text-indigo-200">
            Discover the impact we've made globally
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {counters.map((stat) => (
            <motion.div
              key={stat.id}
              className="bg-white bg-opacity-20 backdrop-blur-md p-6 rounded-2xl shadow-xl text-center border border-white border-opacity-30 hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: stat.id * 0.1 }}
            >
              <div className="flex justify-center items-center mb-4">
                <Star className="w-10 h-10 text-yellow-400 animate-pulse" />
              </div>
              <motion.dd
                className="text-4xl font-bold text-white"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: stat.id * 0.1 }}
              >
                {stat.value.toLocaleString()}+
              </motion.dd>
              <motion.dt
                className="mt-2 text-lg font-medium text-indigo-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: stat.id * 0.15 }}
              >
                {stat.name}
              </motion.dt>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
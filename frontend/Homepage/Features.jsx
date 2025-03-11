"use client"

import { Shield, Users, Truck, FileText } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    name: "Role-Based Access Control",
    description: "Secure access management for manufacturers, distributors, and retailers.",
    icon: Users,
  },
  {
    name: "Medicine Lifecycle Tracking",
    description: "Track medicines from manufacturing to distribution and retail.",
    icon: Truck,
  },
  {
    name: "Transparent Transactions",
    description: "All transactions are recorded on the blockchain for full transparency.",
    icon: FileText,
  },
  {
    name: "Data Security",
    description: "Blockchain technology ensures data integrity and security.",
    icon: Shield,
  },
]

export default function Features() {
  return (
    <div className="py-24 bg-white relative">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="lg:text-center mb-16">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            A better way to manage pharmaceutical data
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            PharmaDataRegistry provides a comprehensive solution for managing the entire lifecycle of pharmaceutical products.
          </p>
        </div>
      </div>

      {/* Features Section with Vertical Line */}
      <div className="relative mt-10">
        <div className="absolute inset-0 flex justify-center pointer-events-none">
          <div className="w-1 bg-blue-500 h-full"></div> {/* Vertical Line confined to features */}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <dl className="space-y-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`relative flex items-center ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
              >
                <div className="w-1/2 p-6 bg-gray-100 rounded-lg shadow-md relative">
                  <div className="absolute -right-4 top-6 bg-blue-500 text-white p-2 rounded-full shadow-md">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{feature.name}</h3>
                  <p className="mt-2 text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

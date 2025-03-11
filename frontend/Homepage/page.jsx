"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import Navbar from "@/Homepage/Navbar"
import Hero from "@/Homepage/Hero"
import Features from "@/Homepage/Features"
import Stats from "@/Homepage/Stats"
import Footer from "@/Homepage/Footer"
import Web3 from 'web3'

export default function Page() {
  const [isLoaded, setIsLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsLoaded(true)
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          router.push('/app')
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error)
    }
  }

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask!')
        return
      }
      
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      router.push('/app')
    } catch (error) {
      console.error('Error connecting wallet:', error)
    }
  }

  return (
    <div
      className={`min-h-screen flex flex-col transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}
    >
      <Navbar onConnectWallet={connectWallet} />
      <main className="flex-grow">
        <Hero onConnectWallet={connectWallet} />
        <Features />
        <Stats />
      </main>
      <Footer />
    </div>
  )
}


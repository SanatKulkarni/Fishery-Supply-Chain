'use client';
import { useState, useEffect } from 'react';
import Link from "next/link";
import Web3 from 'web3';
import contractDetails from '../../contractDetails.json';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Home() {
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkWalletConnection();
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', checkWalletConnection);
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', checkWalletConnection);
      }
    };
  }, []);

  const checkWalletConnection = async () => {
    setError(null);
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setIsConnected(true);
          checkOwner();
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error checking wallet connection:', err);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const connectWallet = async () => {
    setConnectingWallet(true);
    setError(null);
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask or another Ethereum wallet');
      }
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      setIsConnected(true);
      checkOwner();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError(error.message || 'Failed to connect wallet');
    } finally {
      setConnectingWallet(false);
    }
  };

  const checkOwner = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask');
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(
        contractDetails.abi,
        contractDetails.contractAddress
      );

      const contractOwner = await contract.methods.owner().call();
      setIsOwner(account.toLowerCase() === contractOwner.toLowerCase());
    } catch (error) {
      console.error('Error checking owner:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-teal-700 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          
          {/* Subtle wave pattern */}
          <svg className="absolute bottom-0 left-0 w-full opacity-10" viewBox="0 0 1440 320">
            <path fill="#ffffff" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Fishery Supply Chain
                <span className="block text-teal-300 mt-2">Blockchain Solution</span>
              </h1>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl leading-relaxed">
                Track and manage your fish products from catch to consumer with our secure, 
                transparent blockchain technology.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="relative"
            >
              <button
                onClick={connectWallet}
                disabled={connectingWallet}
                className={`
                  bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600
                  text-white font-bold py-5 px-10 rounded-full text-lg md:text-xl
                  transition-all duration-300 transform hover:scale-105 hover:shadow-xl
                  flex items-center gap-3 relative overflow-hidden group
                  ${connectingWallet ? 'opacity-80 cursor-wait' : ''}
                `}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-teal-400 to-blue-500 opacity-0 group-hover:opacity-90 transition-opacity"></span>
                <span className="relative flex items-center gap-3">
                  {connectingWallet ? (
                    <>
                      <svg className="animate-spin w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Connect Wallet
                    </>
                  )}
                </span>
              </button>
              
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute mt-2 text-red-300 text-sm bg-red-900/50 px-4 py-2 rounded-lg backdrop-blur-sm"
                >
                  {error}
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Features Section */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="grid md:grid-cols-3 gap-8 mt-24"
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + index * 0.2 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="p-8 relative">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-teal-400/20 to-blue-500/20 rounded-bl-3xl -mr-10 -mt-10 group-hover:scale-150 transition-all duration-500"></div>
                  <div className="text-teal-300 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 group-hover:text-white transition-colors duration-300">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
        </div>
      </div>
    );
  }

  // Dashboard view when connected
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 text-center">
              Supply Chain <span className="text-blue-600">Dashboard</span>
            </h1>
            <p className="text-gray-600 text-center max-w-2xl">
              Welcome to your fishery supply chain management center. Select an option below to proceed.
            </p>
          </motion.div>
          
          <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mt-4">
            Wallet Connected
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {dashboardCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative"
            >
              <Link href={card.link} className="block">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex items-start mb-4">
                      <div className={`p-3 rounded-lg ${card.iconBg}`}>
                        <div className="text-white">
                          {card.icon}
                        </div>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">{card.title}</h2>
                    <p className="text-gray-600 mb-4">{card.description}</p>
                    <div className="mt-auto pt-4">
                      <span className="inline-flex items-center text-blue-600 font-medium">
                        Get Started
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          
          {!loading && isOwner && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + dashboardCards.length * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Link href="/ownerRoleChange" className="block">
                <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex items-start mb-4">
                      <div className="p-3 rounded-lg bg-white/20">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                        </svg>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Change Participant Role</h2>
                    <p className="text-white/90 mb-4">Owner only: Manage participant roles and permissions in the network.</p>
                    <div className="mt-auto pt-4">
                      <span className="inline-flex items-center text-white font-medium">
                        Admin Panel
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Features data
const features = [
  {
    title: "Transparent Tracking",
    description: "Track your fish products throughout the entire supply chain with complete transparency and real-time updates.",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
      </svg>
    )
  },
  {
    title: "Secure Transactions",
    description: "All transactions are secured by blockchain technology ensuring data integrity and immutability.",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
      </svg>
    )
  },
  {
    title: "Easy Management",
    description: "Simplified interface for managing fish products and supply chain operations with minimal technical knowledge required.",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
      </svg>
    )
  }
];

// How it works steps
const steps = [
  {
    title: "Connect Wallet",
    description: "Link your crypto wallet to access the dashboard"
  },
  {
    title: "Register",
    description: "Join as a verified participant in the network"
  },
  {
    title: "Track Products",
    description: "Add and monitor fish through the supply chain"
  },
  {
    title: "Transfer & Process",
    description: "Manage transactions between supply chain participants"
  }
];

// Dashboard cards
const dashboardCards = [
  {
    title: "Register as Participant",
    description: "Join the supply chain network as a verified participant with your specific role.",
    link: "/participant",
    iconBg: "bg-blue-500",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
      </svg>
    )
  },
  {
    title: "Add New Fish",
    description: "Register new fish products in the blockchain supply chain with detailed information.",
    link: "/addFish",
    iconBg: "bg-green-500",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
      </svg>
    )
  },
  {
    title: "Transfer Fish",
    description: "Transfer fish products between participants with secure blockchain transactions.",
    link: "/transferFish",
    iconBg: "bg-purple-500",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
      </svg>
    )
  },
  {
    title: "Process Fish",
    description: "Update processing status and information of fish products throughout the supply chain.",
    link: "/processFish",
    iconBg: "bg-yellow-500",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
      </svg>
    )
  }
];
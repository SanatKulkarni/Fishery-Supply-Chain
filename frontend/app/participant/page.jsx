'use client';
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import contractDetails from '../../../contractDetails.json';

export default function ParticipantsPage() {
    const [selectedRole, setSelectedRole] = useState(null);
    const [currentRole, setCurrentRole] = useState(null);
    const roles = [
        { 
            value: '0', 
            label: 'Fisherman', 
            icon: '🎣', 
            color: 'blue',
            description: 'The starting point of the supply chain. Fishermen catch fish from oceans, rivers, or farms and report initial details such as catch location, date, species, and quantity. They are responsible for the first tracking and documentation of the seafood product.'
        },
        { 
            value: '1', 
            label: 'Processor', 
            icon: '🏭', 
            color: 'green',
            description: 'Once fish is caught, processors clean, fillet, package, and prepare the fish for distribution. They add value by transforming raw materials into market-ready products. Processors document processing dates, methods used, quality checks, and packaging details.'
        },
        { 
            value: '2', 
            label: 'Distributor', 
            icon: '🚚', 
            color: 'orange',
            description: 'Distributors transport fish products from processors to retailers. They manage logistics, ensure proper storage conditions during transit, and maintain the cold chain. They record transportation details, storage temperatures, and chain of custody information.'
        },
        { 
            value: '3', 
            label: 'Retailer', 
            icon: '🏪', 
            color: 'purple',
            description: 'Retailers sell fish products directly to consumers through supermarkets, fish markets, or restaurants. They maintain proper storage conditions, display product information, and often provide the final verification of the supply chain before the product reaches consumers.'
        },
        { 
            value: '4', 
            label: 'Consumer', 
            icon: '🛒', 
            color: 'pink',
            description: 'The end-users who purchase and consume the fish products. Consumers can verify the complete history of their purchased fish, from the catching location to every step in the supply chain, ensuring they receive authentic, sustainable, and responsibly sourced seafood.'
        }
    ];

    const getCurrentRole = async () => {
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

            const roleNumber = await contract.methods.participants(account).call();
            if (roleNumber !== '0' && roleNumber !== 0) {
                const role = roles.find(r => r.value === roleNumber.toString());
                setCurrentRole(role?.label || 'Unknown Role');
            } else {
                setCurrentRole('Not Registered');
            }
        } catch (error) {
            console.error('Error getting role:', error);
            setCurrentRole('Error getting role');
        }
    };

    useEffect(() => {
        getCurrentRole();
    }, []);

    const getRoleColor = (roleName) => {
        const role = roles.find(r => r.label === roleName);
        return role ? role.color : 'gray';
    };
    
    const getColorClasses = (color) => {
        const colorMap = {
            blue: 'bg-blue-100 text-blue-800 border-blue-200 ring-blue-500',
            green: 'bg-green-100 text-green-800 border-green-200 ring-green-500',
            orange: 'bg-orange-100 text-orange-800 border-orange-200 ring-orange-500',
            purple: 'bg-purple-100 text-purple-800 border-purple-200 ring-purple-500',
            pink: 'bg-pink-100 text-pink-800 border-pink-200 ring-pink-500',
            gray: 'bg-gray-100 text-gray-800 border-gray-200 ring-gray-400'
        };
        return colorMap[color] || colorMap.gray;
    };    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
            {/* Back Button */}
            <a 
                href="/"
                className="fixed top-6 left-6 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 z-50 group"
                title="Back to Home"
            >
                <svg 
                    className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                </svg>
            </a>

            <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                {/* Header Section */}
                <div className="relative bg-gradient-to-r from-indigo-600 to-blue-500 p-8 overflow-hidden">
                    <div className="absolute inset-0 bg-grid-white/10"></div>
                    <div className="relative flex items-center z-10">
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 mr-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-1">Supply Chain Participant Roles</h2>
                            <p className="text-blue-100">Select your role in the supply chain network</p>
                        </div>
                    </div>
                    <div className="absolute right-0 bottom-0 transform translate-x-1/4 translate-y-1/4">
                        <div className="w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    </div>
                </div>

                <div className="p-8">
                    {/* Current Status Card */}
                    {currentRole && (
                        <div className={`rounded-2xl p-8 mb-12 border shadow-lg transform transition-all duration-300 hover:scale-[1.02] ${
                            currentRole === 'Not Registered' 
                                ? 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200' 
                                : `${getColorClasses(getRoleColor(currentRole))}`
                        }`}>
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Current Status
                            </h3>
                            <div className="flex items-center">
                                {currentRole !== 'Not Registered' ? (
                                    <>
                                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mr-6 bg-white shadow-inner">
                                            {roles.find(r => r.label === currentRole)?.icon || '👤'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium opacity-75">You are registered as</p>
                                            <p className="text-3xl font-bold mt-1">{currentRole}</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl bg-gray-100 mr-6 shadow-inner">
                                            👤
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium opacity-75">Your status</p>
                                            <p className="text-3xl font-bold mt-1">Not Registered</p>
                                            <p className="text-sm opacity-75 mt-2">Click on any role below to learn more</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Roles Grid */}
                    <div className="mb-12">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Available Roles</h3>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {roles.map((role) => (
                                <div 
                                    key={role.value}
                                    onClick={() => setSelectedRole(role.value === selectedRole ? null : role.value)}
                                    className={`relative cursor-pointer rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                                        selectedRole === role.value 
                                            ? `border-2 ${getColorClasses(role.color)} ring-2 shadow-lg`
                                            : 'border-gray-100 hover:border-gray-200 bg-white'
                                    }`}
                                >
                                    <div className="flex flex-col items-center">
                                        <span className="text-4xl mb-4 transform transition-transform duration-300 hover:scale-110">{role.icon}</span>
                                        <span className={`font-semibold ${
                                            selectedRole === role.value 
                                                ? getColorClasses(role.color).split(' ').find(cls => cls.startsWith('text-'))
                                                : 'text-gray-700'
                                        }`}>
                                            {role.label}
                                        </span>
                                    </div>
                                    {selectedRole === role.value && (
                                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Selected Role Details */}
                    {selectedRole !== null && (
                        <div className={`mt-8 p-8 rounded-2xl border-2 shadow-lg transform transition-all duration-300 ${getColorClasses(roles.find(r => r.value === selectedRole)?.color || 'gray')}`}>
                            <div className="flex items-center mb-6">
                                <span className="text-5xl mr-6">{roles.find(r => r.value === selectedRole)?.icon}</span>
                                <div>
                                    <h3 className="text-2xl font-bold mb-1">{roles.find(r => r.value === selectedRole)?.label} Role</h3>
                                    <p className="text-sm opacity-75">Detailed role information</p>
                                </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed text-lg">
                                {roles.find(r => r.value === selectedRole)?.description}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
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
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
            <div className="flex items-center mb-8">
                <div className="bg-indigo-600 rounded-full p-3 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Supply Chain Participant Roles</h2>
            </div>
            
            {currentRole && (
                <div className={`rounded-xl p-6 mb-8 border ${
                    currentRole === 'Not Registered' 
                        ? 'bg-gray-50 border-gray-200' 
                        : `${getColorClasses(getRoleColor(currentRole))}`
                }`}>
                    <h3 className="text-lg font-semibold mb-2">Current Status</h3>
                    <div className="flex items-center">
                        {currentRole !== 'Not Registered' ? (
                            <>
                                <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mr-4 bg-opacity-50">
                                    {roles.find(r => r.label === currentRole)?.icon || '👤'}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">You are registered as</p>
                                    <p className="text-2xl font-bold">{currentRole}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl bg-gray-200 mr-4">
                                    👤
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Your status</p>
                                    <p className="text-2xl font-bold">Not Registered</p>
                                    <p className="text-sm text-gray-500 mt-1">Click on any role below to learn more</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
            
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Supply Chain Roles</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {roles.map((role) => (
                        <div 
                            key={role.value}
                            onClick={() => setSelectedRole(role.value === selectedRole ? null : role.value)}
                            className={`relative cursor-pointer rounded-xl p-4 border transition-all duration-200 ${
                                selectedRole === role.value 
                                    ? `border-2 ${getColorClasses(role.color)} ring-2`
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                        >
                            <div className="flex flex-col items-center">
                                <span className="text-3xl mb-2">{role.icon}</span>
                                <span className={`font-medium ${
                                    selectedRole === role.value 
                                        ? getColorClasses(role.color).split(' ').find(cls => cls.startsWith('text-'))
                                        : 'text-gray-700'
                                }`}>
                                    {role.label}
                                </span>
                            </div>
                            {selectedRole === role.value && (
                                <div className="absolute -top-2 -right-2 bg-indigo-600 rounded-full w-6 h-6 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {selectedRole !== null && (
                <div className={`mt-6 p-6 rounded-xl border-2 ${getColorClasses(roles.find(r => r.value === selectedRole)?.color || 'gray')}`}>
                    <div className="flex items-center mb-4">
                        <span className="text-4xl mr-4">{roles.find(r => r.value === selectedRole)?.icon}</span>
                        <h3 className="text-2xl font-bold">{roles.find(r => r.value === selectedRole)?.label} Role</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                        {roles.find(r => r.value === selectedRole)?.description}
                    </p>
                </div>
            )}
        </div>
    );
}
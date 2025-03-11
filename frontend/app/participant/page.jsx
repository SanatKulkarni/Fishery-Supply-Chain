'use client';
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import contractDetails from '../../../contractDetails.json';

export default function ParticipantsPage() {
    const [selectedRole, setSelectedRole] = useState('0');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentRole, setCurrentRole] = useState(null);

    const roles = [
        { value: '0', label: 'Fisherman', icon: '🎣', color: 'blue' },
        { value: '1', label: 'Processor', icon: '🏭', color: 'green' },
        { value: '2', label: 'Distributor', icon: '🚚', color: 'orange' },
        { value: '3', label: 'Retailer', icon: '🏪', color: 'purple' },
        { value: '4', label: 'Consumer', icon: '🛒', color: 'pink' }
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
                setSelectedRole(roleNumber.toString());
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

    const registerParticipant = async () => {
        try {
            setLoading(true);
            setStatus('Connecting to MetaMask...');

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

            await contract.methods.registerParticipant(selectedRole)
                .send({ from: account });

            setStatus('Successfully registered as ' + roles.find(r => r.value === selectedRole).label);
            getCurrentRole();
        } catch (error) {
            setStatus('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

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
                <h2 className="text-3xl font-bold text-gray-800">Supply Chain Participant Dashboard</h2>
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
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mr-4 ${
                                    `bg-${getRoleColor(currentRole)}-200`
                                }`}>
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
                                    <p className="text-sm text-gray-500 mt-1">Please select a role below to register</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
            
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {currentRole === 'Not Registered' ? 'Choose Your Role' : 'Change Your Role'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {roles.map((role) => (
                        <div 
                            key={role.value}
                            onClick={() => !loading && setSelectedRole(role.value)}
                            className={`relative cursor-pointer rounded-xl p-4 border transition-all duration-200 ${
                                selectedRole === role.value 
                                    ? `border-2 ${getColorClasses(role.color)} ring-2`
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                        >
                            <div className="flex flex-col items-center">
                                <span className="text-3xl mb-2">{role.icon}</span>
                                <span className={`font-medium ${selectedRole === role.value ? `text-${role.color}-700` : 'text-gray-700'}`}>
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

            <div className="flex flex-col space-y-4">
                <button 
                    onClick={registerParticipant}
                    disabled={loading}
                    className={`flex justify-center items-center px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 ${
                        loading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl'
                    }`}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing Transaction...
                        </>
                    ) : currentRole === 'Not Registered' ? (
                        <>Register as {roles.find(r => r.value === selectedRole)?.label}</>
                    ) : (
                        <>Change Role to {roles.find(r => r.value === selectedRole)?.label}</>
                    )}
                </button>

                {status && (
                    <div className={`p-5 rounded-xl shadow-md transition-all duration-300 ${
                        status.includes('Error') 
                            ? 'bg-red-50 text-red-700 border-l-4 border-red-500' 
                            : status.includes('Successfully') 
                                ? 'bg-green-50 text-green-700 border-l-4 border-green-500'
                                : 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                    }`}>
                        <div className="flex">
                            <div className="flex-shrink-0">
                                {status.includes('Error') ? (
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                ) : status.includes('Successfully') ? (
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium">
                                    {status.includes('Error') ? 'Error' : status.includes('Successfully') ? 'Success' : 'Info'}
                                </h3>
                                <div className="mt-1 text-sm">
                                    {status}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
'use client';
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import contractDetails from '../../../contractDetails.json';

export default function OwnerRoleChangePage() {
    const [walletAddress, setWalletAddress] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [isOwner, setIsOwner] = useState(false);

    const roles = [
        { value: '0', label: 'Fisherman' },
        { value: '1', label: 'Processor' },
        { value: '2', label: 'Distributor' },
        { value: '3', label: 'Retailer' },
        { value: '4', label: 'Consumer' }
    ];

    useEffect(() => {
        checkOwner();
    }, []);

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
            setStatus('Error: ' + error.message);
        }
    };

    const changeRole = async () => {
        try {
            if (!isOwner) {
                throw new Error('Only owner can change roles');
            }

            if (!Web3.utils.isAddress(walletAddress)) {
                throw new Error('Invalid wallet address');
            }

            if (!selectedRole) {
                throw new Error('Please select a role');
            }

            setLoading(true);
            setStatus('Processing role change...');

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            const web3 = new Web3(window.ethereum);
            const contract = new web3.eth.Contract(
                contractDetails.abi,
                contractDetails.contractAddress
            );

            await contract.methods.changeParticipantRole(walletAddress, selectedRole)
                .send({ from: account });

            setStatus(`Successfully changed role for ${walletAddress} to ${roles.find(r => r.value === selectedRole).label}`);
            setWalletAddress('');
            setSelectedRole('');
        } catch (error) {
            setStatus('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOwner) {
        return (
            <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-xl mt-10 border-l-4 border-red-500 dark:bg-gray-800 dark:text-white transition-all duration-300">
                <div className="flex items-center mb-6 text-red-600 dark:text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h2 className="text-2xl font-bold">Access Denied</h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">Only the contract owner can access this page. Please connect with the owner wallet to continue.</p>
                <button 
                    onClick={checkOwner}
                    className="mt-2 py-2 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 rounded-md shadow-sm transition duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:outline-none"
                >
                    Retry with Different Wallet
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10 border-l-4 border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-300">
            <div className="flex items-center mb-6 border-b pb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Change Participant Role</h2>
            </div>
            
            <div className="space-y-6">
                <div className="group">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 group-hover:text-blue-500 transition duration-200">
                        Participant Wallet Address:
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            id="address"
                            value={walletAddress}
                            onChange={(e) => setWalletAddress(e.target.value)}
                            placeholder="0x..."
                            disabled={loading}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                </div>

                <div className="group">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 group-hover:text-blue-500 transition duration-200">
                        New Role:
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <select 
                            id="role"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            disabled={loading}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 dark:bg-gray-700 dark:text-white appearance-none"
                        >
                            <option value="">Please select a role</option>
                            {roles.map((role) => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    {!selectedRole && (
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            You must select a role to continue
                        </p>
                    )}
                </div>

                <button 
                    onClick={changeRole}
                    disabled={loading || !walletAddress || !selectedRole}
                    className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white transition duration-200
                    ${loading || !walletAddress || !selectedRole 
                        ? 'bg-blue-300 dark:bg-blue-800 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
                >
                    {loading ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                            </svg>
                            Change Role
                        </span>
                    )}
                </button>
            </div>

            {status && (
                <div className={`mt-6 p-4 rounded-md ${status.includes('Error') 
                    ? 'bg-red-50 text-red-700 border-l-4 border-red-500 dark:bg-red-900/20 dark:text-red-400' 
                    : 'bg-green-50 text-green-700 border-l-4 border-green-500 dark:bg-green-900/20 dark:text-green-400'}`}>
                    <div className="flex">
                        {status.includes('Error') ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                        <span>{status}</span>
                    </div>
                </div>
            )}
            
            <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">Note:</span> Only the contract owner can change participant roles. Changes are irreversible and will be recorded on the blockchain.
                </p>
            </div>
        </div>
    );
}
'use client';
import React, { useState } from 'react';
import Web3 from 'web3';
import contractDetails from '../../../contractDetails.json';

export default function AddFishPage() {
    const [fishData, setFishData] = useState({
        species: '',
        catchLocation: '',
        weight: ''
    });
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFishData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addFish = async () => {
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

            // Convert weight to number
            const weightInKg = parseInt(fishData.weight);
            if (isNaN(weightInKg) || weightInKg <= 0) {
                throw new Error('Weight must be a positive number');
            }

            await contract.methods.addFish(
                fishData.species,
                fishData.catchLocation,
                weightInKg
            ).send({ from: account });

            setStatus('Fish successfully added to the supply chain!');
            // Clear form
            setFishData({
                species: '',
                catchLocation: '',
                weight: ''
            });
        } catch (error) {
            setStatus('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-cyan-600 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
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

            <div className="max-w-2xl w-full mx-auto bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-blue-100 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-300 opacity-20 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-teal-400 to-blue-300 opacity-20 rounded-full -ml-20 -mb-20"></div>
                
                <div className="relative z-10">
                    <div className="text-center mb-10">
                        <div className="flex justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            Add New Catch
                        </h2>
                        <p className="mt-2 text-gray-600">Register sustainable seafood to the blockchain</p>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="form-group">
                            <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-1">
                                Fish Species
                            </label>
                            <div className="relative rounded-lg shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="species"
                                    name="species"
                                    value={fishData.species}
                                    onChange={handleInputChange}
                                    placeholder="Enter fish species (e.g., Salmon, Tuna)"
                                    disabled={loading}
                                    className="w-full pl-10 pr-4 py-3.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="catchLocation" className="block text-sm font-medium text-gray-700 mb-1">
                                Catch Location
                            </label>
                            <div className="relative rounded-lg shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="catchLocation"
                                    name="catchLocation"
                                    value={fishData.catchLocation}
                                    onChange={handleInputChange}
                                    placeholder="Enter catch location (e.g., North Atlantic)"
                                    disabled={loading}
                                    className="w-full pl-10 pr-4 py-3.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                                Weight (kg)
                            </label>
                            <div className="relative rounded-lg shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                    </svg>
                                </div>
                                <input
                                    type="number"
                                    id="weight"
                                    name="weight"
                                    value={fishData.weight}
                                    onChange={handleInputChange}
                                    placeholder="Enter weight in kg"
                                    disabled={loading}
                                    min="1"
                                    className="w-full pl-10 pr-4 py-3.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                                />
                            </div>
                        </div>

                        <button 
                            onClick={addFish}
                            disabled={loading || !fishData.species || !fishData.catchLocation || !fishData.weight}
                            className={`w-full py-4 px-6 rounded-xl font-medium text-lg transition-all duration-300 
                                ${loading || !fishData.species || !fishData.catchLocation || !fishData.weight 
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-cyan-200/50 transform hover:-translate-y-0.5'
                                }`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    Processing Transaction...
                                </div>
                            ) : (
                                <>
                                    <span className="flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Add to Blockchain
                                    </span>
                                </>
                            )}
                        </button>

                        {status && (
                            <div className={`mt-6 p-4 rounded-xl ${
                                status.includes('Error') 
                                    ? 'bg-red-50 text-red-700 border border-red-100' 
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            } flex items-center justify-center`}>
                                <span className="mr-2">
                                    {status.includes('Error') ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </span>
                                <p className="text-center font-medium">{status}</p>
                            </div>
                        )}
                        
                        <div className="mt-8 pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-center text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p>
                                    This transaction will be permanently recorded on the blockchain. Please verify all information before submitting.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
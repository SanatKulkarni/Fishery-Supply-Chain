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
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-teal-100 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border border-blue-50">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold text-blue-600">
                        Add New Fish
                    </h2>
                    <p className="mt-2 text-gray-600">Register a new catch to the blockchain supply chain</p>
                </div>
                
                <div className="space-y-8">
                    <div className="form-group">
                        <label htmlFor="species" className="block text-base font-semibold text-gray-700 mb-2">
                            Fish Species
                        </label>
                        <input
                            type="text"
                            id="species"
                            name="species"
                            value={fishData.species}
                            onChange={handleInputChange}
                            placeholder="Enter fish species (e.g., Salmon, Tuna)"
                            disabled={loading}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all duration-200 outline-none shadow-sm"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="catchLocation" className="block text-base font-semibold text-gray-700 mb-2">
                            Catch Location
                        </label>
                        <input
                            type="text"
                            id="catchLocation"
                            name="catchLocation"
                            value={fishData.catchLocation}
                            onChange={handleInputChange}
                            placeholder="Enter catch location (e.g., North Atlantic)"
                            disabled={loading}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all duration-200 outline-none shadow-sm"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="weight" className="block text-base font-semibold text-gray-700 mb-2">
                            Weight (kg)
                        </label>
                        <input
                            type="number"
                            id="weight"
                            name="weight"
                            value={fishData.weight}
                            onChange={handleInputChange}
                            placeholder="Enter weight in kg"
                            disabled={loading}
                            min="1"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all duration-200 outline-none shadow-sm"
                        />
                    </div>

                    <button 
                        onClick={addFish}
                        disabled={loading || !fishData.species || !fishData.catchLocation || !fishData.weight}
                        className={`w-full py-4 px-6 rounded-lg text-white font-semibold text-lg transition-all duration-300 
                            ${loading || !fishData.species || !fishData.catchLocation || !fishData.weight 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 shadow-lg hover:shadow-xl'
                            }`}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                Processing Transaction...
                            </div>
                        ) : (
                            'Add Fish to Blockchain'
                        )}
                    </button>

                    {status && (
                        <div className={`mt-6 p-4 rounded-lg ${
                            status.includes('Error') 
                                ? 'bg-red-100 text-red-700 border border-red-200' 
                                : 'bg-green-100 text-green-700 border border-green-200'
                        }`}>
                            <p className="text-center font-medium">{status}</p>
                        </div>
                    )}
                    
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 text-center">
                            This transaction will be recorded on the blockchain and cannot be modified later.
                            Please ensure all information is accurate before submitting.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
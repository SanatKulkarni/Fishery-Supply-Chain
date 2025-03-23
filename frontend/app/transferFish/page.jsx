'use client';
import React, { useState } from 'react';
import Web3 from 'web3';
import contractDetails from '../../../contractDetails.json';

export default function TransferFishPage() {
    const [formData, setFormData] = useState({
        fishId: '',
        toAddress: '',
        transactionType: '',
        details: ''
    });
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const transactionTypes = [
        { value: '', label: 'Select transaction type' },
        { value: 'sale', label: 'Sale' },
        { value: 'transfer', label: 'Transfer' },
        { value: 'distribution', label: 'Distribution' },
        { value: 'retail', label: 'Retail' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const transferFish = async () => {
        try {
            if (!Web3.utils.isAddress(formData.toAddress)) {
                throw new Error('Invalid recipient address');
            }

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

            await contract.methods.transferFish(
                formData.fishId,
                formData.toAddress,
                formData.transactionType,
                formData.details
            ).send({ from: account });

            setStatus('Fish successfully transferred!');
            // Clear form
            setFormData({
                fishId: '',
                toAddress: '',
                transactionType: '',
                details: ''
            });
        } catch (error) {
            setStatus('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = formData.fishId && formData.toAddress && formData.transactionType;

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 flex items-center justify-center p-4">
            {/* Back Button remains unchanged */}
            <a 
                href="/"
                className="fixed top-6 left-6 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 z-50 group"
                title="Back to Home"
            >
                <svg 
                    className="w-6 h-6 text-gray-600 group-hover:text-cyan-500 transition-colors" 
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

            <div className="w-full max-w-4xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-cyan-100">
                {/* Header section with updated gradient */}
                <div className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-400 p-8 text-white relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute top-12 left-12 w-32 h-32 bg-blue-300/10 rounded-full blur-2xl"></div>
                    
                    <div className="relative z-10 flex items-center space-x-4">
                        <div className="bg-white/20 p-3 rounded-2xl">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-3.757-4.243z" clipRule="evenodd" />
                                <path d="M7.5 9a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight">Fish Transfer Portal</h1>
                            <p className="mt-2 text-blue-100">Securely transfer ownership on the blockchain</p>
                        </div>
                    </div>
                </div>
                
                <div className="p-8 bg-white rounded-t-3xl -mt-6 relative z-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left column */}
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="fishId" className="block text-sm font-medium text-gray-700 mb-2">Fish ID</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M15.5 2A1.5 1.5 0 0014 3.5v13a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0016.5 2h-1zM9.5 6A1.5 1.5 0 008 7.5v9a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0010.5 6h-1zM3.5 10A1.5 1.5 0 002 11.5v5A1.5 1.5 0 003.5 18h1A1.5 1.5 0 006 16.5v-5A1.5 1.5 0 004.5 10h-1z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="number"
                                        id="fishId"
                                        name="fishId"
                                        value={formData.fishId}
                                        onChange={handleInputChange}
                                        placeholder="Enter ID number"
                                        disabled={loading}
                                        className="pl-12 w-full h-14 bg-gray-50 border-2 border-gray-200 text-gray-900 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="transactionType" className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
                                        </svg>
                                    </div>
                                    <select
                                        id="transactionType"
                                        name="transactionType"
                                        value={formData.transactionType}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className="pl-12 w-full h-14 bg-gray-50 border-2 border-gray-200 text-gray-900 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none transition-all duration-200"
                                    >
                                        {transactionTypes.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right column */}
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="toAddress" className="block text-sm font-medium text-gray-700 mb-2">Recipient Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        id="toAddress"
                                        name="toAddress"
                                        value={formData.toAddress}
                                        onChange={handleInputChange}
                                        placeholder="0x..."
                                        disabled={loading}
                                        className="pl-12 w-full h-14 bg-gray-50 border-2 border-gray-200 text-gray-900 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">Transaction Details</label>
                                <div className="relative group">
                                    <div className="absolute top-4 left-4 flex items-start pointer-events-none text-indigo-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <textarea
                                        id="details"
                                        name="details"
                                        value={formData.details}
                                        onChange={handleInputChange}
                                        placeholder="Enter transaction details"
                                        disabled={loading}
                                        className="pl-12 w-full bg-gray-50 border-2 border-gray-200 text-gray-900 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                                        rows="4"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status message with animation */}
                    {status && (
                        <div className={`mt-8 p-5 rounded-xl flex items-center transform transition-all duration-500 ${status.includes('Error') 
                            ? 'bg-red-50 text-red-800 border-l-4 border-red-500 animate-pulse' 
                            : 'bg-emerald-50 text-emerald-800 border-l-4 border-emerald-500'}`}>
                            <div className={`mr-4 rounded-full p-2 ${status.includes('Error') ? 'bg-red-100' : 'bg-emerald-100'}`}>
                                {status.includes('Error') ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            <span className="font-medium">{status}</span>
                        </div>
                    )}

                    {/* Action button with micro-interactions */}
                    <div className="mt-8">
                        <button 
                            onClick={transferFish}
                            disabled={loading || !isFormValid}
                            className={`w-full h-16 rounded-xl text-white font-medium text-lg flex items-center justify-center shadow-xl transition-all duration-300 ${
                                loading || !isFormValid
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-400 hover:from-cyan-500 hover:via-sky-500 hover:to-blue-500 transform hover:-translate-y-1 hover:shadow-2xl'
                            }`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing Transaction
                                </div>
                            ) : 'Complete Transfer'}
                        </button>
                    </div>

                    {/* Modern footer with icon and blockchain reference */}
                    <div className="mt-8 flex items-center justify-center space-x-2 text-gray-500 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>All transfers are securely recorded on the blockchain and cryptographically verified</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
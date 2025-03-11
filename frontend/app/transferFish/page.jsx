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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header section with gradient background */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                    <h1 className="text-3xl font-bold tracking-tight">Fish Transfer Portal</h1>
                    <p className="mt-2 opacity-90">Securely transfer ownership on the blockchain</p>
                </div>
                
                <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left column */}
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="fishId" className="block text-sm font-medium text-gray-700 mb-1">Fish ID</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1.323l-3.954 1.582a1 1 0 00-.646.934v4.286a1 1 0 00.648.937l3.952 1.566V15a1 1 0 002 0v-1.372l3.952-1.566a1 1 0 00.648-.937V6.839a1 1 0 00-.646-.934L11 4.323V3a1 1 0 00-1-1z" clipRule="evenodd" />
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
                                        className="pl-10 w-full h-12 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="transactionType" className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <select
                                        id="transactionType"
                                        name="transactionType"
                                        value={formData.transactionType}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className="pl-10 w-full h-12 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                                    >
                                        {transactionTypes.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right column */}
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="toAddress" className="block text-sm font-medium text-gray-700 mb-1">Recipient Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
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
                                        className="pl-10 w-full h-12 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">Transaction Details</label>
                                <div className="relative">
                                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
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
                                        className="pl-10 w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        rows="3"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status message */}
                    {status && (
                        <div className={`mt-6 p-4 rounded-lg flex items-center ${status.includes('Error') 
                            ? 'bg-red-50 text-red-800 border-l-4 border-red-500' 
                            : 'bg-green-50 text-green-800 border-l-4 border-green-500'}`}>
                            <div className={`mr-3 rounded-full p-1 ${status.includes('Error') ? 'bg-red-100' : 'bg-green-100'}`}>
                                {status.includes('Error') ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            {status}
                        </div>
                    )}

                    {/* Action button with gradient */}
                    <div className="mt-8">
                        <button 
                            onClick={transferFish}
                            disabled={loading || !formData.fishId || !formData.toAddress || !formData.transactionType}
                            className={`w-full h-14 rounded-lg text-white font-medium text-lg flex items-center justify-center shadow-lg transition-all ${
                                loading || !formData.fishId || !formData.toAddress || !formData.transactionType 
                                ? 'bg-gray-400 cursor-not-allowed opacity-70' 
                                : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transform hover:-translate-y-1'
                            }`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing Transaction
                                </div>
                            ) : 'Complete Transfer'}
                        </button>
                    </div>

                    {/* Footer with additional info */}
                    <div className="mt-6 text-center text-gray-500 text-sm">
                        All transfers are securely recorded on the blockchain
                    </div>
                </div>
            </div>
        </div>
    );
}
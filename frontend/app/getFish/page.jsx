'use client';
import { useState } from 'react';
import Web3 from 'web3';
import contractDetails from '../../../contractDetails.json';

export default function GetFish() {
    const [fishId, setFishId] = useState('');
    const [fishData, setFishData] = useState(null);
    const [fishHistory, setFishHistory] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const getFishData = async () => {
        if (!fishId) {
            setError('Please enter a Fish ID');
            return;
        }

        setLoading(true);
        try {
            // Connect to Web3
            const web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            // Get contract instance using contractDetails
            const contract = new web3.eth.Contract(
                contractDetails.abi,
                contractDetails.contractAddress
            );

            // Get fish details
            const fish = await contract.methods.getFish(fishId).call();
            setFishData({
                id: fish.id.toString(),
                species: fish.species,
                catchLocation: fish.catchLocation,
                weight: fish.weight.toString(),
                currentOwner: fish.currentOwner
            });

            // Get fish history
            const history = await contract.methods.getFishHistory(fishId).call();
            setFishHistory(history.map(tx => ({
                id: tx.id.toString(),
                from: tx.from,
                to: tx.to,
                type: tx.transactionType,
                details: tx.details,
                timestamp: new Date(Number(tx.timestamp) * 1000).toLocaleString()
            })));

            setError('');
        } catch (err) {
            setError(err.message);
            setFishData(null);
            setFishHistory([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4 md:p-8">
            {/* Add back button */}
            <a 
                href="/"
                className="fixed top-4 left-4 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 z-50"
                title="Back to Home"
            >
                <svg 
                    className="h-6 w-6 text-gray-600" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                    />
                </svg>
            </a>

            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
                {/* Header with wave design */}
                <div className="relative bg-gradient-to-r from-blue-600 to-teal-500 p-6 text-white">
                    <div className="absolute left-0 right-0 bottom-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
                            <path fill="white" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
                        </svg>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 relative z-10">Fish Supply Chain Tracker</h1>
                    <p className="opacity-90 relative z-10">Track the journey of seafood from ocean to table</p>
                </div>
                
                <div className="p-6">
                    <div className="mb-8 bg-blue-50 rounded-xl p-6 shadow-sm border border-blue-100">
                        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                            <div className="relative flex-grow w-full">
                                <input
                                    type="number"
                                    value={fishId}
                                    onChange={(e) => setFishId(e.target.value)}
                                    placeholder="Enter Fish ID"
                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a7 7 0 00-5.207 11.793l-.534.534a1 1 0 101.414 1.414l.534-.534A7 7 0 109 2zm0 2a5 5 0 11-4.32 7.536l-.002-.004A5 5 0 019 4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <button
                                onClick={getFishData}
                                disabled={loading}
                                className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-medium px-6 py-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 flex justify-center items-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Loading</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                        </svg>
                                        <span>Track Fish</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex items-center">
                            <svg className="h-6 w-6 text-red-500 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    {fishData && (
                        <div className="mb-8 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6 shadow-md border border-blue-100">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                                <svg className="h-6 w-6 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Fish Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                                    <p className="text-gray-500 text-sm">ID</p>
                                    <p className="font-semibold text-gray-800 text-lg">{fishData.id}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                                    <p className="text-gray-500 text-sm">Species</p>
                                    <p className="font-semibold text-gray-800 text-lg">{fishData.species}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                                    <p className="text-gray-500 text-sm">Catch Location</p>
                                    <p className="font-semibold text-gray-800 text-lg">{fishData.catchLocation}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                                    <p className="text-gray-500 text-sm">Weight</p>
                                    <p className="font-semibold text-gray-800 text-lg">{fishData.weight} kg</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 md:col-span-2">
                                    <p className="text-gray-500 text-sm">Current Owner</p>
                                    <p className="font-semibold text-gray-800 text-lg break-words">{fishData.currentOwner}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {fishHistory.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                                <svg className="h-6 w-6 mr-2 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Transaction History
                            </h2>
                            <div className="space-y-4">
                                {fishHistory.map((tx, index) => (
                                    <div 
                                        key={tx.id} 
                                        className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
                                    >
                                        <div className="flex items-center mb-3">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white font-bold mr-3">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                    {tx.type}
                                                </span>
                                                <span className="text-gray-400 text-sm ml-2">{tx.timestamp}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                            <div>
                                                <p className="text-gray-500 text-sm">Transaction ID</p>
                                                <p className="font-medium text-gray-800">{tx.id}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-sm">From</p>
                                                <p className="font-medium text-gray-800 break-words">{tx.from}</p>
                                            </div>
                                            <div className="md:col-span-2">
                                                <p className="text-gray-500 text-sm">To</p>
                                                <p className="font-medium text-gray-800 break-words">{tx.to}</p>
                                            </div>
                                            <div className="md:col-span-2">
                                                <p className="text-gray-500 text-sm">Details</p>
                                                <p className="font-medium text-gray-800">{tx.details}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {!fishData && !loading && !error && (
                        <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">
                            <svg className="h-16 w-16 text-blue-200 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <h3 className="text-xl font-medium text-gray-600 mb-2">No Fish Data Yet</h3>
                            <p className="max-w-md text-gray-500">Enter a valid Fish ID and click "Track Fish" to see detailed information about the fish and its supply chain journey.</p>
                        </div>
                    )}
                </div>
                
                <footer className="bg-gray-50 px-6 py-4 text-center text-gray-500 text-sm border-t border-gray-200">
                    Blockchain-based Seafood Traceability System &copy; 2025
                </footer>
            </div>
        </div>
    );
}
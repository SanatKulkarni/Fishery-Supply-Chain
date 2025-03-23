'use client';
import { useState } from 'react';
import Web3 from 'web3';
import contractDetails from '../../../contractDetails.json';

export default function GetFish() {
    const [fishId, setFishId] = useState('');
    const [fishData, setFishData] = useState(null);
    const [fishHistory, setFishHistory] = useState([]);
    const [error, setError] = useState('');

    const getFishData = async () => {
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
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Fish Details</h1>
            
            <div className="mb-4">
                <input
                    type="number"
                    value={fishId}
                    onChange={(e) => setFishId(e.target.value)}
                    placeholder="Enter Fish ID"
                    className="border p-2 mr-2"
                />
                <button
                    onClick={getFishData}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Get Fish Data
                </button>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {fishData && (
                <div className="mb-4">
                    <h2 className="text-xl font-bold mb-2">Fish Details</h2>
                    <p>ID: {fishData.id}</p>
                    <p>Species: {fishData.species}</p>
                    <p>Catch Location: {fishData.catchLocation}</p>
                    <p>Weight: {fishData.weight}</p>
                    <p>Current Owner: {fishData.currentOwner}</p>
                </div>
            )}

            {fishHistory.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold mb-2">Transaction History</h2>
                    {fishHistory.map((tx) => (
                        <div key={tx.id} className="border p-2 mb-2">
                            <p>Transaction ID: {tx.id}</p>
                            <p>From: {tx.from}</p>
                            <p>To: {tx.to}</p>
                            <p>Type: {tx.type}</p>
                            <p>Details: {tx.details}</p>
                            <p>Timestamp: {tx.timestamp}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
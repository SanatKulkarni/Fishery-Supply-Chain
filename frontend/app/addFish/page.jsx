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
        <div className="container">
            <h2 className="title">Add New Fish to Supply Chain</h2>
            
            <div className="form-group">
                <label htmlFor="species">Fish Species:</label>
                <input
                    type="text"
                    id="species"
                    name="species"
                    value={fishData.species}
                    onChange={handleInputChange}
                    placeholder="Enter fish species"
                    disabled={loading}
                    className="input-field"
                />
            </div>

            <div className="form-group">
                <label htmlFor="catchLocation">Catch Location:</label>
                <input
                    type="text"
                    id="catchLocation"
                    name="catchLocation"
                    value={fishData.catchLocation}
                    onChange={handleInputChange}
                    placeholder="Enter catch location"
                    disabled={loading}
                    className="input-field"
                />
            </div>

            <div className="form-group">
                <label htmlFor="weight">Weight (kg):</label>
                <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={fishData.weight}
                    onChange={handleInputChange}
                    placeholder="Enter weight in kg"
                    disabled={loading}
                    className="input-field"
                    min="1"
                />
            </div>

            <button 
                onClick={addFish}
                disabled={loading || !fishData.species || !fishData.catchLocation || !fishData.weight}
                className="action-button"
            >
                {loading ? 'Processing...' : 'Add Fish'}
            </button>

            {status && <p className="status-message">{status}</p>}
        </div>
    );
}
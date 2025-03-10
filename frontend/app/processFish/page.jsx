'use client';
import React, { useState } from 'react';
import Web3 from 'web3';
import contractDetails from '../../../contractDetails.json';

export default function ProcessFishPage() {
    const [formData, setFormData] = useState({
        fishId: '',
        details: ''
    });
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const processFish = async () => {
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

            await contract.methods.processFish(
                formData.fishId,
                formData.details
            ).send({ from: account });

            setStatus('Fish successfully processed!');
            // Clear form
            setFormData({
                fishId: '',
                details: ''
            });
        } catch (error) {
            setStatus('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2 className="title">Process Fish</h2>
            
            <div className="form-group">
                <label htmlFor="fishId">Fish ID:</label>
                <input
                    type="number"
                    id="fishId"
                    name="fishId"
                    value={formData.fishId}
                    onChange={handleInputChange}
                    placeholder="Enter fish ID"
                    disabled={loading}
                    className="input-field"
                    min="1"
                />
            </div>

            <div className="form-group">
                <label htmlFor="details">Processing Details:</label>
                <textarea
                    id="details"
                    name="details"
                    value={formData.details}
                    onChange={handleInputChange}
                    placeholder="Enter processing details (e.g., cleaning, filleting, packaging)"
                    disabled={loading}
                    className="input-field"
                    rows="4"
                />
            </div>

            <button 
                onClick={processFish}
                disabled={loading || !formData.fishId || !formData.details}
                className="action-button"
            >
                {loading ? 'Processing...' : 'Process Fish'}
            </button>

            {status && <p className="status-message">{status}</p>}
        </div>
    );
}
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
        <div className="container">
            <h2 className="title">Transfer Fish</h2>
            
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
                <label htmlFor="toAddress">Recipient Address:</label>
                <input
                    type="text"
                    id="toAddress"
                    name="toAddress"
                    value={formData.toAddress}
                    onChange={handleInputChange}
                    placeholder="0x..."
                    disabled={loading}
                    className="input-field"
                />
            </div>

            <div className="form-group">
                <label htmlFor="transactionType">Transaction Type:</label>
                <select
                    id="transactionType"
                    name="transactionType"
                    value={formData.transactionType}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="input-field"
                >
                    {transactionTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                            {type.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="details">Details:</label>
                <textarea
                    id="details"
                    name="details"
                    value={formData.details}
                    onChange={handleInputChange}
                    placeholder="Enter transaction details"
                    disabled={loading}
                    className="input-field"
                    rows="3"
                />
            </div>

            <button 
                onClick={transferFish}
                disabled={loading || !formData.fishId || !formData.toAddress || !formData.transactionType}
                className="action-button"
            >
                {loading ? 'Processing...' : 'Transfer Fish'}
            </button>

            {status && <p className="status-message">{status}</p>}
        </div>
    );
}
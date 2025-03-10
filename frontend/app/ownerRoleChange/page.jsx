'use client';
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import contractDetails from '../../../contractDetails.json';

export default function OwnerRoleChangePage() {
    const [walletAddress, setWalletAddress] = useState('');
    const [selectedRole, setSelectedRole] = useState('0');
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
        } catch (error) {
            setStatus('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOwner) {
        return <div className="container">
            <h2 className="title">Access Denied</h2>
            <p>Only the contract owner can access this page.</p>
        </div>;
    }

    return (
        <div className="container">
            <h2 className="title">Change Participant Role</h2>
            
            <div className="form-group">
                <label htmlFor="address">Participant Wallet Address:</label>
                <input
                    type="text"
                    id="address"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="0x..."
                    disabled={loading}
                    className="input-field"
                />
            </div>

            <div className="form-group">
                <label htmlFor="role">New Role:</label>
                <select 
                    id="role"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    disabled={loading}
                    className="select-field"
                >
                    {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                            {role.label}
                        </option>
                    ))}
                </select>
            </div>

            <button 
                onClick={changeRole}
                disabled={loading || !walletAddress}
                className="action-button"
            >
                {loading ? 'Processing...' : 'Change Role'}
            </button>

            {status && <p className="status-message">{status}</p>}
        </div>
    );
}
'use client';
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import contractDetails from '../../../contractDetails.json';

export default function ParticipantsPage() {
    const [selectedRole, setSelectedRole] = useState('0');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentRole, setCurrentRole] = useState(null);

    const roles = [
        { value: '0', label: 'Fisherman' },
        { value: '1', label: 'Processor' },
        { value: '2', label: 'Distributor' },
        { value: '3', label: 'Retailer' },
        { value: '4', label: 'Consumer' }
    ];

    const getCurrentRole = async () => {
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

            const roleNumber = await contract.methods.participants(account).call();
            if (roleNumber !== '0' || roleNumber !== 0) {
                const role = roles.find(r => r.value === roleNumber.toString());
                setCurrentRole(role?.label || 'Unknown Role');
            } else {
                setCurrentRole('Not Registered');
            }
        } catch (error) {
            console.error('Error getting role:', error);
            setCurrentRole('Error getting role');
        }
    };

    useEffect(() => {
        getCurrentRole();
    }, []);

    const registerParticipant = async () => {
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

            await contract.methods.registerParticipant(selectedRole)
                .send({ from: account });

            setStatus('Successfully registered as ' + roles.find(r => r.value === selectedRole).label);
        } catch (error) {
            setStatus('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Register as Supply Chain Participant</h2>
            
            {currentRole && (
                <div style={{ marginBottom: '20px' }}>
                    <p>Your current role: {currentRole}</p>
                </div>
            )}
            
            <div>
                <label htmlFor="role">Select Role: </label>
                <select 
                    id="role"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    disabled={loading || currentRole !== 'Not Registered'}
                >
                    {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                            {role.label}
                        </option>
                    ))}
                </select>
            </div>

            <button 
                onClick={registerParticipant}
                disabled={loading || currentRole !== 'Not Registered'}
                style={{ marginTop: '10px' }}
            >
                {loading ? 'Processing...' : 'Register'}
            </button>

            {status && <p>{status}</p>}
        </div>
    );
}
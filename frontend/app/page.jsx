'use client';
import { useState, useEffect } from 'react';
import Link from "next/link";
import Web3 from 'web3';
import contractDetails from '../../contractDetails.json';

export default function Home() {
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

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
      console.error('Error checking owner:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <main className="main-content">
        <h1 className="title">Fishery Supply Chain</h1>
        
        <div className="nav-links">
          <Link href="/participant" className="nav-button">
            Register as Participant
          </Link>
          <Link href="/addFish" className="nav-button">
            Add New Fish
          </Link>
          <Link href="/transferFish" className="nav-button">
            Transfer Fish
          </Link>
          <Link href="/processFish" className="nav-button">
            Process Fish
          </Link>
          {!loading && isOwner && (
            <Link href="/ownerRoleChange" className="nav-button">
              Change Participant Role (Owner Only)
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}

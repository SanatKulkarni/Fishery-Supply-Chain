"use client"

import { useState, useEffect } from "react";
import Web3 from "web3";
import { Button } from "@/Homepage/ui/button";
import { Wallet } from "lucide-react";

export default function ConnectMetaMask() {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
    } else {
      alert("MetaMask is not installed. Please install it to continue.");
    }
  }, []);

  const connectWallet = async () => {
    if (!web3) {
      console.error("Web3 is not initialized.");
      return;
    }

    try {
      console.log("Requesting accounts from MetaMask...");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-20">
      <Button
        onClick={connectWallet}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-800 text-white px-6 py-3 rounded-xl shadow-md hover:from-indigo-700 hover:to-purple-700 transition duration-300"
      >
        <Wallet className="w-5 h-5" />
        {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connect MetaMask"}
      </Button>
    </div>
  );
}

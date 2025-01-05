import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers'; 
import MentorshipSystem from '../artifacts/src/contracts/MentorshipContract.sol/MentorshipSystem.json';
import EduToken from '../artifacts/src/contracts/EduToken.sol/EduToken.json';
import MentorshipNFT from '../artifacts/src/contracts/MentorshipNFT.sol/MentorshipNFT.json';

declare global {
  interface Window {
    ethereum: any;
  }
}


interface Web3ContextType {
  account: string | null;
  mentorshipContract: ethers.Contract | null;
  eduTokenContract: ethers.Contract | null;
  nftContract: ethers.Contract | null;
  connectWallet: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  mentorshipContract: null,
  eduTokenContract: null,
  nftContract: null,
  connectWallet: async () => {},
});

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [mentorshipContract, setMentorshipContract] = useState<ethers.Contract | null>(null);
  const [eduTokenContract, setEduTokenContract] = useState<ethers.Contract | null>(null);
  const [nftContract, setNftContract] = useState<ethers.Contract | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        // Replace with your deployed contract addresses
        const mentorshipContract = "0x06fEC0B4eC252e31e55BFD5E4CeDb256c57fA427";
        const eduTokenContract = "0x104A0F99728D5a79dbEbB4a0a58eCcb456e82411";
        const nftContract = "0x70909121e14aeF5CceAFb8d7939cfd82f323aBDf";
        
        const mentorship = new ethers.Contract(mentorshipContract, MentorshipSystem.abi, signer);
        const eduToken = new ethers.Contract(eduTokenContract, EduToken.abi, signer);
        const nft = new ethers.Contract(nftContract, MentorshipNFT.abi, signer);
        
        setMentorshipContract(mentorship);
        setEduTokenContract(eduToken);
        setNftContract(nft);
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      console.error("MetaMask is not installed");
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });
    } else {
      console.error("MetaMask is not installed");
    }
  }, []);

  return (
    <Web3Context.Provider value={{
      account,
      mentorshipContract,
      eduTokenContract,
      nftContract,
      connectWallet,
    }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
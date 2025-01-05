import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../context/Web3Context';
import MentorshipNFTAbi from '../artifacts/src/contracts/MentorshipNFT.sol/MentorshipNFT.json';
import { Achievement } from '../types/contracts';

export function useNFTContract(address: string) {
  const { account } = useWeb3();
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined' && account) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      provider.getSigner().then(signer => {
        const contractInstance = new ethers.Contract(address, MentorshipNFTAbi.abi, signer);
        setContract(contractInstance);
      });
    }
  }, [address, account]);

  const getAchievement = async (tokenId: number): Promise<Achievement | null> => {
    if (!contract) return null;
    try {
      const achievement = await contract.getAchievement(tokenId);
      return {
        tokenId,
        title: achievement[0],
        description: achievement[1],
        sessionId: Number(achievement[2]),
        mentor: achievement[3],
        timestamp: Number(achievement[4])
      };
    } catch (error) {
      console.error('Error fetching achievement:', error);
      return null;
    }
  };

  return { contract, getAchievement };
}
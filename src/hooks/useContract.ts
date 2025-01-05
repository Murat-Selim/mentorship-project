import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../context/Web3Context';

export function useContract(address: string, abi: any) {
  const { account } = useWeb3();
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined' && account) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      provider.getSigner().then(signer => {
        const contractInstance = new ethers.Contract(address, abi, signer);
        setContract(contractInstance);
      });
    }
  }, [address, abi, account]);

  return contract;
}
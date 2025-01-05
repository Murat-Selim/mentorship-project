import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../context/Web3Context';
import MentorshipSystemAbi from '../artifacts/src/contracts/MentorshipContract.sol/MentorshipSystem.json';
import { Mentor, Student, Session } from '../types/contracts';

export function useMentorshipSystem(address: string) {
  const { account } = useWeb3();
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined' && account) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      provider.getSigner().then(signer => {
        const contractInstance = new ethers.Contract(address, MentorshipSystemAbi.abi, signer);
        setContract(contractInstance);
      });
    }
  }, [address, account]);

  const registerMentor = async (name: string, expertise: string, hourlyRate: bigint) => {
    if (!contract) throw new Error('Contract not initialized');
    const tx = await contract.registerMentor(name, expertise, hourlyRate);
    await tx.wait();
  };

  const registerStudent = async (name: string) => {
    if (!contract) throw new Error('Contract not initialized');
    const tx = await contract.registerStudent(name);
    await tx.wait();
  };

  const getMentor = async (address: string): Promise<Mentor | null> => {
    if (!contract) return null;
    try {
      const mentor = await contract.mentors(address);
      return {
        walletAddress: mentor[0],
        name: mentor[1],
        expertise: mentor[2],
        hourlyRate: mentor[3],
        isAvailable: mentor[4],
        rating: Number(mentor[5]),
        totalRatings: Number(mentor[6]),
        sessionIds: mentor[7].map(Number)
      };
    } catch (error) {
      console.error('Error fetching mentor:', error);
      return null;
    }
  };

  const getStudent = async (address: string): Promise<Student | null> => {
    if (!contract) return null;
    try {
      const student = await contract.students(address);
      return {
        walletAddress: student[0],
        name: student[1],
        isRegistered: student[2],
        currentMentor: student[3],
        sessionIds: student[4].map(Number),
        achievementIds: student[5].map(Number)
      };
    } catch (error) {
      console.error('Error fetching student:', error);
      return null;
    }
  };

  const getSession = async (sessionId: number): Promise<Session | null> => {
    if (!contract) return null;
    try {
      const session = await contract.sessions(sessionId);
      return {
        sessionId: Number(session[0]),
        mentor: session[1],
        student: session[2],
        startTime: Number(session[3]),
        duration: Number(session[4]),
        amount: session[5],
        isActive: session[6],
        isPaid: session[7],
        isCompleted: session[8],
        nftMinted: session[9]
      };
    } catch (error) {
      console.error('Error fetching session:', error);
      return null;
    }
  };

  const startSession = async (mentorAddress: string) => {
    if (!contract) throw new Error('Contract not initialized');
    const tx = await contract.startSession(mentorAddress);
    await tx.wait();
  };

  const endSession = async (studentAddress: string) => {
    if (!contract) throw new Error('Contract not initialized');
    const tx = await contract.endSession(studentAddress);
    await tx.wait();
  };

  const rateMentor = async (mentorAddress: string, rating: number) => {
    if (!contract) throw new Error('Contract not initialized');
    const tx = await contract.rateMentor(mentorAddress, rating);
    await tx.wait();
  };

  return {
    contract,
    registerMentor,
    registerStudent,
    getMentor,
    getStudent,
    getSession,
    startSession,
    endSession,
    rateMentor
  };
}
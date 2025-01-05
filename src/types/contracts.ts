// Contract Types
export interface Achievement {
  tokenId: number;
  title: string;
  description: string;
  sessionId: number;
  mentor: string;
  timestamp: number;
}

export interface Mentor {
  walletAddress: string;
  name: string;
  expertise: string;
  hourlyRate: bigint;
  isAvailable: boolean;
  rating: number;
  totalRatings: number;
  sessionIds: number[];
}

export interface Student {
  walletAddress: string;
  name: string;
  isRegistered: boolean;
  currentMentor: string;
  sessionIds: number[];
  achievementIds: number[];
}

export interface Session {
  sessionId: number;
  mentor: string;
  student: string;
  startTime: number;
  duration: number;
  amount: bigint;
  isActive: boolean;
  isPaid: boolean;
  isCompleted: boolean;
  nftMinted: boolean;
}
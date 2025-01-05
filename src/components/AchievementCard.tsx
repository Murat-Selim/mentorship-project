import React from 'react';
import { Award, Calendar, User } from 'lucide-react';

interface AchievementCardProps {
  tokenId: number;
  title: string;
  description: string;
  mentor: string;
  timestamp: number;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  tokenId,
  title,
  description,
  mentor,
  timestamp
}) => {
  const date = new Date(timestamp * 1000).toLocaleDateString();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-indigo-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Award className="h-8 w-8 text-indigo-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">Token ID: #{tokenId}</p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-gray-600">{description}</p>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
        <div className="flex items-center">
          <User className="h-4 w-4 mr-2" />
          <span>Mentor: {mentor.slice(0, 6)}...{mentor.slice(-4)}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;
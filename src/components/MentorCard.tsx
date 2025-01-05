import React from 'react';
import { User, Clock, Award } from 'lucide-react';

interface MentorCardProps {
  address: string;
  name: string;
  expertise: string;
  hourlyRate: number;
  rating: number;
  totalRatings: number;
  isAvailable: boolean;
  onBook?: () => void;
}

const MentorCard: React.FC<MentorCardProps> = ({
  address,
  name,
  expertise,
  hourlyRate,
  rating,
  totalRatings,
  isAvailable,
  onBook
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4">
        <div className="bg-indigo-100 p-3 rounded-full">
          <User className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500">{expertise}</p>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-sm font-medium">{hourlyRate} EDU/hr</span>
        </div>
        <div className="flex items-center">
          <Award className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-sm font-medium">{rating}/5 ({totalRatings})</span>
        </div>
      </div>

      <div className="mt-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isAvailable ? 'Available' : 'Busy'}
        </span>
      </div>

      {onBook && isAvailable && (
        <button
          onClick={onBook}
          className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Book Session
        </button>
      )}
    </div>
  );
};

export default MentorCard;
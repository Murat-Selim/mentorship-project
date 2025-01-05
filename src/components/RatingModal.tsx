import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useMentorshipSystem } from '../hooks/useMentorshipSystem';

interface RatingModalProps {
  mentorAddress: string;
  onClose: () => void;
  onSuccess: () => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ mentorAddress, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const { rateMentor } = useMentorshipSystem(process.env.MENTORSHIP_SYSTEM_ADDRESS || '');

  const handleSubmit = async () => {
    if (rating === 0) return;
    setLoading(true);
    
    try {
      await rateMentor(mentorAddress, rating);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Rating error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-4">Rate Your Mentor</h3>
        
        <div className="flex justify-center space-x-2 mb-6">
          {[1, 2, 3, 4, 5].map((value) => (
            <Star
              key={value}
              className={`h-8 w-8 cursor-pointer ${
                value <= (hoveredRating || rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(value)}
            />
          ))}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || rating === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
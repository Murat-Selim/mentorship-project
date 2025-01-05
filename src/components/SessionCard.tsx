import React from 'react';
import { Clock, User, Check, X } from 'lucide-react';

interface SessionCardProps {
  sessionId: number;
  mentor: string;
  student: string;
  startTime: number;
  duration: number;
  amount: number;
  isActive: boolean;
  isPaid: boolean;
  isCompleted: boolean;
  onEndSession?: () => void;
}

const SessionCard: React.FC<SessionCardProps> = ({
  sessionId,
  mentor,
  student,
  startTime,
  duration,
  amount,
  isActive,
  isPaid,
  isCompleted,
  onEndSession
}) => {
  const startDate = new Date(startTime * 1000).toLocaleString();
  const endDate = new Date((startTime + duration) * 1000).toLocaleString();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Session #{sessionId}</h3>
        <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {isActive ? 'Active' : isCompleted ? 'Completed' : 'Pending'}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Mentor</p>
          <div className="flex items-center mt-1">
            <User className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm font-medium">{mentor.slice(0, 6)}...{mentor.slice(-4)}</span>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500">Student</p>
          <div className="flex items-center mt-1">
            <User className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm font-medium">{student.slice(0, 6)}...{student.slice(-4)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Start Time</p>
          <div className="flex items-center mt-1">
            <Clock className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm">{startDate}</span>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500">Amount</p>
          <p className="text-sm font-medium">{amount} EDU</p>
        </div>
      </div>

      <div className="mt-4 flex items-center space-x-4">
        <div className="flex items-center">
          <Check className={`h-4 w-4 ${isPaid ? 'text-green-500' : 'text-gray-300'} mr-1`} />
          <span className="text-sm">Paid</span>
        </div>
        <div className="flex items-center">
          <Check className={`h-4 w-4 ${isCompleted ? 'text-green-500' : 'text-gray-300'} mr-1`} />
          <span className="text-sm">Completed</span>
        </div>
      </div>

      {isActive && onEndSession && (
        <button
          onClick={onEndSession}
          className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
        >
          End Session
        </button>
      )}
    </div>
  );
};

export default SessionCard;
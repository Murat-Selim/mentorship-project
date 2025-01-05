import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Award } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          Welcome to MentorshipDApp
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Connect with expert mentors, learn new skills, and earn achievements on the blockchain.
        </p>
      </div>

      <div className="mt-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
            <BookOpen className="h-12 w-12 text-indigo-600" />
            <h3 className="mt-4 text-xl font-medium text-gray-900">Expert Mentorship</h3>
            <p className="mt-2 text-gray-500">
              Connect with experienced mentors in your field of interest.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
            <Users className="h-12 w-12 text-indigo-600" />
            <h3 className="mt-4 text-xl font-medium text-gray-900">Secure Payments</h3>
            <p className="mt-2 text-gray-500">
              Pay for sessions using EDU tokens with blockchain security.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
            <Award className="h-12 w-12 text-indigo-600" />
            <h3 className="mt-4 text-xl font-medium text-gray-900">NFT Achievements</h3>
            <p className="mt-2 text-gray-500">
              Earn NFT certificates for completed mentorship sessions.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 flex justify-center space-x-6">
        <button
          onClick={() => navigate('/mentor')}
          className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Become a Mentor
        </button>
        <button
          onClick={() => navigate('/student')}
          className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          Find a Mentor
        </button>
      </div>
    </div>
  );
};

export default Home;
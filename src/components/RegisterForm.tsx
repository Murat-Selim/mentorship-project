import React, { useState } from 'react';
import { useMentorshipSystem } from '../hooks/useMentorshipSystem';

interface RegisterFormProps {
  type: 'mentor' | 'student';
  onSuccess: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ type, onSuccess }) => {
  const [name, setName] = useState('');
  const [expertise, setExpertise] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { registerMentor, registerStudent } = useMentorshipSystem(process.env.MENTORSHIP_SYSTEM_ADDRESS || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (type === 'mentor') {
        await registerMentor(name, expertise, BigInt(hourlyRate));
      } else {
        await registerStudent(name);
      }
      onSuccess();
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      {type === 'mentor' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Expertise</label>
            <input
              type="text"
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hourly Rate (EDU)</label>
            <input
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
              min="1"
            />
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? 'Registering...' : `Register as ${type === 'mentor' ? 'Mentor' : 'Student'}`}
      </button>
    </form>
  );
};

export default RegisterForm;
import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import SessionCard from '../components/SessionCard';
import { Loader2 } from 'lucide-react';

const MentorDashboard = () => {
  const { account, mentorshipContract } = useWeb3();
  const [mentor, setMentor] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (account && mentorshipContract) {
      loadMentorData();
    }
  }, [account, mentorshipContract]);

  const loadMentorData = async () => {
    try {
      if (mentorshipContract) {
        const mentorData = await mentorshipContract.mentors(account);
        setMentor(mentorData);

        const sessionIds = await mentorshipContract.getMentorSessions(account);
        const sessionsData = await Promise.all(
          sessionIds.map((id: number) => mentorshipContract.sessions(id))
        );
        setSessions(sessionsData);
      }
    } catch (error) {
      console.error('Error loading mentor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = async (sessionId: number, studentAddress: string) => {
    try {
      if (!mentorshipContract) {
        console.error('Mentorship contract is not available');
        return;
      }
      const tx = await mentorshipContract.endSession(studentAddress);
      await tx.wait();
      await loadMentorData();
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Become a Mentor</h2>
          <p className="mt-2 text-gray-600">Register as a mentor to start teaching and earning.</p>
          <button
            onClick={() => {/* Add mentor registration logic */}}
            className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Register as Mentor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Mentor Dashboard</h2>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{mentor.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Expertise</p>
            <p className="font-medium">{mentor.expertise}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Hourly Rate</p>
            <p className="font-medium">{mentor.hourlyRate.toString()} EDU</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Rating</p>
            <p className="font-medium">{mentor.rating.toString()}/5 ({mentor.totalRatings.toString()} reviews)</p>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">Active Sessions</h3>
      <div className="grid gap-6">
        {sessions
          .filter(session => session.isActive)
          .map((session, index) => (
            <SessionCard
              key={index}
              sessionId={session.sessionId.toString()}
              mentor={session.mentor}
              student={session.student}
              startTime={session.startTime.toString()}
              duration={session.duration.toString()}
              amount={session.amount.toString()}
              isActive={session.isActive}
              isPaid={session.isPaid}
              isCompleted={session.isCompleted}
              onEndSession={() => handleEndSession(session.sessionId, session.student)}
            />
          ))}
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Past Sessions</h3>
      <div className="grid gap-6">
        {sessions
          .filter(session => !session.isActive && session.isCompleted)
          .map((session, index) => (
            <SessionCard
              key={index}
              sessionId={session.sessionId.toString()}
              mentor={session.mentor}
              student={session.student}
              startTime={session.startTime.toString()}
              duration={session.duration.toString()}
              amount={session.amount.toString()}
              isActive={session.isActive}
              isPaid={session.isPaid}
              isCompleted={session.isCompleted}
            />
          ))}
      </div>
    </div>
  );
};

export default MentorDashboard;
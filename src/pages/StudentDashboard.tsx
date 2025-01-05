import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import MentorCard from '../components/MentorCard';
import SessionCard from '../components/SessionCard';
import AchievementCard from '../components/AchievementCard';
import { Loader2 } from 'lucide-react';

const StudentDashboard = () => {
  const { account, mentorshipContract, eduTokenContract, nftContract } = useWeb3();
  const [student, setStudent] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [availableMentors, setAvailableMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (account && mentorshipContract && nftContract) {
      loadStudentData();
    }
  }, [account, mentorshipContract, nftContract]);

  const loadStudentData = async () => {
    try {
      if (!mentorshipContract) return;
      const studentData = await mentorshipContract.students(account);
      setStudent(studentData);

      const sessionIds = await mentorshipContract.getStudentSessions();
      const sessionsData = await Promise.all(
        sessionIds.map((id: number) => mentorshipContract.sessions(id))
      );
      setSessions(sessionsData);

      // Load achievements
      const achievementIds = studentData.achievementIds;
      const achievementsData = await Promise.all(
        achievementIds.map(async (id: number) => {
          if (!nftContract) return;
          const achievement = await nftContract.getAchievement(id);
          return { id, ...achievement };
        })
      );
      setAchievements(achievementsData);

      // This is a simplified way to get mentors - you'll need to implement proper mentor discovery
      const mentorAddresses = sessionsData.map(s => s.mentor);
      const uniqueMentors = [...new Set(mentorAddresses)];
      const mentorsData = await Promise.all(
        uniqueMentors.map(addr => mentorshipContract.mentors(addr))
      );
      setAvailableMentors(mentorsData);
    } catch (error) {
      console.error('Error loading student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSession = async (mentorAddress: string) => {
    try {
      if (!mentorshipContract) return;
      // First approve EDU tokens
      const mentor = await mentorshipContract.mentors(mentorAddress);
      if (!eduTokenContract) return;
      await eduTokenContract.approve(mentorshipContract.address, mentor.hourlyRate);
      
      // Start session
      const tx = await mentorshipContract.startSession(mentorAddress);
      await tx.wait();
      await loadStudentData();
    } catch (error) {
      console.error('Error booking session:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!student?.isRegistered) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Welcome Student!</h2>
          <p className="mt-2 text-gray-600">Register to start learning from expert mentors.</p>
          <button
            onClick={() => {/* Add student registration logic */}}
            className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Register as Student
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Student Dashboard</h2>
        <p className="mt-2 text-gray-600">Welcome back, {student.name}!</p>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">Available Mentors</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {availableMentors.map((mentor, index) => (
          <MentorCard
            key={index}
            address={mentor.walletAddress}
            name={mentor.name}
            expertise={mentor.expertise}
            hourlyRate={mentor.hourlyRate.toString()}
            rating={mentor.rating.toString()}
            totalRatings={mentor.totalRatings.toString()}
            isAvailable={mentor.isAvailable}
            onBook={() => handleBookSession(mentor.walletAddress)}
          />
        ))}
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">Active Sessions</h3>
      <div className="grid gap-6 mb-8">
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
            />
          ))}
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">Achievements</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((achievement, index) => (
          <AchievementCard
            key={index}
            tokenId={achievement.id}
            title={achievement.title}
            description={achievement.description}
            mentor={achievement.mentor}
            timestamp={achievement.timestamp}
          />
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase.ts';
import { ProfileIcon } from './icons/ProfileIcon.tsx';
import { TrophyIcon } from './icons/TrophyIcon.tsx';
import { GoldMedalIcon } from './icons/GoldMedalIcon.tsx';
import { SilverMedalIcon } from './icons/SilverMedalIcon.tsx';
import { BronzeMedalIcon } from './icons/BronzeMedalIcon.tsx';
import FirestoreRulesError from './FirestoreRulesError.tsx';

interface LeaderboardUser {
    id: string;
    name: string;
    xp: number;
}

interface LeaderboardPageProps {
  currentUser: { uid: string, name: string, xp: number };
}

// Helper to format a name from an email
const formatNameFromEmail = (email: string): string => {
  const emailName = email.split('@')[0];
  return emailName.replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const usersCol = collection(db, 'users');
        const q = query(usersCol, orderBy('xp', 'desc'), limit(50));
        const querySnapshot = await getDocs(q);
        const userList = querySnapshot.docs.map(doc => {
            const data = doc.data();
            
            // FIX: Improved name fallback logic.
            // 1. Use displayName if it exists.
            // 2. If not, try to create a name from the email.
            // 3. As a last resort, use the user ID.
            const name = data.displayName || 
                         (data.email ? formatNameFromEmail(data.email) : `User-${doc.id.substring(0, 5)}`);
            
            return {
                id: doc.id,
                name: name,
                xp: data.xp || 0,
            };
        });
        setUsers(userList);
      } catch (err: any) {
        console.error("Error fetching leaderboard:", err.message);
        if (err.message && (err.message.toLowerCase().includes('permission') || err.message.toLowerCase().includes('missing index'))) {
          setError('permission-denied');
        } else {
          setError('generic-error');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankContent = (rank: number) => {
    switch (rank) {
      case 1: return <GoldMedalIcon className="w-8 h-8" />;
      case 2: return <SilverMedalIcon className="w-8 h-8" />;
      case 3: return <BronzeMedalIcon className="w-8 h-8" />;
      default: return <span className="text-xl font-bold text-slate-300">{rank}</span>;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fadeInUp">
      <div className="text-center mb-12">
          <TrophyIcon className="w-16 h-16 mx-auto text-amber-400 mb-4" />
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">Leaderboard</h2>
          <p className="text-lg text-slate-400 mt-2">See how you stack up against other top performers.</p>
      </div>
      
      <div className="bg-gradient-to-br from-violet-900/50 to-indigo-900/50 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {isLoading ? (
              <div className="flex items-center justify-center h-64">
                  <div className="w-8 h-8 border-4 border-purple-400 border-dashed rounded-full animate-spin border-t-transparent"></div>
              </div>
          ) : error === 'permission-denied' ? (
              <div className="p-4">
                <FirestoreRulesError />
              </div>
          ) : error === 'generic-error' ? (
              <div className="text-center p-12">
                  <h3 className="text-2xl font-bold text-white">Something Went Wrong</h3>
                  <p className="text-slate-400 mt-2">Could not load the leaderboard. Please try again later.</p>
              </div>
          ) : users.length > 0 ? (
            <>
              <div className="flex bg-black/20 p-4 text-sm font-semibold text-slate-400 border-b border-white/10">
                  <div className="w-1/6 text-center">Rank</div>
                  <div className="w-3/6">User</div>
                  <div className="w-2/6 text-right">XP</div>
              </div>
              <div className="divide-y divide-white/10">
              {users.map((user, index) => {
                  const rank = index + 1;
                  const isCurrentUser = user.id === currentUser.uid;
                  
                  return (
                      <div key={user.id} className={`flex items-center p-4 transition-colors ${isCurrentUser ? 'bg-purple-600/30' : ''}`}>
                      <div className="w-1/6 text-center flex items-center justify-center">
                          {getRankContent(rank)}
                      </div>
                      <div className="w-3/6 flex items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 bg-purple-500`}>
                          <ProfileIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                          <p className={`font-semibold ${isCurrentUser ? 'text-white' : 'text-slate-200'}`}>{user.name} {isCurrentUser && '(You)'}</p>
                          </div>
                      </div>
                      <div className="w-2/6 text-right font-bold text-lg text-white">
                          {user.xp.toLocaleString()} XP
                      </div>
                      </div>
                  );
              })}
              </div>
            </>
          ) : (
               <div className="text-center p-12">
                  <h3 className="text-2xl font-bold text-white">The Leaderboard is Empty!</h3>
                  <p className="text-slate-400 mt-2">Complete a practice session to get ranked.</p>
              </div>
          )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
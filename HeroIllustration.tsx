import React from 'react';
import type { UserStats } from '../types.ts';
import type { User } from 'firebase/auth';
import { GemIcon } from './icons/GemIcon.tsx';
import { XPIcon } from './icons/XPIcon.tsx';
import { StreakIcon } from './icons/StreakIcon.tsx';
import { MenuIcon } from './icons/MenuIcon.tsx';
import ProfileDropdown from './ProfileDropdown.tsx';

interface HeaderProps {
  user: User | null;
  userStats: UserStats;
  onLogout: () => void;
  onToggleMobileSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, userStats, onLogout, onToggleMobileSidebar }) => {
  return (
    <header className="bg-gradient-to-r from-violet-900/50 to-indigo-900/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-40 h-[65px] flex-shrink-0">
      <nav className="px-4 h-full flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {/* Mobile Sidebar Toggle */}
           <button onClick={onToggleMobileSidebar} className="md:hidden p-2 -ml-2 text-violet-300 hover:text-white">
             <MenuIcon className="w-6 h-6" />
           </button>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="hidden sm:flex items-center space-x-2 p-2 bg-black/20 rounded-full border border-white/10">
            <GemIcon className="w-5 h-5 text-cyan-400" />
            <span className="font-semibold text-sm text-white">{userStats.gems}</span>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-black/20 rounded-full border border-white/10">
            <XPIcon className="w-5 h-5 text-purple-400" />
            <span className="font-semibold text-sm text-white">{userStats.xp} XP</span>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-black/20 rounded-full border border-white/10">
            <StreakIcon className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-sm text-white">{userStats.streak}</span>
          </div>
          <div className="h-full border-l border-white/10 mx-2"></div>
          <ProfileDropdown user={user} onLogout={onLogout} />
        </div>
      </nav>
    </header>
  );
};

export default Header;
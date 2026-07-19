import React, { useState, useEffect, useRef } from 'react';
import type { User } from '../firebase.ts';
import { ProfileIcon } from './icons/ProfileIcon.tsx';
import { LogoutIcon } from './icons/LogoutIcon.tsx';

interface ProfileDropdownProps {
  user: User | null;
  onLogout: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex items-center justify-center bg-black/20 rounded-full border border-white/10 hover:border-purple-500/50 transition-colors"
      >
        <ProfileIcon className="w-5 h-5 text-violet-300" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-gradient-to-br from-violet-900 to-indigo-950 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl animate-fadeInUp z-50">
          <div className="p-2">
            <div className="px-3 py-2">
              <p className="text-sm font-semibold text-white truncate">{user?.displayName || 'User'}</p>
              <p className="text-xs text-violet-300 truncate">{user?.email || 'No email provided'}</p>
            </div>
            <div className="my-1 h-px bg-white/10"></div>
            <button onClick={onLogout} className="w-full flex items-center px-3 py-2 text-sm text-violet-200 hover:bg-white/5 rounded-md">
              <LogoutIcon className="w-4 h-4 mr-3" /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
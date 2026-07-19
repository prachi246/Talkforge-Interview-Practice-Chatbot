import React from 'react';
import { TalkForgeLogoIcon } from './icons/TalkForgeLogoIcon.tsx';

interface LandingHeaderProps {
  onNavigate: (view: 'login' | 'signup') => void;
}

const LandingHeader: React.FC<LandingHeaderProps> = ({ onNavigate }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-violet-950/50 backdrop-blur-lg border-b border-violet-500/20">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.location.reload()}>
          <TalkForgeLogoIcon className="w-9 h-9 text-white" />
          <div>
            <h1 className="text-2xl font-bold tracking-wider text-white">
              Talk<span className="text-orange-400">Forge</span>
            </h1>
            <p className="text-xs text-violet-300 -mt-1 tracking-wide">Forge your communication future</p>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <button onClick={() => onNavigate('login')} className="text-violet-200 hover:text-white transition-colors px-4 py-2 rounded-md">Login</button>
          <button onClick={() => onNavigate('signup')} className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-500/20">
            Sign Up Free
          </button>
        </div>
         <button
          onClick={() => onNavigate('signup')}
          className="md:hidden px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-500/20"
        >
          Launch App
        </button>
      </nav>
    </header>
  );
};

export default LandingHeader;
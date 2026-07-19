

import React from 'react';
import { ResumeIcon } from './icons/ResumeIcon.tsx';
import { FeedbackNavIcon } from './icons/FeedbackNavIcon.tsx';
import { QuitIcon } from './icons/QuitIcon.tsx';

interface EndSessionModalProps {
  onClose: () => void;      // Resume
  onConfirmEnd: () => void; // End & Get Feedback
  onQuit: () => void;       // Quit without feedback
}

const EndSessionModal: React.FC<EndSessionModalProps> = ({ onClose, onConfirmEnd, onQuit }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="w-full max-w-lg bg-gradient-to-br from-violet-950 to-indigo-950 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl animate-fadeInUp"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">End Practice Session?</h2>
          <p className="text-slate-400 mb-8">
            Choose an option below. Ending the session will finalize it for feedback, while quitting will simply exit the practice.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Resume */}
            <button
              onClick={onClose}
              className="group flex flex-col items-center justify-center p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/20 hover:border-white/20 transition-all"
            >
              <ResumeIcon className="w-8 h-8 text-slate-300 mb-2 transition-colors group-hover:text-white" />
              <span className="font-semibold text-slate-300 transition-colors group-hover:text-white">Resume</span>
            </button>
            
            {/* Quit */}
            <button
              onClick={onQuit}
              className="group flex flex-col items-center justify-center p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-red-500/20 hover:border-red-500/50 transition-all"
            >
              <QuitIcon className="w-8 h-8 text-slate-300 mb-2 transition-colors group-hover:text-red-400" />
              <span className="font-semibold text-slate-300 transition-colors group-hover:text-red-400">Quit Session</span>
            </button>
            
            {/* End & Get Feedback */}
            <button
              onClick={onConfirmEnd}
              className="group flex flex-col items-center justify-center p-4 bg-purple-600/20 rounded-lg border border-purple-500/50 hover:bg-purple-600/40 hover:border-purple-500 transition-all"
            >
              <FeedbackNavIcon className="w-8 h-8 text-purple-300 mb-2 transition-colors group-hover:text-white" />
              <span className="font-semibold text-purple-300 transition-colors group-hover:text-white">End & Get Feedback</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndSessionModal;
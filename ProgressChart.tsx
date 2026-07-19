

import React from 'react';
import { PracticeMode } from '../types.ts';
import { BotIcon } from './icons/BotIcon.tsx';
import FeatureListItem from './FeatureListItem.tsx';

interface PrePracticeInfoProps {
  mode: PracticeMode;
  onConfirm: () => void;
  onCancel: () => void;
}

const getTitle = (mode: PracticeMode) => {
  switch (mode) {
    case PracticeMode.INTERVIEW_HR:
      return 'HR / Behavioral Interview';
    case PracticeMode.INTERVIEW_TECHNICAL_SOFTWARE:
      return 'Software Engineer Interview';
    case PracticeMode.INTERVIEW_TECHNICAL_DATA:
      return 'Data Scientist Interview';
    case PracticeMode.INTERVIEW_TECHNICAL_DEVOPS:
      return 'DevOps Engineer Interview';
    case PracticeMode.INTERVIEW_TECHNICAL_WEB:
      return 'Web / Full Stack Interview';
    case PracticeMode.INTERVIEW_TECHNICAL_HARDWARE:
      return 'Hardware Engineer Interview';
    case PracticeMode.INTERVIEW_TECHNICAL_MECHANICAL:
      return 'Mechanical Engineer Interview';
    case PracticeMode.INTERVIEW_TECHNICAL_CIVIL:
      return 'Civil Engineer Interview';
    case PracticeMode.RANDOM:
      return 'Random Conversation';
    default:
      return 'Practice Session';
  }
};

const PrePracticeInfo: React.FC<PrePracticeInfoProps> = ({ mode, onConfirm, onCancel }) => {
  return (
    <div className="text-center max-w-2xl mx-auto p-4 animate-fadeInUp">
      <div className="relative w-24 h-24 mx-auto mb-6">
        <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl animate-pulse"></div>
        <BotIcon className="relative w-full h-full text-white" />
      </div>

      <h2 className="text-3xl font-extrabold mb-3 text-slate-100">
        Prepare for: <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{getTitle(mode)}</span>
      </h2>
      <p className="text-violet-300 mb-8">
        You are about to start a real-time, voice-only conversation with your AI partner.
      </p>

      <div className="bg-gradient-to-br from-violet-900/50 to-indigo-900/50 backdrop-blur-lg border border-white/10 rounded-xl p-6 text-left space-y-4 mb-8">
          <h3 className="text-lg font-bold text-white text-center">AI Chatbot Capabilities</h3>
          <FeatureListItem text="Fully dynamic and autonomous, requiring no predefined question sets." />
          <FeatureListItem text="Generates contextual, relevant follow-up questions based on your responses." />
          <FeatureListItem text="Maintains a focused, on-topic dialogue to simulate a real interview." />
          <FeatureListItem text="Provides detailed feedback on fluency, filler words, and vocabulary after the session." />
      </div>

      <div className="flex justify-center items-center space-x-4">
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-white/5 text-violet-200 font-semibold rounded-lg hover:bg-white/10 transition-all"
        >
          Go Back
        </button>
        <button
          onClick={onConfirm}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-transform hover:scale-105 shadow-[0_0_20px_theme(colors.purple.600/0.7)]"
        >
          Start Session
        </button>
      </div>
    </div>
  );
};

export default PrePracticeInfo;
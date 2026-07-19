

import React from 'react';
import { PracticeMode } from '../types.ts';
import PracticeCard from './PracticeCard.tsx';
import { BriefcaseIcon } from './icons/BriefcaseIcon.tsx';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon.tsx';

interface DashboardProps {
  onNavigate: (page: string) => void;
  onStartPractice: (mode: PracticeMode) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onStartPractice }) => {
  return (
    <div className="text-center w-full">
        <h2
            className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-500 to-fuchsia-500 animate-pulse-text animate-fadeInUp-staggered"
            style={{ animationDelay: '0.1s' }}
        >
            Welcome to Your Communication Gym
        </h2>
        <p
            className="text-lg text-violet-200 max-w-2xl mx-auto mb-12 animate-fadeInUp-staggered"
            style={{ animationDelay: '0.3s' }}
        >
            Choose a mode to start sharpening your speaking skills. The AI is ready when you are.
        </p>
        <div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto animate-fadeInUp-staggered"
            style={{ animationDelay: '0.5s' }}
        >
            <PracticeCard
            title="Interview Practice"
            description="Ace your next interview. Practice common HR and technical questions with an AI interviewer."
            icon={<BriefcaseIcon className="w-12 h-12 text-purple-400" />}
            onClick={() => onNavigate('interview')}
            glowColor="purple"
            />
            <PracticeCard
            title="Random Conversation"
            description="Improve your conversational flow. Chat with the AI about anything that comes to mind."
            icon={<ChatBubbleIcon className="w-12 h-12 text-purple-400" />}
            onClick={() => onStartPractice(PracticeMode.RANDOM)}
            glowColor="purple"
            />
        </div>
    </div>
  );
};

export default Dashboard;
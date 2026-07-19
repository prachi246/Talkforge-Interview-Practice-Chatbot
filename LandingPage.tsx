

import React from 'react';
import { PracticeMode } from '../types.ts';
import PracticeCard from './PracticeCard.tsx';
import { HRIcon } from './icons/HRIcon.tsx';
import { TechnicalIcon } from './icons/TechnicalIcon.tsx';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon.tsx';

interface InterviewModeSelectionProps {
  onStartPractice: (mode: PracticeMode) => void;
  onNavigate: (page: string) => void;
}

const InterviewModeSelection: React.FC<InterviewModeSelectionProps> = ({ onStartPractice, onNavigate }) => {
  return (
    <div className="text-center w-full max-w-4xl mx-auto">
    <div className="relative mb-8 text-center">
        <button 
        onClick={() => onNavigate('dashboard')} 
        className="absolute -top-2 left-0 p-2 text-violet-300 hover:text-white transition-colors"
        aria-label="Go back to dashboard"
        >
        <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-500">
        Choose Interview Type
        </h2>
    </div>
    <p className="text-lg text-violet-200 max-w-2xl mx-auto mb-12">
        Select the type of interview you'd like to practice. The AI will tailor its questions accordingly.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <PracticeCard
        title="HR / Behavioral"
        description="Practice common behavioral questions about teamwork, leadership, and conflict resolution."
        icon={<HRIcon className="w-12 h-12 text-cyan-400" />}
        onClick={() => onStartPractice(PracticeMode.INTERVIEW_HR)}
        glowColor="cyan"
        />
        <PracticeCard
        title="Technical Interview"
        description="Tackle questions on data structures, algorithms, and system design for a software engineer role."
        icon={<TechnicalIcon className="w-12 h-12 text-lime-400" />}
        onClick={() => onNavigate('technicalDomainSelection')}
        glowColor="lime"
        />
    </div>
    </div>
  );
};

export default InterviewModeSelection;
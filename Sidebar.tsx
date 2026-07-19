import React, { useState } from 'react';
import { SessionFeedbackData, FillerWord, GrammarCorrection, VocabularySuggestion } from '../types.ts';
import { GemIcon } from './icons/GemIcon.tsx';
import { XPIcon } from './icons/XPIcon.tsx';
import { StreakIcon } from './icons/StreakIcon.tsx';
import { CloseIcon } from './icons/CloseIcon.tsx';
import { VocabularyIcon } from './icons/VocabularyIcon.tsx';
import { GrammarIcon } from './icons/GrammarIcon.tsx';
import { FillerAnalysisIcon } from './icons/FillerAnalysisIcon.tsx';

interface SessionFeedbackProps {
    isLoading: boolean;
    feedbackData: SessionFeedbackData | null;
    earnedStats: { xp: number, gems: number };
    streak: number;
    onClose: () => void;
    onNavigateToReviews: () => void;
}

const LoadingState: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center p-8 h-96">
        <div className="w-12 h-12 border-4 border-purple-400 border-dashed rounded-full animate-spin border-t-transparent mb-4"></div>
        <h3 className="text-xl font-bold text-white">Analyzing Your Session...</h3>
        <p className="text-violet-300">The AI is crunching the numbers to give you personalized feedback.</p>
    </div>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode, icon: React.ReactNode }> = ({ active, onClick, children, icon }) => (
    <button
        onClick={onClick}
        className={`flex-1 flex items-center justify-center p-3 text-sm font-semibold transition-all duration-200 border-b-2 ${
            active
                ? 'text-purple-400 border-purple-400'
                : 'text-violet-300 border-transparent hover:bg-white/5 hover:text-white'
        }`}
    >
        <div className="mr-2">{icon}</div>
        {children}
    </button>
);

const GrammarCorrectionItem: React.FC<{ item: GrammarCorrection }> = ({ item }) => (
    <div className="bg-black/10 rounded-lg p-3">
        <div className="flex flex-wrap items-baseline gap-x-2 text-sm">
            <p className="text-violet-300">
                <span className="font-mono text-sky-400 line-through">"{item.error}"</span>
            </p>
            <p className="text-slate-400 flex-shrink-0">→</p>
            <p className="text-violet-200">
                 <span className="font-mono text-purple-400">"{item.correction}"</span>
            </p>
        </div>
        <p className="text-xs text-violet-400 mt-2">({item.explanation})</p>
    </div>
);

const VocabularySuggestionItem: React.FC<{ item: VocabularySuggestion }> = ({ item }) => (
    <div className="bg-black/10 rounded-lg p-3 space-y-2 text-base">
        <p className="text-slate-400 italic">"{item.context}"</p>
        <div className="flex items-baseline space-x-2 pt-2 border-t border-white/10">
            <p className="text-sky-400 font-mono flex-shrink-0">{item.word}</p>
            <p className="text-slate-500">→</p>
            <p className="text-purple-400 font-mono font-semibold">{item.alternatives.join(', ')}</p>
        </div>
    </div>
);

const FillerWordItem: React.FC<{ item: FillerWord }> = ({ item }) => (
    <div className="bg-black/10 rounded-lg p-3">
        <p className="text-sm text-violet-200"><span className="font-bold text-purple-400">"{item.word}"</span> used {item.count} time{item.count > 1 ? 's' : ''}</p>
        {item.alternatives && item.alternatives.length > 0 &&
            <p className="text-xs text-violet-400 mt-1">Try pausing or using alternatives like: {item.alternatives.join(', ')}.</p>
        }
    </div>
);


const SessionFeedback: React.FC<SessionFeedbackProps> = ({ isLoading, feedbackData, earnedStats, streak, onClose, onNavigateToReviews }) => {
    const [activeTab, setActiveTab] = useState<'grammar' | 'vocabulary' | 'fillerWords'>('grammar');

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-gradient-to-br from-violet-900/80 to-indigo-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl animate-fadeInUp max-h-[90vh] flex flex-col">
                <header className="flex-shrink-0 flex justify-between items-center p-4 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">Session Complete!</h2>
                    <button onClick={onClose} className="p-2 text-violet-300 hover:text-white hover:bg-white/5 rounded-full">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>
                
                <div className="flex-1 overflow-y-auto scrollbar-thin">
                    {isLoading ? (
                        <LoadingState />
                    ) : feedbackData ? (
                        <div className="p-6 space-y-6">
                            {/* Rewards */}
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="p-3 bg-black/20 rounded-lg border border-white/10"><div className="flex items-center justify-center space-x-2"><XPIcon className="w-5 h-5 text-purple-400" /> <span className="font-bold text-white">+{earnedStats.xp} XP</span></div></div>
                                <div className="p-3 bg-black/20 rounded-lg border border-white/10"><div className="flex items-center justify-center space-x-2"><GemIcon className="w-5 h-5 text-cyan-400" /> <span className="font-bold text-white">+{earnedStats.gems} Gems</span></div></div>
                                <div className="p-3 bg-black/20 rounded-lg border border-white/10"><div className="flex items-center justify-center space-x-2"><StreakIcon className="w-5 h-5 text-amber-400" /> <span className="font-bold text-white">{streak} Day Streak</span></div></div>
                            </div>

                             {/* Overall Feedback */}
                             <div>
                                <h4 className="font-semibold text-white mb-2 text-lg">Overall Feedback</h4>
                                <p className="text-violet-200 bg-black/20 p-4 rounded-lg border border-white/10 whitespace-pre-wrap">{feedbackData.overallFeedback}</p>
                            </div>

                            {/* Detailed Tabs */}
                            <div>
                                <div className="border-b border-white/10 flex">
                                    <TabButton active={activeTab === 'grammar'} onClick={() => setActiveTab('grammar')} icon={<GrammarIcon className="w-4 h-4" />}>Grammar</TabButton>
                                    <TabButton active={activeTab === 'fillerWords'} onClick={() => setActiveTab('fillerWords')} icon={<FillerAnalysisIcon className="w-4 h-4" />}>Filler Words</TabButton>
                                    <TabButton active={activeTab === 'vocabulary'} onClick={() => setActiveTab('vocabulary')} icon={<VocabularyIcon className="w-4 h-4" />}>Vocabulary</TabButton>
                                </div>
                                <div className="pt-4 space-y-3">
                                    {activeTab === 'grammar' && (feedbackData.grammarCorrections.length > 0 ? feedbackData.grammarCorrections.map((item, i) => <GrammarCorrectionItem key={i} item={item} />) : <p className="text-violet-300 text-center py-4">No grammar mistakes found. Excellent!</p>)}
                                    {activeTab === 'fillerWords' && (feedbackData.fillerWords.length > 0 ? feedbackData.fillerWords.map((item, i) => <FillerWordItem key={i} item={item} />) : <p className="text-violet-300 text-center py-4">No filler words detected. Great job!</p>)}
                                    {activeTab === 'vocabulary' && (feedbackData.structuredVocabulary.length > 0 ? feedbackData.structuredVocabulary.map((item, i) => <VocabularySuggestionItem key={i} item={item} />) : <p className="text-violet-300 text-center py-4">No specific vocabulary suggestions. Your word choice was strong!</p>)}
                                </div>
                            </div>

                        </div>
                    ) : null}
                </div>

                <footer className="flex-shrink-0 flex justify-end items-center space-x-4 p-4 border-t border-white/10">
                    <button onClick={onClose} className="px-5 py-2 bg-white/5 text-violet-200 font-semibold rounded-lg hover:bg-white/10 transition-all">Close</button>
                    <button onClick={onNavigateToReviews} className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all">See Full History</button>
                </footer>
            </div>
        </div>
    );
};

export default SessionFeedback;
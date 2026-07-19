import React, { useState } from 'react';
import { SessionFeedbackData, FillerWord, GrammarCorrection, SuggestedAnswer, PronunciationCorrection, VocabularySuggestion } from '../types.ts';
import { FillerAnalysisIcon } from './icons/FillerAnalysisIcon.tsx';
import { ChevronDownIcon } from './icons/ChevronDownIcon.tsx';
import { VocabularyIcon } from './icons/VocabularyIcon.tsx';
import { GrammarIcon } from './icons/GrammarIcon.tsx';
import { LightbulbIcon } from './icons/LightbulbIcon.tsx';
import { PronunciationIcon } from './icons/PronunciationIcon.tsx';

interface SessionHistoryCardProps {
  session: SessionFeedbackData;
}

const FillerWordItem: React.FC<{ item: FillerWord }> = ({ item }) => (
    <div className="bg-white/5 rounded-lg p-3">
        <p><span className="font-bold text-purple-300">"{item.word}"</span> used {item.count} time{item.count > 1 ? 's' : ''}</p>
        {item.alternatives && item.alternatives.length > 0 && (
            <p className="text-base text-slate-400 mt-1">Try pausing or using alternatives like: {item.alternatives.join(', ')}.</p>
        )}
    </div>
);

const GrammarCorrectionItem: React.FC<{ item: GrammarCorrection }> = ({ item }) => (
    <div className="bg-white/5 rounded-lg p-3">
        <div className="flex flex-wrap items-baseline gap-x-2 text-base">
            <p className="text-slate-400">
                <span className="font-mono text-sky-400 line-through">"{item.error}"</span>
            </p>
            <p className="text-slate-500 flex-shrink-0">→</p>
            <p className="text-slate-300">
                <span className="font-mono text-purple-400">"{item.correction}"</span>
            </p>
        </div>
        <p className="text-xs text-slate-500 mt-2">({item.explanation})</p>
    </div>
);

const PronunciationCorrectionItem: React.FC<{ item: PronunciationCorrection }> = ({ item }) => (
    <div className="bg-white/5 rounded-lg p-3">
        <p className="text-base text-slate-400">Word: <span className="font-mono text-sky-400">"{item.word}"</span></p>
        <p className="text-base text-slate-300">Try saying: <span className="font-mono text-purple-400">"{item.correction}"</span></p>
        <p className="text-xs text-slate-500 mt-1">Tip: {item.explanation}</p>
    </div>
);

const SuggestedAnswerItem: React.FC<{ item: SuggestedAnswer }> = ({ item }) => (
    <div className="bg-white/5 rounded-lg p-3 space-y-2">
        <h5 className="font-semibold text-slate-300">Question: "{item.question}"</h5>
        <div className="pt-2 border-t border-white/10">
            <h6 className="font-semibold text-purple-300 text-sm mb-1">Model Answer:</h6>
            <p className="text-slate-300 text-base whitespace-pre-wrap">{item.suggestedAnswer}</p>
        </div>
    </div>
);

const VocabularySuggestionItem: React.FC<{ item: VocabularySuggestion }> = ({ item }) => (
    <div className="bg-white/5 rounded-lg p-3 space-y-2 text-base">
        <p className="text-slate-400 italic">"{item.context}"</p>
        <div className="flex items-baseline space-x-2 pt-2 border-t border-white/10">
            <p className="text-sky-400 font-mono flex-shrink-0">{item.word}</p>
            <p className="text-slate-500">→</p>
            <p className="text-purple-400 font-mono font-semibold">{item.alternatives.join(', ')}</p>
        </div>
    </div>
);


const SessionHistoryCard: React.FC<SessionHistoryCardProps> = ({ session }) => {
  const [isOpen, setIsOpen] = useState(false);

  const formattedDate = new Date(session.date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const hasDetailedFeedback = session.fillerWords.length > 0 || session.grammarCorrections.length > 0 || session.pronunciationCorrections.length > 0 || (session.suggestedAnswers && session.suggestedAnswers.length > 0) || (session.structuredVocabulary && session.structuredVocabulary.length > 0);

  return (
    <div className="bg-gradient-to-br from-violet-900/50 to-indigo-900/50 backdrop-blur-lg border border-white/10 rounded-xl transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full p-6 text-left">
        <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-400">{formattedDate}</p>
              <h3 className="text-xl font-bold text-white mt-1">Practice Session Review</h3>
            </div>
             <div className="flex items-center space-x-2 text-slate-400">
                <span>{isOpen ? 'Hide' : 'Show'} Details</span>
                <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
             </div>
        </div>
        
        {isOpen && (
            <div className="mt-6 pt-6 border-t border-white/10 space-y-6 animate-fadeInUp">
                <div>
                    <h4 className="font-semibold text-white mb-3 text-lg">Overall Feedback</h4>
                    <p className="text-slate-300 whitespace-pre-wrap text-base">{session.overallFeedback}</p>
                </div>
                
                {hasDetailedFeedback && (
                    <div className="grid grid-cols-1 gap-8">
                        {session.suggestedAnswers && session.suggestedAnswers.length > 0 && (
                             <div className="space-y-3">
                                <div className="flex items-center space-x-2"><LightbulbIcon className="w-5 h-5 text-amber-400" /><h4 className="font-semibold text-white">Suggested Answers</h4></div>
                                {session.suggestedAnswers.map((sa, i) => <SuggestedAnswerItem key={i} item={sa} />)}
                            </div>
                        )}
                        {session.structuredVocabulary && session.structuredVocabulary.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2"><VocabularyIcon className="w-5 h-5 text-cyan-400" /><h4 className="font-semibold text-white">Vocabulary Suggestions</h4></div>
                                {session.structuredVocabulary.map((vs, i) => <VocabularySuggestionItem key={i} item={vs} />)}
                            </div>
                        )}
                        {session.pronunciationCorrections.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2"><PronunciationIcon className="w-5 h-5 text-rose-400" /><h4 className="font-semibold text-white">Pronunciation Tips</h4></div>
                                {session.pronunciationCorrections.map((pc, i) => <PronunciationCorrectionItem key={i} item={pc} />)}
                            </div>
                        )}
                        {session.fillerWords.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2"><FillerAnalysisIcon className="w-5 h-5 text-purple-400" /><h4 className="font-semibold text-white">Filler Words</h4></div>
                                {session.fillerWords.map((fw, i) => <FillerWordItem key={i} item={fw} />)}
                            </div>
                        )}
                        {session.grammarCorrections.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2"><GrammarIcon className="w-5 h-5 text-cyan-400" /><h4 className="font-semibold text-white">Grammar Corrections</h4></div>
                                {session.grammarCorrections.map((gc, i) => <GrammarCorrectionItem key={i} item={gc} />)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        )}
      </button>
    </div>
  );
};

export default SessionHistoryCard;
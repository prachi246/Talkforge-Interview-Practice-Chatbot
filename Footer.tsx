

import React from 'react';
import { SessionFeedbackData } from '../types.ts';
import SessionHistoryCard from './SessionHistoryCard.tsx';
import Gauge from './Gauge.tsx';
import ProgressChart from './ProgressChart.tsx';
import { FluencyIcon } from './icons/FluencyIcon.tsx';
import { FeedbackNavIcon } from './icons/FeedbackNavIcon.tsx';

interface ProgressHistoryPageProps {
  lastReview: SessionFeedbackData | null;
  sessionHistory: SessionFeedbackData[];
  activePage: 'fluency' | 'reviews';
}

const ProgressHistoryPage: React.FC<ProgressHistoryPageProps> = ({ lastReview, sessionHistory, activePage }) => {
  const content = () => {
    if (activePage === 'fluency') {
      return (
        <div className="w-full max-w-6xl mx-auto animate-fadeInUp py-8">
          <div className="text-center mb-12">
            <FluencyIcon className="w-16 h-16 mx-auto text-purple-400 mb-4" />
            <h2 className="text-4xl md:text-5xl font-extrabold text-white">
              Fluency & Accuracy
            </h2>
            <p className="text-lg text-slate-400 mt-2">
              Review your core speaking metrics from your last session and track your progress over time.
            </p>
          </div>

          {lastReview ? (
            <div className="space-y-12">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">Last Session Scores</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Gauge score={lastReview.clarityScore} label="Clarity" />
                  <Gauge score={lastReview.fluencyScore} label="Fluency" />
                  <Gauge score={lastReview.pronunciationAccuracyScore} label="Pronunciation" />
                </div>
              </div>
              <div>
                <ProgressChart data={sessionHistory} />
              </div>
            </div>
          ) : (
            <div className="text-center bg-gradient-to-br from-violet-900/50 to-indigo-900/50 backdrop-blur-lg border border-white/10 rounded-xl p-12">
              <h3 className="text-2xl font-bold text-white">No Data Yet!</h3>
              <p className="text-slate-400 mt-2">Complete a session to see your performance metrics here.</p>
            </div>
          )}
        </div>
      );
    }

    // Fallback to 'reviews' page
    return (
      <div className="w-full max-w-4xl mx-auto animate-fadeInUp py-8">
        <div className="text-center mb-12">
          <FeedbackNavIcon className="w-16 h-16 mx-auto text-cyan-400 mb-4" />
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            Last Session Review
          </h2>
          <p className="text-lg text-slate-400 mt-2">
            Review the detailed feedback from your most recent practice session.
          </p>
        </div>

        <div className="space-y-6">
          {lastReview ? (
            <SessionHistoryCard session={lastReview} />
          ) : (
            <div className="text-center bg-gradient-to-br from-violet-900/50 to-indigo-900/50 backdrop-blur-lg border border-white/10 rounded-xl p-12">
                <h3 className="text-2xl font-bold text-white">No Review Yet!</h3>
                <p className="text-slate-400 mt-2">Complete a session to see your detailed feedback here.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
      <>
        {content()}
      </>
  );
};

export default ProgressHistoryPage;
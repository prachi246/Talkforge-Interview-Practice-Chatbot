import React from 'react';
import LandingHeader from './LandingHeader.tsx';
import FeatureCard from './FeatureCard.tsx';
import { HeroIllustration } from './HeroIllustration.tsx';
import { LightningIcon } from './icons/LightningIcon.tsx';
import { UsersIcon } from './icons/UsersIcon.tsx';
import { FeedbackIcon } from './icons/FeedbackIcon.tsx';
import { TrophyIcon } from './icons/TrophyIcon.tsx';
import { FillerWordIcon } from './icons/FillerWordIcon.tsx';
import { StarIcon } from './icons/StarIcon.tsx';

interface LandingPageProps {
  onLaunchApp: (view: 'login' | 'signup') => void;
}

// New component for the holographic wave background effect
const HolographicWave: React.FC = () => (
  <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
    <div className="absolute top-1/2 left-1/2 w-[200vw] h-[200vw] lg:w-[150vw] lg:h-[150vw] -translate-x-1/2 -translate-y-1/2">
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 via-blue-600/30 to-transparent rounded-full animate-holographic-wave"></div>
    </div>
  </div>
);


const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp }) => {
  return (
    <div className="text-white min-h-screen bg-transparent overflow-x-hidden relative">
      <HolographicWave />
      <LandingHeader onNavigate={onLaunchApp} />

      <main>
        {/* Hero Section */}
        <section className="relative pt-36 pb-24 md:pt-48 md:pb-32 overflow-hidden">
          <div className="container mx-auto px-6 relative">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-600">
                  Unlock Your Voice. Master Every Conversation.
                </h1>
                <p className="text-lg md:text-xl text-violet-200 max-w-xl mx-auto md:mx-0 mb-10">
                  Whether you're preparing for a critical interview or aiming to speak with greater fluency, TalkForge is your personal AI coach for mastering the art of conversation.
                </p>
                <button
                  onClick={() => onLaunchApp('signup')}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg text-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-2xl shadow-purple-500/30"
                >
                  Start Practicing Now
                </button>
              </div>
              <div className="relative hidden md:block">
                 <HeroIllustration className="w-full h-auto max-w-lg mx-auto" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-6 relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white">Why TalkForge?</h2>
              <p className="text-violet-300 mt-4 text-lg max-w-2xl mx-auto">Everything you need to become a confident and articulate speaker.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<LightningIcon className="w-8 h-8 text-purple-400" />}
                title="Real-Time Conversation"
                description="Engage in natural, low-latency voice conversations with our advanced AI."
              />
              <FeatureCard
                icon={<UsersIcon className="w-8 h-8 text-cyan-400" />}
                title="Realistic Scenarios"
                description="Practice for job interviews, public speaking, or casual chats with tailored AI personas."
              />
              <FeatureCard
                icon={<FeedbackIcon className="w-8 h-8 text-amber-400" />}
                title="Instant Feedback"
                description="Get live transcription and analysis of your speech to identify areas for improvement."
              />
               <FeatureCard
                icon={<TrophyIcon className="w-8 h-8 text-lime-400" />}
                title="Track Your Progress"
                description="Monitor your improvement over time with detailed stats on streak, XP, and more."
              />
              <FeatureCard
                icon={<FillerWordIcon className="w-8 h-8 text-pink-400" />}
                title="Filler Word Detection"
                description="Our AI helps you identify and reduce the use of filler words like 'um' and 'like'."
              />
               <FeatureCard
                icon={<StarIcon className="w-8 h-8 text-yellow-400" />}
                title="Build Confidence"
                description="Practice in a safe, non-judgmental environment to build the confidence you need."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-violet-500/20">
        <div className="container mx-auto px-6 text-center text-violet-400">
          <p>&copy; {new Date().getFullYear()} TalkForge. All Rights Reserved.</p>
          <p className="mt-2 text-sm">
            Questions or feedback? Reach out at{' '}
            <a href="mailto:support@talkforge.ai" className="text-violet-300 hover:text-purple-400 transition-colors">
                support@talkforge.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
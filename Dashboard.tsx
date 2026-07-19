import React, { useMemo } from 'react';
import { PracticeMode, ConnectionState, TranscriptEntry, SessionStatus } from '../types.ts';
import { StopIcon } from './icons/StopIcon.tsx';
import { BotIcon } from './icons/BotIcon.tsx';
import { PermissionDeniedIcon } from './icons/PermissionDeniedIcon.tsx';
import MicrophoneTroubleshooting from './MicrophoneTroubleshooting.tsx';
import { ClockIcon } from './icons/ClockIcon.tsx';
import { ChatbotAvatarIcon } from './icons/ChatbotAvatarIcon.tsx';
import { MicIcon } from './icons/MicIcon.tsx';

interface ConversationViewProps {
  mode: PracticeMode;
  onEndPractice: () => void;
  connectionState: ConnectionState;
  transcript: TranscriptEntry[];
  sessionStatus: SessionStatus;
  sessionDuration: number;
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

export const RANDOM_CONVERSATION_DURATION_SECONDS = 300; // 5 minutes
export const INTERVIEW_DURATION_SECONDS = 600; // 10 minutes

const isInterviewMode = (mode: PracticeMode): boolean => mode.startsWith('INTERVIEW_');

const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const ConversationView: React.FC<ConversationViewProps> = ({ mode, onEndPractice, connectionState, transcript, sessionStatus, sessionDuration }) => {
  
  const isSessionActive = connectionState === ConnectionState.CONNECTED && sessionStatus === 'IN_PROGRESS';

  const currentStatus = useMemo(() => {
    if (sessionStatus === 'GENERATING_GREETING') {
      // Use animated avatar during greeting generation
      return { icon: <ChatbotAvatarIcon className="w-24 h-24 animate-glow-pop" />, text: "AI is preparing your first question..." };
    }
    
    if (sessionStatus === 'ANALYZING') {
        return { icon: <div className="w-16 h-16 border-4 border-purple-400 border-dashed rounded-full animate-spin border-t-transparent"></div>, text: "Analyzing your performance...", description: "Please wait while we generate your feedback." };
    }

    switch (connectionState) {
        case ConnectionState.CONNECTING:
            return { icon: <div className="w-16 h-16 border-4 border-purple-400 border-dashed rounded-full animate-spin border-t-transparent"></div>, text: "Connecting..." };
        case ConnectionState.SESSION_EXPIRED:
             return { icon: <PermissionDeniedIcon className="w-16 h-16 text-amber-400" />, text: "Session Ended", description: "The time limit for this practice is up. Please end the session to get your feedback." };
        case ConnectionState.ERROR:
            return { icon: <PermissionDeniedIcon className="w-16 h-16 text-red-400" />, text: "Connection Error", description: "Something went wrong. Please end the session and try again." };
        case ConnectionState.PERMISSION_DENIED:
            return null;
        case ConnectionState.IDLE:
        case ConnectionState.DISCONNECTING:
            return { icon: <BotIcon className="w-16 h-16" />, text: "Session Ended" };
        case ConnectionState.RECONNECTING: // Keep the UI stable during reconnect
        case ConnectionState.CONNECTED:
            const lastEntry = transcript.length > 0 ? transcript[transcript.length - 1] : null;
            // When the user is actively speaking.
            if (lastEntry && lastEntry.source === 'USER' && !lastEntry.isFinal) {
                return { icon: <MicIcon className="w-24 h-24 text-purple-400 animate-pulse-mic" />, text: "Listening..." };
            }
            // When AI is speaking, show animated avatar
            if (lastEntry && lastEntry.source === 'AI' && !lastEntry.isFinal) {
                return { icon: <ChatbotAvatarIcon className="w-24 h-24 animate-glow-pop" />, text: "AI is Speaking..." };
            }
            // When AI is listening for the user to speak.
            return { icon: <ChatbotAvatarIcon className="w-24 h-24" />, text: "AI is Listening..." };
        default:
            return null;
    }
  }, [connectionState, sessionStatus, transcript]);

  const displayedDuration = useMemo(() => {
    if (mode === PracticeMode.RANDOM) {
        const timeLeft = Math.max(0, RANDOM_CONVERSATION_DURATION_SECONDS - sessionDuration);
        return formatDuration(timeLeft);
    }
    if (isInterviewMode(mode)) {
        const timeLeft = Math.max(0, INTERVIEW_DURATION_SECONDS - sessionDuration);
        return formatDuration(timeLeft);
    }
    return formatDuration(sessionDuration);
  }, [sessionDuration, mode]);


  if (connectionState === ConnectionState.PERMISSION_DENIED) {
    return (
      <div className="flex flex-col flex-grow w-full max-w-4xl mx-auto bg-gradient-to-br from-violet-900/80 to-indigo-900/80 backdrop-blur-lg rounded-t-xl overflow-y-auto scrollbar-thin shadow-2xl">
        <header className="flex-shrink-0 p-4 border-b border-white/10">
            <h2 className="text-xl font-bold text-center text-white">{getTitle(mode)}</h2>
        </header>
        <main className="flex-1 p-4 md:p-6 flex flex-col items-center justify-center">
             <div className="text-center p-8 text-amber-400">
             <PermissionDeniedIcon className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Microphone Access Denied</h3>
            <p className="mb-6 max-w-lg mx-auto text-violet-200">TalkForge needs microphone access to start a session. Please follow the steps below to enable it.</p>
            <MicrophoneTroubleshooting />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow w-full max-w-4xl mx-auto bg-gradient-to-br from-violet-900/80 to-indigo-900/80 backdrop-blur-lg rounded-t-xl overflow-hidden shadow-2xl">
        <header className="flex-shrink-0 p-4 border-b border-white/10 flex justify-between items-center">
            <div className="w-1/3"></div>
            <h2 className="w-1/3 text-xl font-bold text-center text-white whitespace-nowrap">{getTitle(mode)}</h2>
            <div className="w-1/3 flex justify-end items-center">
                <div className="flex items-center space-x-2 p-2 bg-black/20 rounded-full border border-white/10">
                    <ClockIcon className="w-5 h-5 text-cyan-400" />
                    <span className="font-semibold text-sm text-white font-mono">{displayedDuration}</span>
                </div>
            </div>
        </header>
        <main className="flex-1 p-4 md:p-6 flex flex-col items-center justify-center text-center">
            {currentStatus && (
                <div className="flex flex-col items-center justify-center space-y-6 text-violet-200 animate-fadeInUp">
                    <div className={`relative flex items-center justify-center w-40 h-40 rounded-full`}>
                       <div className="relative">
                        {currentStatus.icon}
                       </div>
                    </div>
                    <p className="text-2xl font-semibold">{currentStatus.text}</p>
                    {currentStatus.description && <p className="text-violet-300 max-w-sm">{currentStatus.description}</p>}
                </div>
            )}
        </main>
        <footer className="flex-shrink-0 p-4 border-t border-white/10 bg-black/20">
            <div className="flex items-center justify-center space-x-4">
                <button
                    onClick={onEndPractice}
                    disabled={connectionState === ConnectionState.CONNECTING || connectionState === ConnectionState.DISCONNECTING || sessionStatus === 'ANALYZING'}
                    className="px-8 py-3 bg-rose-600 text-white font-bold rounded-full hover:bg-rose-700 transition-all flex items-center space-x-2 shadow-[0_0_20px_theme(colors.rose.600/0.7)] disabled:bg-rose-900 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    <StopIcon className="w-6 h-6" />
                    <span>End Session</span>
                </button>
            </div>
             <div className="text-center text-xs text-violet-400 mt-3 h-4">
                {connectionState === ConnectionState.RECONNECTING ? (
                    <div className="flex items-center justify-center text-amber-400 animate-pulse">
                        <div className="w-3 h-3 border-2 border-amber-400 border-dashed rounded-full animate-spin border-t-transparent mr-2"></div>
                        Connection lost. Attempting to reconnect...
                    </div>
                ) : sessionStatus === 'ANALYZING' ? (
                     "Feedback generation is in progress."
                ) : isSessionActive ? (
                    "Your session is live. Respond when the AI is listening."
                ) : (
                    "Session is not active."
                )}
            </div>
        </footer>
    </div>
  );
};

export default ConversationView;
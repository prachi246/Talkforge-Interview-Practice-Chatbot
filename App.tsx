import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { doc, getDoc, setDoc, addDoc, collection, query, orderBy, limit, getDocs, Timestamp, deleteDoc } from 'firebase/firestore';
import { auth, db } from './firebase.ts';

import { useSpeechToSpeech } from './hooks/useSpeechToSpeech.ts';

import Sidebar from './components/Sidebar.tsx';
import Header from './components/Header.tsx';
import Dashboard from './components/Dashboard.tsx';
import ConversationView, { RANDOM_CONVERSATION_DURATION_SECONDS, INTERVIEW_DURATION_SECONDS } from './components/ConversationView.tsx';
import LoadingSpinner from './components/LoadingSpinner.tsx';
import LandingPage from './components/LandingPage.tsx';
import LoginPage from './components/LoginPage.tsx';
import InterviewModeSelection from './components/InterviewModeSelection.tsx';
import PrePracticeInfo from './components/PrePracticeInfo.tsx';
import SessionFeedback from './components/SessionFeedback.tsx';
import LeaderboardPage from './components/LeaderboardPage.tsx';
import FluencyAccuracyPage from './components/FluencyAccuracyPage.tsx';
import TechnicalDomainSelection from './components/TechnicalDomainSelection.tsx';
import EndSessionModal from './components/EndSessionModal.tsx';

import { PracticeMode, UserStats, TranscriptEntry, SessionStatus, SessionFeedbackData } from './types.ts';


// --- Greeting Generation Helpers ---
const getFirstQuestion = (mode: PracticeMode): string => {
  switch (mode) {
    case PracticeMode.INTERVIEW_HR:
        return "To start, can you tell me a little bit about yourself?";
    case PracticeMode.INTERVIEW_TECHNICAL_SOFTWARE:
      return "Can you explain the difference between an array and a linked list?";
    case PracticeMode.INTERVIEW_TECHNICAL_DATA:
      return "Could you explain the bias-variance tradeoff in machine learning?";
    case PracticeMode.INTERVIEW_TECHNICAL_DEVOPS:
        return "What is the purpose of a CI/CD pipeline?";
    case PracticeMode.INTERVIEW_TECHNICAL_WEB:
        return "Can you explain the difference between client-side and server-side rendering?";
    case PracticeMode.INTERVIEW_TECHNICAL_HARDWARE:
        return "Can you begin by explaining the difference between a MUX and a DEMUX?";
    case PracticeMode.INTERVIEW_TECHNICAL_MECHANICAL:
        return "Can you explain the First Law of Thermodynamics?";
    case PracticeMode.INTERVIEW_TECHNICAL_CIVIL:
        return "Can you start by explaining the concept of tensile strength in materials?";
    case PracticeMode.RANDOM:
      return "What's on your mind today?";
    default:
      return "What would you like to talk about today?";
  }
};

const generateGreeting = async (mode: PracticeMode): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const greeting = "Hello";
    const firstQuestion = getFirstQuestion(mode);
    const prompt = `You are an AI practice partner. Your task is to generate a single, friendly opening line to start a conversation. The response must be text only, concise, and welcoming. Start with the greeting "${greeting}", then ask the question: "${firstQuestion}"`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim().replace(/["*]/g, '');
    } catch (error) {
        console.error("Error generating greeting:", error);
        return `${greeting}! I'm ready to begin. ${firstQuestion}`;
    }
};

const playGreeting = (text: string): Promise<void> => {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      console.warn("Web Speech API (Synthesis) not supported. Bypassing greeting playback.");
      resolve();
      return;
    }
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const googleVoice = voices.find(voice => voice.name.includes('Google') && voice.lang.startsWith('en'));
    if (googleVoice) {
      utterance.voice = googleVoice;
    }
    utterance.onend = () => resolve();
    utterance.onerror = (event) => {
      console.error("Browser speech synthesis error:", event);
      resolve(); // Resolve anyway to not block the session
    };
    window.speechSynthesis.speak(utterance);
  });
};

const getPracticeModeName = (mode: PracticeMode): string => {
    return mode.toString().replace(/_/g, ' ').replace('INTERVIEW TECHNICAL', '').replace('INTERVIEW', '').trim();
}

// --- DYNAMIC FEEDBACK GENERATION ---
const getSessionFeedback = async (transcript: TranscriptEntry[], mode: PracticeMode, sessionDuration: number): Promise<SessionFeedbackData> => {
  const userTranscript = transcript
    .filter(entry => entry.source === 'USER' && entry.isFinal)
    .map(entry => entry.text)
    .join(' ');

  if (!userTranscript.trim()) {
    return {
      date: new Date().toISOString(), clarityScore: 0, fluencyScore: 0, pronunciationAccuracyScore: 0, speechRateWPM: 0,
      fillerWords: [], grammarCorrections: [], pronunciationCorrections: [], structuredVocabulary: [], suggestedAnswers: [],
      vocabularySummary: "No speech was detected.",
      overallFeedback: "It looks like you didn't speak during this session. To get feedback, make sure to respond to the AI's questions. Let's try again!"
    };
  }

  const practiceModeName = getPracticeModeName(mode);

  const feedbackSchema = {
    type: Type.OBJECT,
    properties: {
        clarityScore: { type: Type.INTEGER, description: "Score from 0-100 for speech clarity." },
        fluencyScore: { type: Type.INTEGER, description: "Score from 0-100 for speech fluency." },
        pronunciationAccuracyScore: { type: Type.INTEGER, description: "Score from 0-100 for pronunciation accuracy." },
        fillerWords: { type: Type.ARRAY, description: "List of detected filler words, their counts, and suggested alternatives.", items: { type: Type.OBJECT, properties: { word: { type: Type.STRING }, count: { type: Type.INTEGER }, alternatives: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ['word', 'count', 'alternatives'] } },
        grammarCorrections: { type: Type.ARRAY, description: "List of grammatical errors with corrections and explanations.", items: { type: Type.OBJECT, properties: { error: { type: Type.STRING }, correction: { type: Type.STRING }, explanation: { type: Type.STRING } }, required: ['error', 'correction', 'explanation'] } },
        structuredVocabulary: { type: Type.ARRAY, description: "A list of specific vocabulary suggestions.", items: { type: Type.OBJECT, properties: { word: { type: Type.STRING }, context: { type: Type.STRING }, alternatives: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ['word', 'context', 'alternatives'] } },
        overallFeedback: { type: Type.STRING, description: "A constructive, encouraging summary of performance." },
    },
    required: ['clarityScore', 'fluencyScore', 'pronunciationAccuracyScore', 'fillerWords', 'grammarCorrections', 'structuredVocabulary', 'overallFeedback'],
  };

  const prompt = `
      You are an expert communication coach analyzing a user's performance in a practice session.
      The user was practicing for a "${practiceModeName}" session. The total duration of their speech was approximately ${sessionDuration} seconds.
      Here is the full transcript of what the user said:
      --- USER ---
      ${userTranscript}
      ---
      Please analyze the transcript and provide feedback. Your response MUST be a JSON object matching the provided schema.
      - **Scores**: Provide scores from 0-100 for clarity, fluency, and pronunciation.
      - **Filler Words**: Identify filler words like "um", "uh", "like", "you know". Provide their count and suggest alternatives (e.g., pausing). If none, return an empty array.
      - **Grammar Corrections**: For the 'grammarCorrections' field, identify sentences with grammatical errors. Provide the original incorrect sentence, the corrected version, and a brief explanation. If there are no grammatical errors, return an empty array.
      - **Structured Vocabulary**: For the 'structuredVocabulary' field, identify specific, individual words from the user's transcript that are basic, repetitive, or could be stronger (e.g., "good" could be "effective," "beneficial," "positive"). For each identified word, provide the original word, the full sentence it was used in as 'context', and a list of more descriptive or professional synonyms/alternatives. Do NOT rewrite the entire sentence in this field; focus only on suggesting alternative words. If vocabulary is strong, return an empty array.
      - **Overall Feedback**: Be constructive and base suggestions on the user's text.
  `;
  
  try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash', contents: prompt,
          config: { responseMimeType: 'application/json', responseSchema: feedbackSchema },
      });
      const feedbackJson = JSON.parse(response.text);
      return { 
        date: new Date().toISOString(), 
        ...feedbackJson, 
        speechRateWPM: 0, 
        pronunciationCorrections: [], 
        suggestedAnswers: [], 
        vocabularySummary: "" 
      };
  } catch (error) {
      console.error("Error generating feedback from Gemini:", error);
      return {
          date: new Date().toISOString(), clarityScore: 50, fluencyScore: 50, pronunciationAccuracyScore: 50, speechRateWPM: 0, fillerWords: [],
          grammarCorrections: [], pronunciationCorrections: [], suggestedAnswers: [], vocabularySummary: "", structuredVocabulary: [],
          overallFeedback: "Sorry, an error occurred while generating your feedback. This might be due to a network issue. We've awarded you some points for your effort!"
      };
  }
};

const isInterviewMode = (mode: PracticeMode | null): boolean => mode ? mode.startsWith('INTERVIEW_') : false;

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [userStats, setUserStats] = useState<UserStats>({ gems: 0, xp: 0, streak: 0, lastPracticeTimestamp: null });
    const [view, setView] = useState<'landing' | 'login' | 'signup' | 'app'>('landing');
    const [page, setPage] = useState('dashboard');
    const [activePracticeMode, setActivePracticeMode] = useState<PracticeMode | null>(null);
    const [sessionStatus, setSessionStatus] = useState<SessionStatus>('IDLE');
    const [sessionDuration, setSessionDuration] = useState(0);
    const sessionTimerRef = useRef<number | null>(null);

    const [showPrePracticeInfo, setShowPrePracticeInfo] = useState<PracticeMode | null>(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
    const [lastFeedbackData, setLastFeedbackData] = useState<SessionFeedbackData | null>(null);
    const [lastEarnedStats, setLastEarnedStats] = useState({ xp: 0, gems: 0 });
    const [sessionHistory, setSessionHistory] = useState<SessionFeedbackData[]>([]);
    const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [showEndSessionModal, setShowEndSessionModal] = useState(false);

    const { connectionState, transcript, startSession, endSession, setInitialTranscript, pauseAudio, resumeAudio } = useSpeechToSpeech();

    const isPracticeActive = activePracticeMode !== null;

    const updateUserStats = useCallback(async (updates: Partial<UserStats>) => {
        if (!user) return;
        const newStats = { ...userStats, ...updates };
        setUserStats(newStats);
        await setDoc(doc(db, 'users', user.uid), newStats, { merge: true });
    }, [user, userStats]);

    const analyzeSession = useCallback(async (finalTranscript: TranscriptEntry[]) => {
        if (!user || !activePracticeMode) return;
        
        setIsFeedbackLoading(true);
        setShowFeedbackModal(true);
        
        const earnedStats = { xp: 0, gems: 0 };

        // REWARD RULE: Minimum 1 minute (60s) for rewards
        if (sessionDuration < 60) {
            const noFeedback: SessionFeedbackData = { 
                date: new Date().toISOString(), clarityScore: 0, fluencyScore: 0, pronunciationAccuracyScore: 0, speechRateWPM: 0, 
                fillerWords: [], vocabularySummary: "", structuredVocabulary: [], grammarCorrections: [], 
                pronunciationCorrections: [], suggestedAnswers: [], 
                overallFeedback: "Session was too short. Practice for at least 1 minute to receive feedback and rewards." 
            };
            setLastFeedbackData(noFeedback);
            setLastEarnedStats(earnedStats);
            setIsFeedbackLoading(false);
            return;
        }
    
        const feedback = await getSessionFeedback(finalTranscript, activePracticeMode, sessionDuration);
        
        const baseScore = (feedback.clarityScore + feedback.fluencyScore + feedback.pronunciationAccuracyScore) / 3;
        
        // Calculate rewards
        let earnedXp = Math.round((baseScore / 100) * 20) + 5; // Base 5 XP + up to 20 performance bonus
        earnedXp = Math.min(25, Math.max(5, earnedXp));

        const minutesPracticed = Math.floor(sessionDuration / 60);
        const earnedGems = minutesPracticed * 2;
        
        earnedStats.xp = earnedXp;
        earnedStats.gems = earnedGems;

        setLastEarnedStats(earnedStats);
        
        const today = new Date();
        const lastPractice = userStats.lastPracticeTimestamp ? new Date(userStats.lastPracticeTimestamp) : null;
        
        let newStreak = userStats.streak;
        let newLastPracticeTimestamp = userStats.lastPracticeTimestamp;

        // STREAK RULE: Minimum 1 minute (60s) to earn a streak
        if (sessionDuration >= 60) {
            const isSameDay = lastPractice ? today.toDateString() === lastPractice.toDateString() : false;
            if (!isSameDay) {
                const yesterday = new Date();
                yesterday.setDate(today.getDate() - 1);
                if (lastPractice && lastPractice.toDateString() === yesterday.toDateString()) {
                    newStreak += 1; // It's a consecutive day
                } else {
                    newStreak = 1; // It's a new streak
                }
                newLastPracticeTimestamp = today.getTime();
            }
        }

        await updateUserStats({ 
            xp: userStats.xp + earnedStats.xp, 
            gems: userStats.gems + earnedStats.gems, 
            streak: newStreak, 
            lastPracticeTimestamp: newLastPracticeTimestamp
        });
        
        const sessionWithRewards = { ...feedback, earnedXp: earnedStats.xp, earnedGems: earnedStats.gems };
        await addDoc(collection(db, 'users', user.uid, 'sessions'), { ...sessionWithRewards, date: Timestamp.fromDate(new Date()) });
        
        setLastFeedbackData(sessionWithRewards);
        setSessionHistory(prev => [sessionWithRewards, ...prev]);
        setIsFeedbackLoading(false);

    }, [user, activePracticeMode, sessionDuration, userStats, updateUserStats]);

    const handleConfirmEndSession = useCallback(async () => {
        if (!activePracticeMode) return;
        setShowEndSessionModal(false);
        setSessionStatus('ANALYZING');
        await endSession();
        analyzeSession(transcript);
    }, [activePracticeMode, endSession, analyzeSession, transcript]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    const stats: UserStats = { gems: data.gems || 0, xp: data.xp || 0, streak: data.streak || 0, lastPracticeTimestamp: data.lastPracticeTimestamp || null };
                    
                    // FIX: Ensure older users have a displayName for the leaderboard.
                    if (!data.displayName && currentUser.email) {
                        const emailName = currentUser.email.split('@')[0];
                        const formattedName = emailName.replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        await setDoc(userDocRef, { displayName: formattedName }, { merge: true });
                    }
                    
                    if (stats.lastPracticeTimestamp) {
                        const today = new Date();
                        const lastPracticeDate = new Date(stats.lastPracticeTimestamp);
                        const diffTime = today.getTime() - lastPracticeDate.getTime();
                        const diffDaysInMs = 1000 * 60 * 60 * 24;
                        // If it's been more than 48 hours since the last practice, reset streak.
                        // This allows for a full day to be missed without losing the streak.
                        if(diffTime > 2 * diffDaysInMs) {
                            stats.streak = 0;
                            await setDoc(userDocRef, { streak: 0 }, { merge: true });
                        }
                    }
                    setUserStats(stats);
                } else {
                    // This is a new user, create their document for the leaderboard.
                    const emailName = currentUser.email ? currentUser.email.split('@')[0] : `User-${currentUser.uid.substring(0, 5)}`;
                    // A simple way to format the name: capitalize first letter, replace dots/underscores with spaces.
                    const formattedName = emailName.replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    
                    const newUserDoc = {
                        displayName: formattedName,
                        email: currentUser.email,
                        createdAt: Timestamp.now(),
                        gems: 0,
                        xp: 0,
                        streak: 0,
                        lastPracticeTimestamp: null
                    };
                    await setDoc(userDocRef, newUserDoc);
            
                    // Set the local stats state from the new document data
                    const stats: UserStats = { gems: newUserDoc.gems, xp: newUserDoc.xp, streak: newUserDoc.streak, lastPracticeTimestamp: newUserDoc.lastPracticeTimestamp };
                    setUserStats(stats);
                }

                const historyQuery = query(collection(db, 'users', currentUser.uid, 'sessions'), orderBy('date', 'desc'), limit(20));
                const querySnapshot = await getDocs(historyQuery);
                const history: SessionFeedbackData[] = querySnapshot.docs.map(d => {
                    const data = d.data();
                    const firestoreDate = data.date;
                    let finalDate: string = (firestoreDate?.toDate?.() || new Date()).toISOString();
                    return { ...data, date: finalDate } as SessionFeedbackData;
                });
                setSessionHistory(history);
                if (history.length > 0) setLastFeedbackData(history[0]);
                
                setView('app');
            } else {
                setView('landing');
                setActivePracticeMode(null);
                setPage('dashboard');
            }
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (sessionStatus === 'IN_PROGRESS') {
            sessionTimerRef.current = window.setInterval(() => {
                setSessionDuration(prev => prev + 1);
            }, 1000);
        } else if (sessionTimerRef.current) {
            clearInterval(sessionTimerRef.current);
            sessionTimerRef.current = null;
        }

        return () => {
            if (sessionTimerRef.current) {
                clearInterval(sessionTimerRef.current);
            }
        };
    }, [sessionStatus]);

    useEffect(() => {
        if (
            (activePracticeMode === PracticeMode.RANDOM && sessionDuration >= RANDOM_CONVERSATION_DURATION_SECONDS) ||
            (isInterviewMode(activePracticeMode) && sessionDuration >= INTERVIEW_DURATION_SECONDS)
        ) {
            handleConfirmEndSession();
        }
    }, [sessionDuration, activePracticeMode, handleConfirmEndSession]);
    
    useEffect(() => {
        if (showEndSessionModal) {
            pauseAudio();
        } else {
            if (isPracticeActive) resumeAudio();
        }
    }, [showEndSessionModal, isPracticeActive, pauseAudio, resumeAudio]);


    const handleLogout = async () => { await signOut(auth); };
    
    const handleNavigate = (targetPage: string) => {
        if (isPracticeActive) {
            setShowEndSessionModal(true);
            return;
        }
        setPage(targetPage);
        setMobileSidebarOpen(false);
    };

    const handleStartPractice = (mode: PracticeMode) => {
        if (isPracticeActive) {
            setShowEndSessionModal(true);
            return;
        }
        setShowPrePracticeInfo(mode);
    };
    
    const handleConfirmStart = async () => {
        if (!showPrePracticeInfo) return;
        const mode = showPrePracticeInfo;
        setShowPrePracticeInfo(null);
        setPage('practice');
        setActivePracticeMode(mode);
        setInitialTranscript([]);
        setSessionDuration(0);
        setSessionStatus('GENERATING_GREETING');
        
        try {
            const greetingText = await generateGreeting(mode);
            const initialGreeting: TranscriptEntry = { source: 'AI', text: greetingText, isFinal: true };
            setInitialTranscript([initialGreeting]);
            
            await playGreeting(greetingText);
            
            setSessionStatus('IN_PROGRESS');
            await startSession(mode, [initialGreeting]);

        } catch (error) {
            console.error("Failed to start session with greeting:", error);
            const fallbackGreeting = "Hello! Let's begin.";
            const fallbackEntry: TranscriptEntry = { source: 'AI', text: fallbackGreeting, isFinal: true };
            setInitialTranscript([fallbackEntry]);
            setSessionStatus('IN_PROGRESS');
            await startSession(mode, [fallbackEntry]);
        }
    };
    
    const handleEndPractice = () => setShowEndSessionModal(true);

    const handleQuitSession = async () => {
        setShowEndSessionModal(false);
        await endSession();
        setActivePracticeMode(null);
        setPage('dashboard');
    }

    const pageContent = () => {
        if (!user) return null;
        switch (page) {
            case 'interview': return <InterviewModeSelection onStartPractice={handleStartPractice} onNavigate={handleNavigate} />;
            case 'technicalDomainSelection': return <TechnicalDomainSelection onStartPractice={handleStartPractice} onNavigate={handleNavigate} />;
            case 'leaderboard': return <LeaderboardPage currentUser={{ uid: user.uid, name: user.displayName || user.email || 'You', xp: userStats.xp }} />;
            case 'fluency':
            case 'reviews': return <FluencyAccuracyPage lastReview={lastFeedbackData} sessionHistory={sessionHistory} activePage={page} />;
            case 'dashboard':
            default: return <Dashboard onNavigate={handleNavigate} onStartPractice={handleStartPractice} />;
        }
    };

    if (isLoading) return <LoadingSpinner />;
    if (!user) {
        if (view === 'login' || view === 'signup') return <LoginPage onBack={() => setView('landing')} initialView={view} />;
        return <LandingPage onLaunchApp={(v) => setView(v)} />;
    }

    return (
        <div className="flex h-screen bg-transparent text-white font-sans">
            <Sidebar isMobileOpen={isMobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} activePage={page} onNavigate={handleNavigate} onStartPractice={handleStartPractice} activePracticeMode={activePracticeMode} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header user={user} userStats={userStats} onLogout={handleLogout} onToggleMobileSidebar={() => setMobileSidebarOpen(!isMobileSidebarOpen)} />
                <main className="flex-1 flex flex-col overflow-hidden bg-grid-pattern">
                    {isPracticeActive ? (
                        <div className="flex-1 overflow-hidden p-4 md:p-8 flex flex-col">
                           <ConversationView mode={activePracticeMode} onEndPractice={handleEndPractice} connectionState={connectionState} transcript={transcript} sessionStatus={sessionStatus} sessionDuration={sessionDuration} />
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto p-4 md:p-8">
                            {pageContent()}
                        </div>
                    )}
                </main>
            </div>
            {showPrePracticeInfo && <div className="fixed inset-0 bg-slate-900 z-[60] flex items-center justify-center"><PrePracticeInfo mode={showPrePracticeInfo} onConfirm={handleConfirmStart} onCancel={() => { setShowPrePracticeInfo(null); }} /></div>}
            {showFeedbackModal && <SessionFeedback isLoading={isFeedbackLoading} feedbackData={lastFeedbackData} earnedStats={lastEarnedStats} streak={userStats.streak} onClose={() => { setShowFeedbackModal(false); setActivePracticeMode(null); setPage('dashboard'); }} onNavigateToReviews={() => { setShowFeedbackModal(false); setActivePracticeMode(null); setPage('reviews'); }} />}
            {showEndSessionModal && <EndSessionModal onClose={() => setShowEndSessionModal(false)} onConfirmEnd={handleConfirmEndSession} onQuit={handleQuitSession} />}
        </div>
    );
};

export default App;
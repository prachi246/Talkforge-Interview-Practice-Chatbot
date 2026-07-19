// FIX: Removed circular dependency by deleting the self-import of `PracticeMode`.
export enum PracticeMode {
  INTERVIEW_HR = 'INTERVIEW_HR',
  INTERVIEW_TECHNICAL_SOFTWARE = 'INTERVIEW_TECHNICAL_SOFTWARE',
  INTERVIEW_TECHNICAL_DATA = 'INTERVIEW_TECHNICAL_DATA',
  INTERVIEW_TECHNICAL_DEVOPS = 'INTERVIEW_TECHNICAL_DEVOPS',
  INTERVIEW_TECHNICAL_WEB = 'INTERVIEW_TECHNICAL_WEB',
  INTERVIEW_TECHNICAL_HARDWARE = 'INTERVIEW_TECHNICAL_HARDWARE',
  INTERVIEW_TECHNICAL_MECHANICAL = 'INTERVIEW_TECHNICAL_MECHANICAL',
  INTERVIEW_TECHNICAL_CIVIL = 'INTERVIEW_TECHNICAL_CIVIL',
  RANDOM = 'RANDOM',
}

export interface UserStats {
  gems: number;
  xp: number;
  streak: number;
  lastPracticeTimestamp: number | null;
}

export interface TranscriptEntry {
  source: 'USER' | 'AI';
  text: string;
  isFinal: boolean;
}

export enum ConnectionState {
    IDLE = 'IDLE',
    CONNECTING = 'CONNECTING',
    CONNECTED = 'CONNECTED',
    DISCONNECTING = 'DISCONNECTING',
    RECONNECTING = 'RECONNECTING',
    ERROR = 'ERROR',
    PERMISSION_DENIED = 'PERMISSION_DENIED',
    SESSION_EXPIRED = 'SESSION_EXPIRED',
}

export type SessionStatus = 'IDLE' | 'GENERATING_GREETING' | 'IN_PROGRESS' | 'ANALYZING';

export interface FillerWord {
  word: string;
  count: number;
  alternatives: string[];
}

export interface GrammarCorrection {
  error: string;
  correction: string;
  explanation: string;
}

export interface PronunciationCorrection {
  word: string;
  correction: string;
  explanation: string;
}

export interface SuggestedAnswer {
  question: string;
  suggestedAnswer: string;
}

export interface VocabularySuggestion {
  word: string;
  context: string;
  alternatives: string[];
}

export interface SessionFeedbackData {
  date: string;
  clarityScore: number; 
  fluencyScore: number;
  pronunciationAccuracyScore: number;
  speechRateWPM: number;
  fillerWords: FillerWord[];
  vocabularySummary: string; // Renamed from vocabularySuggestions
  structuredVocabulary: VocabularySuggestion[]; // New field for detailed review
  grammarCorrections: GrammarCorrection[];
  pronunciationCorrections: PronunciationCorrection[];
  suggestedAnswers: SuggestedAnswer[];
  overallFeedback: string;
}
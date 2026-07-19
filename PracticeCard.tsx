

import React, { useState } from 'react';
import { TalkForgeLogoIcon } from './icons/TalkForgeLogoIcon.tsx';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.ts';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon.tsx';

interface LoginPageProps {
  onBack: () => void;
  initialView: 'login' | 'signup';
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack, initialView }) => {
  const [isLoginView, setIsLoginView] = useState(initialView === 'login');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateForm = () => {
    if (!email || !password) {
      setError('Email and password are required.');
      return false;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return false;
    }
    if (!isLoginView && password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      if (isLoginView) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // onAuthStateChanged in App.tsx will handle the redirect
    } catch (error: any) {
      console.log(error.code, error.message); // Added for detailed debugging
      let errorMessage = "An unknown error occurred.";
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email. Please sign up instead.';
          break;
        case 'auth/wrong-password':
           errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'The email or password you entered is incorrect. Please try again.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists. Please sign in.';
          // FIX: Automatically switch to the login view for a better user experience.
          setIsLoginView(true);
          setPassword('');
          setConfirmPassword('');
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters.';
          break;
        case 'auth/invalid-api-key':
          errorMessage = 'Firebase API Key is not valid. Please check your firebase.ts configuration.';
           break;
        case 'auth/unauthorized-domain':
            errorMessage = "Google Sign-In isn't supported in this temporary environment due to changing URLs. Please use Email & Password to sign in.";
            break;
        default:
          errorMessage = error.message;
          break;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError(null);
    // Keep email when toggling, clear passwords for security.
    setPassword('');
    setConfirmPassword('');
  }

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>

      <button
        onClick={onBack}
        aria-label="Go back to landing page"
        className="absolute top-6 left-6 z-20 p-3 bg-white/5 rounded-full text-violet-300 hover:text-white hover:bg-white/10 transition-all"
      >
        <ArrowLeftIcon className="w-6 h-6" />
      </button>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <TalkForgeLogoIcon className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold tracking-wider text-white">
            Welcome to Talk<span className="text-orange-400">Forge</span>
          </h1>
          <p className="text-violet-300">
            {isLoginView ? 'Sign in to continue your journey' : 'Create an account to get started'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-violet-900/50 to-indigo-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleEmailPasswordSubmit}>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isLoginView ? 'current-password' : 'new-password'}
                required
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
              {!isLoginView && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              )}
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center mt-4">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:bg-purple-800 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading && !error ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (isLoginView ? 'Sign In' : 'Create Account')}
            </button>
          </form>
        </div>

        <p className="text-center text-violet-300 mt-8">
          {isLoginView ? "Don't have an account?" : "Already have an account?"}
          <button onClick={toggleView} className="font-semibold text-purple-400 hover:text-purple-300 ml-2">
            {isLoginView ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
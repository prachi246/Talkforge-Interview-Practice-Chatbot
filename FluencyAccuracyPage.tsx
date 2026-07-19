
import React, { useState } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon.tsx';
import { CheckIcon } from './icons/CheckIcon.tsx';

const FirestoreRulesError: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const rulesToCopy = `
// Add this rule inside your 'match /databases/{database}/documents' block
match /users/{userId} {
  // This allows any authenticated user to get a list of users
  // for the leaderboard, but not write to them.
  allow list: if request.auth != null;
}
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(rulesToCopy.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-red-900/20 border border-red-500/30 rounded-lg text-red-200 animate-fadeInUp">
      <h3 className="text-xl font-bold text-red-300 mb-3">Leaderboard Error: Insufficient Permissions</h3>
      <p className="mb-4">
        The leaderboard could not be loaded because your app's database security rules are preventing it.
        To fix this, you need to allow authenticated users to read the list of users.
      </p>
      <p className="mb-4 font-semibold">
        Please go to your Firebase Console {'>'} Firestore Database {'>'} Rules and add the following rule:
      </p>
      <div className="relative bg-black/30 rounded-lg p-4 font-mono text-sm text-red-100 border border-red-500/30">
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 bg-slate-700/50 rounded-md hover:bg-slate-600/50 transition-colors"
          aria-label="Copy code"
        >
          {copied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
        </button>
        <pre><code>{rulesToCopy.trim()}</code></pre>
      </div>
      <p className="mt-4 text-xs text-red-300/80">
        This rule is secure. It only allows users to <span className="font-semibold">read the list</span> for ranking purposes. It does <span className="font-semibold">not</span> allow them to modify or delete other users' data.
        After updating your rules, you may need to refresh the page.
      </p>
    </div>
  );
};

export default FirestoreRulesError;

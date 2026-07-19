
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
      <div className="w-16 h-16 border-4 border-purple-400 border-dashed rounded-full animate-spin border-t-transparent"></div>
      <p className="mt-4 text-lg text-slate-300">Loading Your Experience...</p>
    </div>
  );
};

export default LoadingSpinner;

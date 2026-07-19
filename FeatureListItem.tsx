import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="group relative p-8 bg-violet-900/30 backdrop-blur-lg rounded-2xl border border-violet-500/30 text-center transition-all duration-300 hover:border-purple-400/40 hover:bg-violet-900/50 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2">
      <div className="flex justify-center mb-6">
        <div className="flex-shrink-0 p-4 bg-violet-800/60 rounded-full border border-violet-500/20 transition-colors duration-300 group-hover:border-purple-400/50">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-violet-300 leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
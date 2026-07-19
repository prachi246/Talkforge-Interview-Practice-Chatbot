

import React from 'react';

type GlowColor = 'purple' | 'rose' | 'sky' | 'cyan' | 'lime' | 'amber' | 'slate' | 'orange' | 'indigo' | 'emerald';

interface PracticeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  glowColor?: GlowColor;
}

const colorVariants: Record<GlowColor, string> = {
  purple: 'hover:border-purple-500/50 hover:shadow-[0_0_20px_theme(colors.purple.500/0.3)] group-hover:text-purple-400',
  rose: 'hover:border-rose-500/50 hover:shadow-[0_0_20px_theme(colors.rose.500/0.3)] group-hover:text-rose-400',
  sky: 'hover:border-sky-500/50 hover:shadow-[0_0_20px_theme(colors.sky.500/0.3)] group-hover:text-sky-400',
  cyan: 'hover:border-cyan-500/50 hover:shadow-[0_0_20px_theme(colors.cyan.500/0.3)] group-hover:text-cyan-400',
  lime: 'hover:border-lime-500/50 hover:shadow-[0_0_20px_theme(colors.lime.500/0.3)] group-hover:text-lime-400',
  amber: 'hover:border-amber-500/50 hover:shadow-[0_0_20px_theme(colors.amber.500/0.3)] group-hover:text-amber-400',
  slate: 'hover:border-slate-500/50 hover:shadow-[0_0_20px_theme(colors.slate.500/0.3)] group-hover:text-slate-400',
  orange: 'hover:border-orange-500/50 hover:shadow-[0_0_20px_theme(colors.orange.500/0.3)] group-hover:text-orange-400',
  indigo: 'hover:border-indigo-500/50 hover:shadow-[0_0_20px_theme(colors.indigo.500/0.3)] group-hover:text-indigo-400',
  emerald: 'hover:border-emerald-500/50 hover:shadow-[0_0_20px_theme(colors.emerald.500/0.3)] group-hover:text-emerald-400',
};


const PracticeCard: React.FC<PracticeCardProps> = ({ title, description, icon, onClick, glowColor = 'purple' }) => {
  
  const colorClass = colorVariants[glowColor] || colorVariants.purple;

  return (
    <button
      onClick={onClick}
      className={`group p-8 bg-gradient-to-br from-violet-900/50 to-indigo-900/50 backdrop-blur-lg rounded-xl border border-white/10 text-left 
                 transition-all duration-300 
                 hover:-translate-y-1
                 active:scale-[0.98] active:brightness-90
                 ${colorClass}`}
    >
      <div className="mb-4 transition-transform duration-300 group-hover:scale-110">{icon}</div>
      <h3 className={`text-2xl font-bold text-white mb-2 transition-colors duration-300 ${colorClass.split(' ').find(c => c.startsWith('group-hover:text'))}`}>
        {title}
      </h3>
      <p className="text-violet-300">{description}</p>
    </button>
  );
};

export default PracticeCard;
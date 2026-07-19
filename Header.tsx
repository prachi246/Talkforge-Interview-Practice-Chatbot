import React from 'react';

interface GaugeProps {
  score: number;
  label: string;
}

const Gauge: React.FC<GaugeProps> = ({ score, label }) => {
  const clampedScore = Math.max(0, Math.min(100, score));
  const angle = (clampedScore / 100) * 180; // 0 to 180 degrees

  // NEW: Theme-based colors based on the label, instead of score-based colors.
  const { scoreColor, glowColor } = React.useMemo(() => {
    switch (label) {
      case 'Clarity':
        return {
          scoreColor: 'text-pink-400',
          glowColor: 'drop-shadow-[0_0_5px_rgba(244,114,182,0.7)]', // pink-400
        };
      case 'Fluency':
        return {
          scoreColor: 'text-sky-400',
          glowColor: 'drop-shadow-[0_0_5px_rgba(56,189,248,0.7)]', // sky-400
        };
      case 'Pronunciation':
        return {
          scoreColor: 'text-purple-400',
          glowColor: 'drop-shadow-[0_0_5px_rgba(192,132,252,0.7)]', // purple-400
        };
      default: // Fallback for any other label
        return {
          scoreColor: 'text-slate-400',
          glowColor: 'drop-shadow-[0_0_5px_rgba(148,163,184,0.7)]', // slate-400
        };
    }
  }, [label]);


  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 180) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl">
      <div className="relative w-48 h-24">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          <path
            d={describeArc(100, 100, 80, 0, 180)}
            fill="none"
            stroke="currentColor"
            className="text-white/10"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d={describeArc(100, 100, 80, 0, angle)}
            fill="none"
            stroke="currentColor"
            className={`${scoreColor} ${glowColor}`}
            strokeWidth="12"
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.5s ease-in-out' }}
          />
        </svg>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
          <span className={`text-4xl font-bold ${scoreColor}`}>
            {Math.round(clampedScore)}
          </span>
        </div>
      </div>
      <p className="mt-2 text-lg font-semibold text-slate-300">{label}</p>
    </div>
  );
};

export default Gauge;
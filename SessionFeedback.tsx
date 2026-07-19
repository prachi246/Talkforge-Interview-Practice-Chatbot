import React, { useMemo } from 'react';
import { SessionFeedbackData } from '../types.ts';

interface ProgressChartProps {
  data: SessionFeedbackData[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  const chartLayout = useMemo(() => {
    if (!data || data.length === 0) {
      return null;
    }

    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const sessionsByDay = sortedData.reduce((acc, session) => {
      const day = new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(session);
      return acc;
    }, {} as Record<string, SessionFeedbackData[]>);

    const dayGroups = Object.keys(sessionsByDay).map(day => ({
      label: day,
      sessions: sessionsByDay[day]
    }));

    const height = 300;
    const padding = 40;
    const chartHeight = height - 2 * padding;
    const BAR_WIDTH = 12;
    const SESSION_MARGIN = 12; // Small gap between sessions on the same day
    const DAY_MARGIN = 36;     // Large gap between sessions on different days

    const layout = {
      bars: [] as any[],
      barLabels: [] as any[],
      dayLabels: [] as any[],
      daySeparators: [] as any[],
      yAxisLabels: [0, 25, 50, 75, 100],
      totalWidth: 0,
      height,
      padding,
      chartHeight
    };

    let currentX = padding + 20; // Start with some left padding

    dayGroups.forEach((group, dayIndex) => {
      const dayStartX = currentX;
      
      group.sessions.forEach(session => {
        const overallScore = (session.clarityScore + session.fluencyScore + session.pronunciationAccuracyScore) / 3;
        const barHeight = (overallScore / 100) * chartHeight;
        
        layout.bars.push({
          key: `${session.date}-overall`,
          x: currentX,
          y: height - padding - barHeight,
          width: BAR_WIDTH,
          height: barHeight,
        });

        layout.barLabels.push({
          key: `${session.date}-label`,
          x: currentX + BAR_WIDTH / 2,
          y: height - padding - barHeight - 6, // Position 6px above the bar
          text: `${Math.round(overallScore)}%`
        });
        
        currentX += BAR_WIDTH + SESSION_MARGIN;
      });

      const dayEndX = currentX - SESSION_MARGIN;
      const dayMidX = dayStartX + (dayEndX - dayStartX) / 2;

      layout.dayLabels.push({
        key: group.label,
        x: dayMidX,
        y: height - padding + 20,
        label: group.label
      });
      
      if (dayIndex < dayGroups.length - 1) {
        currentX += DAY_MARGIN - SESSION_MARGIN;
        
        const separatorX = currentX - DAY_MARGIN / 2;
        layout.daySeparators.push({
          key: `sep-${dayIndex}`,
          x1: separatorX,
          y1: padding / 2,
          x2: separatorX,
          y2: height - padding
        });
      }
    });

    layout.totalWidth = currentX + padding; // Add padding at the end
    return layout;
  }, [data]);


  if (!chartLayout) {
    return (
      <div className="bg-gradient-to-br from-violet-900/50 to-indigo-900/50 border border-white/10 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Performance Over Time</h3>
        <div className="h-[300px] flex items-center justify-center text-slate-400">
          <p>Complete a session to see your performance visualized here.</p>
        </div>
      </div>
    );
  }

  const { bars, barLabels, dayLabels, daySeparators, yAxisLabels, totalWidth, height, padding, chartHeight } = chartLayout;

  return (
    <div className="bg-gradient-to-br from-violet-900/50 to-indigo-900/50 border border-white/10 rounded-xl p-6">
      <h3 className="text-2xl font-bold text-white mb-4 text-center">Performance Over Time</h3>
      <div className="flex justify-center items-center mb-4 space-x-4 text-sm">
        <div className="flex items-center">
            <div className="w-4 h-4 rounded-sm mr-2" style={{ background: 'linear-gradient(to top, #a855f7, #60a5fa)' }}></div>
            <span className="text-slate-300">Overall Performance</span>
        </div>
      </div>
      <div className="w-full overflow-x-auto scrollbar-thin">
        <svg 
            width={totalWidth} 
            height={height} 
            className="font-sans"
        >
          <defs>
            <linearGradient id="overallGradient" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#a855f7" /> 
              <stop offset="100%" stopColor="#60a5fa" /> 
            </linearGradient>
          </defs>

          {/* Y-Axis Labels and Grid Lines */}
          {yAxisLabels.map(label => {
            const y = height - padding - (label / 100) * chartHeight;
            return (
              <g key={label}>
                <text x={padding - 10} y={y + 4} textAnchor="end" fill="#94a3b8" fontSize="12">
                  {label}
                </text>
                <line
                  x1={padding}
                  y1={y}
                  x2={totalWidth - padding / 2}
                  y2={y}
                  stroke="#475569"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              </g>
            );
          })}

          {/* Day Separator Lines */}
          {daySeparators.map(sep => (
            <line key={sep.key} {...sep} stroke="#475569" strokeWidth="1" />
          ))}

          {/* Bars */}
          {bars.map(bar => (
            <rect
              key={bar.key}
              x={bar.x}
              y={bar.y}
              width={bar.width}
              height={bar.height}
              fill="url(#overallGradient)"
              rx="2"
              ry="2"
              className="transition-all duration-200 opacity-90"
            />
          ))}

          {/* Bar Labels (Percentages) */}
          {barLabels.map(label => (
            <text
              key={label.key}
              x={label.x}
              y={label.y}
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="10"
              fontWeight="bold"
              className="pointer-events-none"
            >
              {label.text}
            </text>
          ))}

          {/* Day Labels */}
          {dayLabels.map(label => (
            <text key={label.key} x={label.x} y={label.y} textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="medium">
              {label.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default ProgressChart;
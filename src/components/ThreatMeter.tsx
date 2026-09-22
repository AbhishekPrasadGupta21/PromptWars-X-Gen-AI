import React from 'react';

interface ThreatMeterProps {
  score: number;
}

export default function ThreatMeter({ score }: ThreatMeterProps) {
  // Determine color based on threat level
  let strokeColor = 'var(--success)';
  if (score > 30) strokeColor = 'var(--warning)';
  if (score > 70) strokeColor = 'var(--danger)';

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center py-6" aria-label={`Scam threat index is ${score} percent`}>
      <svg className="w-40 h-40 transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          className="text-slate-800"
        />
        {/* Progress circle */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke={strokeColor}
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-4xl font-bold tracking-tighter" style={{ color: strokeColor }}>
          {score}%
        </span>
        <span className="text-xs text-slate-400 uppercase tracking-widest mt-1 font-semibold">Threat</span>
      </div>
    </div>
  );
}

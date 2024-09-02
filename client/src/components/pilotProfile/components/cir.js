import React from 'react';

const CircularProgress = ({ value }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  let color;
  if (value <= 25) {
    color = 'orange';
  } else if (value > 25 && value <= 50) {
    color = 'yellow';
  } else {
    color = 'green';
  }

  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="120" height="120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="lightgray"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke={color}
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 60 60)"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute text-xl">{`${value}%`}</div>
    </div>
  );
};

export default CircularProgress;

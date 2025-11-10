// src/components/common/BackgroundGraphic.jsx

import React from 'react';

// This component creates the animated slanting lines.
const AnimatedLines = () => {
  // We create multiple lines with different styles and delays
  // to make the background feel alive.
  const lines = [
    // Blue lines
    { delay: 0, duration: 15, size: 'w-64', top: '10%', left: '-20%', color: 'bg-blue-500' },
    { delay: 4, duration: 18, size: 'w-80', top: '30%', left: '-20%', color: 'bg-blue-600' },
    { delay: 8, duration: 12, size: 'w-56', top: '70%', left: '-20%', color: 'bg-blue-400' },
    
    // Pink/Purple lines
    { delay: 2, duration: 16, size: 'w-72', top: '20%', left: '-20%', color: 'bg-pink-500' },
    { delay: 6, duration: 20, size: 'w-96', top: '50%', left: '-20%', color: 'bg-purple-600' },
    { delay: 10, duration: 14, size: 'w-64', top: '90%', left: '-20%', color: 'bg-pink-400' },
    
    // More lines to fill the screen
    { delay: 1, duration: 17, size: 'w-72', top: '0%', left: '30%', color: 'bg-blue-500' },
    { delay: 5, duration: 19, size: 'w-80', top: '60%', left: '40%', color: 'bg-pink-600' },
    { delay: 9, duration: 13, size: 'w-56', top: '80%', left: '10%', color: 'bg-purple-400' },
    { delay: 3, duration: 15, size: 'w-64', top: '40%', left: '70%', color: 'bg-blue-400' },
  ];

  return (
    <div className="absolute inset-0 z-0">
      {lines.map((line, index) => (
        <div
          key={index}
          // --- THIS IS THE CHANGE ---
          // I changed h-9 (2.25rem) to h-28 (7rem) to make them 3x fatter.
          className={`absolute h-28 ${line.size} ${line.color} rounded-full opacity-30 dark:opacity-50 transform -rotate-45 animate-slide`}
          style={{
            top: line.top,
            left: line.left,
            animationDelay: `${line.delay}s`,
            animationDuration: `${line.duration}s`,
          }}
        />
      ))}
    </div>
  );
};


const BackgroundGraphic = () => {
  return (
    <>
      {/* 1. Base solid color background
          Using slate-900 for dark mode, which is a rich blue-gray.
      */}
      <div className="fixed inset-0 z-[-1] bg-gray-50 dark:bg-slate-900" />
      
      {/* 2. Container for the animations, with overflow-hidden */}
      <div
        className="fixed inset-0 z-[-1] overflow-hidden"
        aria-hidden="true"
      >
        <AnimatedLines />
      </div>

      {/* 3. Style tag to inject the animation keyframes */}
      <style>
        {`
          @keyframes slide {
            0% {
              transform: translate(-50vw, 50vh) rotate(-45deg);
            }
            100% {
              transform: translate(50vw, -50vh) rotate(-45deg);
            }
          }
          
          .animate-slide {
            /* The initial state is set in the keyframes '0%' */
            animation-name: slide;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
          }
        `}
      </style>
    </>
  );
};

export default BackgroundGraphic;
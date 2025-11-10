// src/components/common/Card.jsx

import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  // --- THIS IS THE FIX ---
  // Before: dark:bg-gray-800/50 (transparent)
  // After:  dark:bg-gray-800 (fully opaque)
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
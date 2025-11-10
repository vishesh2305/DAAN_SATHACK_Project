import React from 'react';

const Button = ({ children, variant = 'default', size = 'md', className = '', ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "border border-gray-300 bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
    ghost: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
    link: "text-blue-600 hover:underline dark:text-blue-400",
    // --- ADDED VARIANTS ---
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    danger_outline: "border border-red-300 bg-transparent text-red-600 hover:bg-red-50 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-900/50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  // Handle the 'as' prop if it's passed (for Link components)
  const Component = props.as || 'button';

  return (
    <Component className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </Component>
  );
};

export default Button;
// src/components/AuthLayout.jsx

import React from 'react';
import { Heart, ShieldCheck } from 'lucide-react';

/**
 * Provides the modern, two-panel structural layout for the AuthPage.
 * Left Panel: Conceptual blue/purple gradient and Glassmorphism elements (no static image).
 * Right Panel: High-contrast, theme-aware form area.
 */
const AuthLayout = ({ children, isSignUpMode }) => {
    
    // Determine the primary theme based on mode
    const leftPanelColor = isSignUpMode 
        ? 'bg-gradient-to-br from-blue-700 to-purple-800' 
        : 'bg-gradient-to-br from-teal-700 to-green-800';

    const panelContent = isSignUpMode 
        ? 'PROVABLY SECURE ACCOUNT CREATION' 
        : 'DECENTRALIZED ACCESS GATEWAY';

    return (
        // Container to center the entire component (allows global BG to show behind the form)
        <div className="min-h-screen flex items-center justify-center p-4 lg:p-8">
            
            {/* The Main Container Card (THEME AWARE) */}
            <div 
                className="w-full max-w-5xl h-[90vh] max-h-[800px] 
                           bg-white dark:bg-gray-900/90 backdrop-blur-lg rounded-3xl shadow-2xl shadow-black/60 dark:shadow-blue-900/40 
                           flex overflow-hidden transition-colors duration-500 border border-gray-200 dark:border-gray-700"
            >
                {/* 1. CONCEPTUAL GLASS PANEL (Left Side - Theme is fine here) */}
                <div 
                    className={`hidden lg:flex flex-col justify-between p-12 w-1/2 text-white 
                                ${leftPanelColor} relative overflow-hidden`}
                >
                    {/* Glass Overlay with HEAVY Blur (Theme-aware for better contrast) */}
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-[35px]"></div>
                    
                    {/* Glowing Conceptual Element (Glassmorphism Spheres) */}
                    <div className="absolute inset-0 z-0">
                        {/* Blue Sphere (Translating Glass element) */}
                        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-blue-400/50 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                        {/* Purple Sphere */}
                        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-400/50 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2 animate-pulse" style={{ animationDelay: '2s' }}/>
                    </div>

                    {/* Content Layer (on top of blur/glow) */}
                    <div className="relative z-10">
                        <Heart className="h-10 w-10 mb-4 drop-shadow-md" />
                        <h1 className="text-4xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
                            {isSignUpMode ? 'Verify & Fund the Future.' : 'Decentralized Support.'}
                        </h1>
                        <p className="mt-4 text-lg font-medium opacity-90 drop-shadow-sm">
                            {panelContent} via Aadhaar verification and Web3 technology.
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center text-lg font-bold mt-auto">
                        <ShieldCheck className='h-6 w-6 mr-2 text-green-300 drop-shadow-md'/>
                        {isSignUpMode ? 'Identity Verification Required' : 'Wallet Security Focused'}
                    </div>
                </div>

                {/* 2. AUTHENTICATION FORM PANEL (Right Side - Now Scrollable) */}
                <div 
                    // FIX: Removed flex-col to allow content to flow naturally, 
                    // and added overflow-y-auto for smooth scrolling.
                    className="w-full lg:w-1/2 p-6 sm:p-12 text-gray-900 dark:text-white overflow-y-auto"
                >
                    
                    {/* Form Content is rendered here */}
                    <div className="flex-grow flex flex-col"> 
                        {/* FIX: Removed justify-center here */}
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
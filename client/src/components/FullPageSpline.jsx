// src/components/FullPageSpline.jsx
import React, { useEffect, useRef } from 'react';
import SplineScene from "./SplineScene";
import Spotlight from "./common/Spotlight";

/**
 * Enhanced full-screen wrapper for the Spline scene with improved robot head tracking.
 * The robot now responds to scroll position throughout the entire page.
 */
const FullPageSpline = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;

            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            // Calculate scroll percentage (0 to 1)
            const maxScroll = documentHeight - windowHeight;
            const scrollPercentage = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;
            
            // Calculate robot head rotation based on scroll
            // The robot will look down as you scroll (0deg to 20deg)
            const headRotation = scrollPercentage * 20;
            
            // Calculate vertical offset for smooth parallax effect
            const verticalOffset = scrollPercentage * 30;
            
            // Apply transforms to the Spline container for smooth robot movement
            if (containerRef.current) {
                containerRef.current.style.setProperty('--head-rotation', `${headRotation}deg`);
                containerRef.current.style.setProperty('--vertical-offset', `${verticalOffset}px`);
            }
        };

        // Initial call
        handleScroll();

        // Add scroll listener with passive for better performance
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div 
            ref={containerRef}
            className="fixed inset-0 z-0 w-full h-full bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 overflow-hidden"
            style={{
                '--head-rotation': '0deg',
                '--vertical-offset': '0px'
            }}
        >
            {/* Enhanced spotlight effects */}
            <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="#3b82f6" 
            />
            <Spotlight
                className="top-1/2 right-0 md:right-40"
                fill="#8b5cf6" 
            />
            
            {/* Animated gradient orbs for depth */}
            <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <div 
                className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" 
                style={{ animationDelay: '1.5s' }} 
            />
            
            {/* Container for SplineScene with responsive positioning and scroll-based transforms */}
            <div 
                className="w-full h-full transition-transform duration-300 ease-out"
                style={{
                    transform: `
                        translateX(-15%) 
                        translateY(var(--vertical-offset, 0px))
                        rotateX(var(--head-rotation, 0deg))
                    `,
                    transformOrigin: 'center center'
                }}
            > 
                <SplineScene
                    scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                    className="w-full h-full"
                    style={{
                        pointerEvents: 'auto', // Enable interaction with Spline scene
                    }}
                />
            </div>

            {/* Vignette overlay for better depth perception */}
            <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
                }}
            />
        </div>
    );
};

export default FullPageSpline;
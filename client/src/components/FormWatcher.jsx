// ---
// PASTE THIS ENTIRE CODE BLOCK INTO:
// src/components/FormWatcher.jsx
// ---

import React, { useState, useEffect, useRef } from 'react';
import './FormWatcher.css'; // This file is already correct from the last step

const FormWatcher = () => {
    const [pupilStyle, setPupilStyle] = useState({});
    const [tailStyle, setTailStyle] = useState({});
    const faceRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (event) => {
            if (!faceRef.current) return;

            // Get the center of the face
            const faceRect = faceRef.current.getBoundingClientRect();
            const faceCenterX = faceRect.left + faceRect.width / 2;
            const faceCenterY = faceRect.top + faceRect.height / 2;

            // Get the mouse position
            const mouseX = event.clientX;
            const mouseY = event.clientY;

            // Calculate the angle from the face center to the mouse
            const deltaX = mouseX - faceCenterX;
            const deltaY = mouseY - faceCenterY;
            const angle = Math.atan2(deltaY, deltaX);

            // Calculate the position for the pupils
            const pupilX = Math.cos(angle) * 7;
            const pupilY = Math.sin(angle) * 7;

            setPupilStyle({
                transform: `translate(${pupilX}px, ${pupilY}px)`,
            });

            // --- REVISED TAIL WAG LOGIC ---
            
            // 1. Give the tail a natural upward "resting" curve
            const baseRotation = -20; // in degrees
            
            // 2. Calculate the wag based on horizontal cursor position
            const wagAmount = deltaX * 0.1;
            
            // 3. Clamp the wag amount to a reasonable range
            const clampedWag = Math.max(-25, Math.min(25, wagAmount));
            
            // 4. Add the wag to the base rotation
            const finalRotation = baseRotation + clampedWag;

            setTailStyle({
                transform: `rotate(${finalRotation}deg)`,
            });
            // --- END REVISED TAIL LOGIC ---
        };

        // Add the listener to the whole window
        window.addEventListener('mousemove', handleMouseMove);

        // Clean up the listener when the component unmounts
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []); // Empty array means this runs once on mount

    return (
        // This is the full cat structure from your CSS
        <div className="cat-container">

            <div className="cat">
                <div className="face" ref={faceRef}>
                    <div className="ear-l"></div>
                    <div className="ear-r"></div>
                    <div className="tag"></div>
                    {/* These are the new eye elements */}
                    <div className="eye eye-l">
                        <div className="pupil" style={pupilStyle}></div>
                    </div>
                    <div className="eye eye-r">
                        <div className="pupil" style={pupilStyle}></div>
                    </div>
                </div>

                {/* The tail element remains the same */}
                <div className="tail" style={tailStyle}></div>

            </div>
        </div>
    );
};

export default FormWatcher;
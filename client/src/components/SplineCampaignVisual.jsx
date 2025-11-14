// src/components/SplineCampaignVisual.jsx
import React from 'react';
// We no longer import SplineScene or Spotlight here, only utilities
import { Lightbulb, FileText, DollarSign, ImagePlus, CheckCircle } from 'lucide-react'; 

// Helper component to visually highlight the current step
const StepItem = ({ icon: Icon, label, isFocused }) => (
    // Enhanced focus effect: added drop-shadow-xl for better visibility
    <div className={`flex items-center space-x-3 transition-all duration-300 ${isFocused ? 'scale-[1.05] drop-shadow-xl' : 'opacity-70'}`}>
        <Icon className={`h-6 w-6 transition-colors duration-300 ${isFocused ? 'text-blue-300 drop-shadow-lg' : 'text-neutral-300 dark:text-gray-500'}`}/>
        {/* Changed focused text color to be more distinct */}
        <span className={`text-lg font-extrabold transition-colors duration-300 ${isFocused ? 'text-blue-50' : 'text-neutral-300 dark:text-gray-500'}`}>{label}</span>
    </div>
)


/**
 * Renders the instructional text and guide overlay on top of the fixed Spline background.
 * The primary purpose is to style the visual guide and ensure MOUSE EVENTS FALL THROUGH 
 * to the background Spline canvas for robot interaction.
 */
export function SplineCampaignVisual({ focusedField }) {
    
    let message = "Launch your idea in Web3.";
    // REVERTED Logic to 5 steps
    if (focusedField === 'title' || focusedField === 'category') message = "Step 1: The Spark. What is your idea's name?";
    else if (focusedField === 'description' || focusedField === 'promptText') message = "Step 2: The Story. Tell your compelling 'why'.";
    else if (focusedField === 'fundingGoal' || focusedField === 'deadline') message = "Step 3: The Goal. Set your target amount in ETH.";
    // The Visuals step is now Step 4 again
    else if (focusedField === 'media') message = "Step 4: The Visuals. A picture is worth a thousand donations.";
    else if (focusedField === null) message = "Review & Launch. One final look before you go live!";


    return (
        // This component is fixed to the screen, occupying the left half, and passing events through.
        <div className="fixed top-0 left-0 h-full w-full lg:w-1/2 flex items-end justify-center lg:justify-start p-10 z-10 pointer-events-none">
            <div 
                // ENHANCED GLASSMORPHISM: Changed bg-white/10 to bg-white/30 for better light theme appearance
                className="max-w-md p-8 lg:p-10 bg-white/30 dark:bg-black/40 backdrop-blur-xl rounded-2xl 
                            transition-all duration-500 pointer-events-auto 
                            shadow-2xl shadow-black/50 border border-white/20 dark:border-white/10"
            >
                 {/* STRONGER TITLE GRADIENT AND SHADOW */}
                 <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent 
                                bg-gradient-to-b from-white to-neutral-200 
                                dark:from-white dark:to-gray-200 drop-shadow-2xl">
                    Campaign Architect
                </h1>
                {/* MESSAGE TEXT BRIGHTENED */}
                <p className="mt-2 text-lg text-white dark:text-gray-300 max-w-lg transition-colors duration-500 drop-shadow-md">
                    {message}
                </p>
                
                {/* Step Indicator based on focusedField (Reverted to 5 steps) */}
                <div className="mt-8 space-y-4"> {/* Increased space-y for better visual separation */}
                    <StepItem 
                        icon={Lightbulb} 
                        label="The Spark" 
                        isFocused={focusedField === 'title' || focusedField === 'category'}
                    />
                     <StepItem 
                        icon={FileText} 
                        label="The Story" 
                        isFocused={focusedField === 'description' || focusedField === 'promptText'}
                    />
                     <StepItem 
                        icon={DollarSign} 
                        label="The Goal" 
                        isFocused={focusedField === 'fundingGoal' || focusedField === 'deadline'}
                    />
                    <StepItem 
                        icon={ImagePlus} 
                        label="The Visuals" 
                        isFocused={focusedField === 'media'}
                    />
                    <StepItem 
                        icon={CheckCircle} 
                        label="Review & Launch" 
                        isFocused={focusedField === null || focusedField === 'review'}
                    />
                </div>
            </div>
        </div>
    );
}

export default SplineCampaignVisual;
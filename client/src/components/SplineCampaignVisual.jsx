// src/components/SplineCampaignVisual.jsx
import React from 'react';
// --- CORRECTED IMPORTS: Use './' for sibling components ---
import SplineScene from "./SplineScene"; 
import Spotlight from "./common/Spotlight"; 
// --------------------------------------------------------
import { Lightbulb, FileText, DollarSign, ImagePlus, CheckCircle } from 'lucide-react'; 

// Helper component to visually highlight the current step
const StepItem = ({ icon: Icon, label, isFocused }) => (
    <div className={`flex items-center space-x-3 transition-all duration-300 ${isFocused ? 'text-blue-400 scale-[1.03]' : 'text-neutral-500 dark:text-gray-600'}`}>
        <Icon className={`h-5 w-5 ${isFocused ? 'text-blue-400' : 'text-neutral-500 dark:text-gray-600'}`}/>
        <span className={`text-sm font-medium ${isFocused ? 'text-white dark:text-white' : 'text-neutral-500 dark:text-gray-600'}`}>{label}</span>
    </div>
)


/**
 * Renders the large, dominant visual for the left column of the campaign creation page.
 * It is styled to be a seamless, dark background feature.
 */
export function SplineCampaignVisual({ focusedField }) {
    
    let message = "Launch your idea in Web3.";
    if (focusedField === 'title' || focusedField === 'category') message = "Step 1: The Spark. What is your idea's name?";
    else if (focusedField === 'description' || focusedField === 'promptText') message = "Step 2: The Story. Tell your compelling 'why'.";
    else if (focusedField === 'fundingGoal' || focusedField === 'deadline') message = "Step 3: The Goal. Set your target amount in ETH.";
    else if (focusedField === 'media') message = "Step 4: The Visuals. A picture is worth a thousand donations.";
    else if (focusedField === null) message = "Review & Launch. One final look before you go live!";


    return (
        // REMOVED CARD STYLING (no shadow, no explicit rounded-xl, near-transparent background)
        <div className="relative w-full h-full bg-black/[0.1] dark:bg-gray-900/[0.1] overflow-hidden transition-all duration-500">
            
            <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="#3b82f6" 
            />
            
            {/* The Spline Scene fills the entire background of this container */}
            <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
            />
            
            {/* Overlay for Text and Guide: Use pointer-events-none to let cursor events fall through 
                to the Spline canvas below it, allowing the robot to interact with the mouse. */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/50 to-transparent pointer-events-none">
                
                <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 dark:from-white dark:to-gray-200 pointer-events-auto">
                    Campaign Architect
                </h1>
                <p className="mt-2 text-lg text-neutral-300 dark:text-gray-400 max-w-lg transition-colors duration-500 pointer-events-auto">
                    {message}
                </p>
                
                {/* Step Indicator based on focusedField */}
                <div className="mt-8 space-y-3 pointer-events-auto">
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
                        isFocused={focusedField === null}
                    />
                </div>
            </div>

        </div>
    );
}

export default SplineCampaignVisual;
// src/pages/CreateCampaignPage.jsx

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LoaderCircle,
    Lightbulb,
    DollarSign,
    FileText,
    ImagePlus,
    X,
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    Info,
    Rocket,
} from 'lucide-react';
import Button from '../components/common/Button.jsx';
import Card from '../components/common/Card.jsx';
import Web3 from 'web3';
import { CROWDFUNDING_ABI, CROWDFUNDING_CONTRACT_ADDRESS } from '../constants';
import SplineCampaignVisual from '../components/SplineCampaignVisual.jsx'; 
import FullPageSpline from '../components/FullPageSpline.jsx';
import { useNotification } from '../contexts/NotificationProvider.jsx';

// Input Help Box Component (THEME UPDATED for sexy light/dark contrast)
const InputHelpBox = ({ title, text }) => (
    // Light: bg-blue-50/90, border-blue-300. Dark: bg-blue-500/10, border-blue-400/30
    <div className="mt-3 p-4 bg-blue-50/90 dark:bg-blue-500/10 border border-blue-300 dark:border-blue-400/30 rounded-xl text-sm transition-all duration-300 backdrop-blur-sm">
        <h4 className="font-semibold text-blue-800 dark:text-blue-300 flex items-center">
            <Info className="h-4 w-4 mr-2 flex-shrink-0" />
            {title}
        </h4>
        <p className="text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">{text}</p>
    </div>
);

// Step Progress Bar Component (MODIFIED to remove vertical connector lines)
const StepProgressBar = ({ currentStep, steps }) => (
    <nav aria-label="Progress">
        <ol role="list" className="flex items-center justify-between">
            {steps.map((step, index) => {
                const stepIndex = index + 1;
                const isCompleted = stepIndex < currentStep;
                const isCurrent = stepIndex === currentStep;

                return (
                    <li key={step.name} className={`relative flex-1 text-center`}>
                        {/* Circle */}
                        {isCompleted ? (
                            <div className="flex justify-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 shadow-lg shadow-blue-500/50 transition-all duration-300 z-10">
                                    <CheckCircle className="h-6 w-6 text-white" aria-hidden="true" />
                                </div>
                            </div>
                        ) : isCurrent ? (
                            <div className="flex justify-center" aria-current="step">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-600 dark:border-blue-400 bg-blue-500/20 shadow-lg shadow-blue-500/30 transition-all duration-300 z-10">
                                    {/* Number is dark in light mode, light in dark mode */}
                                    <span className="text-blue-600 dark:text-blue-300 font-bold text-lg">{step.id}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/50 transition-all duration-300 z-10">
                                    <span className="text-gray-500 dark:text-gray-400 text-lg">{step.id}</span>
                                </div>
                            </div>
                        )}

                        {/* Horizontal Connector Line (Stretching between circles) */}
                        {index !== steps.length - 1 && (
                            <div className="absolute top-0 mt-6 h-1 w-full flex justify-center items-center pointer-events-none">
                                <div className={`h-full w-[calc(100%-1rem)] transition-all duration-300 ${isCompleted ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`} />
                            </div>
                        )}
                    </li>
                );
            })}
        </ol>
    </nav>
);

// Main Create Campaign Page Component
const CreateCampaignPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        promptText: '',
        description: '',
        fundingGoal: '',
        deadline: '',
        category: 'Community',
        mediaFiles: [],
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // REVERTED to original 5 steps
    const steps = [
        { id: '01', name: 'The Spark' },
        { id: '02', name: 'The Story' },
        { id: '03', name: 'The Goal' },
        { id: '04', name: 'The Visuals' },
        { id: '05', name: 'Review & Launch' },
    ];
    
    // Handle input changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        // Crucial for robot consciousness: set focusedField on change to update instructional text
        setFocusedField(id);
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: null }));
        }
    };
    
    // Handle file uploads
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setFormData(prev => ({ ...prev, mediaFiles: [...prev.mediaFiles, ...files] }));
        if (errors.media) {
            setErrors(prev => ({ ...prev, media: null }));
        }
    };

    // Remove uploaded file
    const handleRemoveFile = (index) => {
        setFormData(prev => ({
            ...prev,
            mediaFiles: prev.mediaFiles.filter((_, i) => i !== index)
        }));
    };

    // Get today's date in YYYY-MM-DD format
    const getTodayString = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    // Validate current step
    const validateStep = () => {
        const newErrors = {};
        switch (currentStep) {
            case 1: // The Spark
                if (!formData.title.trim()) newErrors.title = "A catchy title is required.";
                if (formData.title.trim().length < 5) newErrors.title = "Title must be at least 5 characters.";
                break;
            case 2: // The Story
                if (!formData.description.trim()) newErrors.description = "Your story is essential.";
                if (formData.description.trim().length < 50) newErrors.description = "Story must be at least 50 characters to be compelling.";
                if (!formData.promptText.trim()) newErrors.promptText = "A brief goal helps donors understand quickly.";
                break;
            case 3: // The Goal
                if (!formData.fundingGoal) newErrors.fundingGoal = "Funding goal is required.";
                if (parseFloat(formData.fundingGoal) <= 0) newErrors.fundingGoal = "Funding goal must be greater than 0.";
                if (!formData.deadline) {
                    newErrors.deadline = "Campaign deadline is required.";
                } else {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const deadlineParts = formData.deadline.split('-').map(Number);
                    const selectedDate = new Date(deadlineParts[0], deadlineParts[1] - 1, deadlineParts[2]);
                    if (selectedDate < today) {
                        newErrors.deadline = "Deadline must be today or a future date.";
                    }
                }
                break;
            case 4: // The Visuals
                if (formData.mediaFiles.length === 0) newErrors.media = "At least one image or video is required.";
                break;
            default:
                break;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Navigate to next step
    const nextStep = () => {
        if (validateStep()) {
            if (currentStep < steps.length) {
                setCurrentStep(prev => prev + 1);
                setFocusedField(null); // Reset focus field on step change
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    // Navigate to previous step
    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
            setFocusedField(null); // Reset focus field on step change
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    
    // Handle campaign launch
    const handleLaunchCampaign = async (event) => {
        event.preventDefault();
        if (!validateStep()) {
            showNotification('Please review all steps, some information is missing.', 'error');
            setFocusedField(null);
            return;
        }
        setFocusedField('review'); // Set focus to review state for final visual check
        setIsLoading(true);

        // AI fraud detection check
        try {
            const aiResponse = await fetch('http://127.0.0.1:5001/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: formData.description }),
            });

            if (!aiResponse.ok) throw new Error('AI server responded with an error.');

            const aiData = await aiResponse.json();
            if (aiData.prediction !== 'Genuine') {
                showNotification(`Campaign Flagged: Our AI has doubts about this campaign (${aiData.prediction}). Please revise your description.`, 'error');
                setIsLoading(false);
                setCurrentStep(2);
                return;
            }

            showNotification('AI check passed! Please confirm the transaction in your wallet.', 'info');
        } catch (aiError) {
            console.error("AI prediction failed:", aiError);
            showNotification('Could not connect to the AI analysis server. Please proceed with caution.', 'warning');
        }

        try {
            // Check for MetaMask
            if (!window.ethereum) {
                showNotification('Please install MetaMask to create a campaign!', 'error');
                setIsLoading(false);
                return;
            }

            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            const userAddress = accounts[0];

            // Initialize contract
            const contract = new web3.eth.Contract(CROWDFUNDING_ABI, CROWDFUNDING_CONTRACT_ADDRESS);

            // Convert funding goal to Wei
            const targetInWei = web3.utils.toWei(formData.fundingGoal, 'ether');

            // Calculate deadline timestamp
            const deadlineParts = formData.deadline.split('-').map(Number);
            const deadlineDate = new Date(deadlineParts[0], deadlineParts[1] - 1, deadlineParts[2]);
            deadlineDate.setHours(23, 59, 59, 999);
            const deadlineInSeconds = Math.floor(deadlineDate.getTime() / 1000);

            // TODO: Upload mediaFiles to IPFS/Filecoin and get the hash
            const imageUrl = "https://placehold.co/600x400/94a3b8/ffffff?text=Daan+Campaign";

            // Create campaign on blockchain
            await contract.methods.createCampaign(
                userAddress,
                formData.title,
                formData.description,
                targetInWei,
                deadlineInSeconds,
                imageUrl
            ).send({ from: userAddress });

            showNotification('Campaign created successfully! Redirecting...', 'success');
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (error) {
            console.error("Error creating campaign:", error);
            showNotification(`Transaction failed: User denied transaction or an error occurred.`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Render step content
    const renderStepContent = () => {
        // UPDATED: Input Field Class - Changed bg-white/80 to bg-white/50
        const inputBaseClass = `w-full p-4 border rounded-xl text-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`;
        const errorInputClass = `!border-red-500 !ring-red-500`;
        
        // Label/Heading Text Class - Dark in Light mode, Light in Dark mode
        const labelTextClass = `text-gray-700 dark:text-gray-200`;
        const headingTextClass = `text-gray-900 dark:text-white`;
        const errorTextClass = `text-red-500 dark:text-red-400`;

        switch (currentStep) {
            case 1: // The Spark
                return (
                    <div key={1} className="animate-fadeIn space-y-6">
                        <h2 className={`font-bold text-3xl mb-6 flex items-center ${headingTextClass}`}>
                            <Lightbulb className="h-8 w-8 mr-3 text-yellow-600 dark:text-yellow-400 drop-shadow-lg" />
                            {steps[0].name}
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="title" className={`block text-lg font-semibold mb-3 ${labelTextClass}`}>
                                    What's your campaign's title?
                                </label>
                                <input 
                                    type="text" 
                                    id="title" 
                                    value={formData.title} 
                                    onChange={handleChange} 
                                    placeholder="e.g., Community Garden for our Neighborhood" 
                                    onFocus={() => setFocusedField('title')}
                                    onBlur={() => setFocusedField(null)}
                                    className={`${inputBaseClass} ${errors.title ? errorInputClass : ''}`} 
                                />
                                {errors.title && <p className={`${errorTextClass} text-sm mt-2 font-medium`}>{errors.title}</p>}
                                <InputHelpBox 
                                    title="Pro Tip"
                                    text="A great title is short, specific, and inspiring. Think about what would make *you* want to click!"
                                />
                            </div>
                            <div>
                                <label htmlFor="category" className={`block text-lg font-semibold mb-3 ${labelTextClass}`}>
                                    Which category does it fit best?
                                </label>
                                <select 
                                    id="category" 
                                    value={formData.category} 
                                    onChange={handleChange} 
                                    onFocus={() => setFocusedField('category')}
                                    onBlur={() => setFocusedField(null)}
                                    className={`${inputBaseClass} ${errors.category ? errorInputClass : ''} appearance-none cursor-pointer`}
                                >
                                    {/* Options must retain their high-contrast background for dropdown visibility */}
                                    <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Community</option>
                                    <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Health</option>
                                    <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Education</option>
                                    <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Environment</option>
                                    <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Technology</option>
                                </select>
                                {errors.category && <p className={`${errorTextClass} text-sm mt-2 font-medium`}>{errors.category}</p>}
                                <InputHelpBox 
                                    title="Why categorize?"
                                    text="This helps donors find your project. 'Community' is a great catch-all if you're not sure."
                                />
                            </div>
                        </div>
                    </div>
                );
            case 2: // The Story
                return (
                    <div key={2} className="animate-fadeIn space-y-6">
                        <h2 className={`font-bold text-3xl mb-6 flex items-center ${headingTextClass}`}>
                            <FileText className="h-8 w-8 mr-3 text-blue-600 dark:text-blue-400 drop-shadow-lg" />
                            {steps[1].name}
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="description" className={`block text-lg font-semibold mb-3 ${labelTextClass}`}>
                                    What's your "Why"?
                                </label>
                                <textarea 
                                    id="description" 
                                    rows="10" 
                                    value={formData.description} 
                                    onChange={handleChange} 
                                    placeholder="Tell your story... Why is this project important? Who will it help? Be detailed!" 
                                    onFocus={() => setFocusedField('description')}
                                    onBlur={() => setFocusedField(null)}
                                    className={`${inputBaseClass} ${errors.description ? errorInputClass : ''} resize-none`} 
                                />
                                {errors.description && <p className={`${errorTextClass} text-sm mt-2 font-medium`}>{errors.description}</p>}
                                <InputHelpBox 
                                    title="Be authentic!"
                                    text="This is the most important part. Be personal and clear. Explain the problem and how your project is the solution. A minimum of 50 characters is recommended."
                                />
                            </div>
                            <div>
                                <label htmlFor="promptText" className={`block text-lg font-semibold mb-3 ${labelTextClass}`}>
                                    What's the one-sentence summary?
                                </label>
                                <textarea 
                                    id="promptText" 
                                    rows="2" 
                                    value={formData.promptText} 
                                    onChange={handleChange} 
                                    placeholder="e.g., To build a garden where local families can grow their own fresh vegetables." 
                                    onFocus={() => setFocusedField('promptText')}
                                    onBlur={() => setFocusedField(null)}
                                    className={`${inputBaseClass} ${errors.promptText ? errorInputClass : ''} resize-none`} 
                                />
                                {errors.promptText && <p className={`${errorTextClass} text-sm mt-2 font-medium`}>{errors.promptText}</p>}
                                <InputHelpBox 
                                    title="The 'Elevator Pitch'"
                                    text="This short goal description is often shown on the campaign card. Make it count!"
                                />
                            </div>
                        </div>
                    </div>
                );
            case 3: // The Goal
                return (
                    <div key={3} className="animate-fadeIn space-y-6">
                        <h2 className={`font-bold text-3xl mb-6 flex items-center ${headingTextClass}`}>
                            <DollarSign className="h-8 w-8 mr-3 text-green-600 dark:text-green-400 drop-shadow-lg" />
                            {steps[2].name}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="fundingGoal" className={`block text-lg font-semibold mb-3 ${labelTextClass}`}>
                                    Funding Goal (in ETH)
                                </label>
                                <input 
                                    type="number" 
                                    id="fundingGoal" 
                                    step="0.01" 
                                    value={formData.fundingGoal} 
                                    onChange={handleChange} 
                                    placeholder="e.g., 5" 
                                    onFocus={() => setFocusedField('fundingGoal')}
                                    onBlur={() => setFocusedField(null)}
                                    className={`${inputBaseClass} ${errors.fundingGoal ? errorInputClass : ''}`} 
                                />
                                {errors.fundingGoal && <p className={`${errorTextClass} text-sm mt-2 font-medium`}>{errors.fundingGoal}</p>}
                                <InputHelpBox 
                                    title="Be realistic!"
                                    text="Start with the minimum amount you need to get your project off the ground. You can always raise more!"
                                />
                            </div>
                            <div>
                                <label htmlFor="deadline" className={`block text-lg font-semibold mb-3 ${labelTextClass}`}>
                                    When's the deadline?
                                </label>
                                <input 
                                    type="date" 
                                    id="deadline" 
                                    value={formData.deadline} 
                                    onChange={handleChange} 
                                    min={getTodayString()} 
                                    onFocus={() => setFocusedField('deadline')}
                                    onBlur={() => setFocusedField(null)}
                                    className={`${inputBaseClass} ${errors.deadline ? errorInputClass : ''}`} 
                                />
                                {errors.deadline && <p className={`${errorTextClass} text-sm mt-2 font-medium`}>{errors.deadline}</p>}
                                <InputHelpBox 
                                    title="Create urgency"
                                    text="Most successful campaigns run for 30-60 days. Don't set it too far in the future!"
                                />
                            </div>
                        </div>
                    </div>
                );
            case 4: // The Visuals
                return (
                    <div key={4} className="animate-fadeIn space-y-6">
                        <h2 className={`font-bold text-3xl mb-6 flex items-center ${headingTextClass}`}>
                            <ImagePlus className="h-8 w-8 mr-3 text-purple-600 dark:text-purple-400 drop-shadow-lg" />
                            {steps[3].name}
                        </h2>
                        <div>
                            <label className={`block text-lg font-semibold mb-3 ${labelTextClass}`}>
                                Campaign Media
                            </label>
                            <div 
                                // Light theme: bg-white/50
                                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer bg-white/50 dark:bg-gray-800/50 hover:bg-gray-100/70 dark:hover:bg-gray-800/80 transition-all duration-200 ${errors.media ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'}`}
                                onClick={() => {
                                    fileInputRef.current.click();
                                    setFocusedField('media');
                                }}
                                onFocus={() => setFocusedField('media')}
                                onBlur={() => setFocusedField(null)}
                                tabIndex={0}
                            >
                                <ImagePlus className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                                <p className={`mt-2 text-xl mb-2 text-gray-700 dark:text-gray-200`}>
                                    <span className="font-semibold text-blue-600 dark:text-blue-400">Upload Images & Videos</span>
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">A great cover image is essential.</p>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileChange} 
                                    multiple 
                                    accept="image/*,video/*" 
                                    className="hidden"
                                />
                            </div>
                            {errors.media && <p className={`${errorTextClass} text-sm mt-2 font-medium`}>{errors.media}</p>}
                            <InputHelpBox 
                                title="A picture is worth..."
                                text="Upload at least one high-quality image. A short video explaining your project is even better!"
                            />
                            {formData.mediaFiles.length > 0 && (
                                <div className="mt-6">
                                    <h4 className={`font-semibold mb-3 ${labelTextClass}`}>Uploaded Files:</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {formData.mediaFiles.map((file, index) => (
                                            <div key={index} className="relative aspect-square group">
                                                {file.type.startsWith('image/') ? 
                                                    <img 
                                                        src={URL.createObjectURL(file)} 
                                                        alt={`preview ${index}`} 
                                                        className="w-full h-full object-cover rounded-lg shadow-lg border border-gray-300 dark:border-gray-700" 
                                                    /> : 
                                                    <video 
                                                        src={URL.createObjectURL(file)} 
                                                        className="w-full h-full object-cover rounded-lg shadow-lg border border-gray-300 dark:border-gray-700" 
                                                    />
                                                }
                                                <Button 
                                                    variant="danger" 
                                                    size="icon" 
                                                    onClick={() => handleRemoveFile(index)} 
                                                    className="absolute top-2 right-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 5: // Review & Launch
                return (
                    <div key={5} className="animate-fadeIn space-y-6">
                        <h2 className={`font-bold text-3xl mb-6 flex items-center ${headingTextClass}`}>
                            <CheckCircle className="h-8 w-8 mr-3 text-green-600 dark:text-green-400 drop-shadow-lg" />
                            {steps[4].name}
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                            Does everything look correct? You're one step away from launching your campaign to the world.
                        </p>
                        
                        {/* Review Summary Box Styling - Translucent background/text for light/dark theme */}
                        <div className="space-y-4 rounded-xl border border-gray-300/80 p-6 bg-gray-100/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-xl">
                            <h3 className={`font-bold text-2xl mb-4 ${headingTextClass}`}>Your Campaign Summary</h3>
                            <div className="flow-root">
                                <dl className="divide-y divide-gray-300 dark:divide-gray-700">
                                    <div className="flex items-center justify-between py-3">
                                        <dt className="text-base font-medium text-gray-600 dark:text-gray-300">Title</dt>
                                        <dd className="text-base font-semibold text-gray-900 dark:text-white text-right max-w-xs truncate">{formData.title}</dd>
                                    </div>
                                    <div className="flex items-center justify-between py-3">
                                        <dt className="text-base font-medium text-gray-600 dark:text-gray-300">Category</dt>
                                        <dd className="text-base font-semibold text-gray-900 dark:text-white text-right">{formData.category}</dd>
                                    </div>
                                    <div className="flex items-center justify-between py-3">
                                        <dt className="text-base font-medium text-gray-600 dark:text-gray-300">Funding Goal</dt>
                                        <dd className="text-base font-semibold text-gray-900 dark:text-white text-right">{formData.fundingGoal} ETH</dd>
                                    </div>
                                    <div className="flex items-center justify-between py-3">
                                        <dt className="text-base font-medium text-gray-600 dark:text-gray-300">Deadline</dt>
                                        <dd className="text-base font-semibold text-gray-900 dark:text-white text-right">
                                            {formData.deadline ? new Date(formData.deadline).toLocaleDateString() : 'Not set'}
                                        </dd>
                                    </div>
                                    
                                    {/* REMOVED: ALLOCATION REVIEW */}
                                    {/* REMOVED: MILESTONE REVIEW */}

                                    <div className="flex items-center justify-between py-3">
                                        <dt className="text-base font-medium text-gray-600 dark:text-gray-300">Media Files</dt>
                                        <dd className="text-base font-semibold text-gray-900 dark:text-white text-right">{formData.mediaFiles.length} file(s)</dd>
                                    </div>
                                    <div className="flex flex-col py-3">
                                        <dt className="text-base font-medium text-gray-600 dark:text-gray-300 mb-2">Description</dt>
                                        <dd className="text-sm font-normal text-gray-700 dark:text-gray-300 whitespace-pre-wrap max-h-32 overflow-y-auto p-4 rounded-lg border border-gray-300 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/30 custom-scrollbar">
                                            {formData.description}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <main className="min-h-screen relative overflow-x-hidden">
            {/* 1. FIXED FULL-PAGE SPLINE BACKGROUND (Robot is here, shifted left and always active) */}
            <FullPageSpline />

            {/* 2. FIXED SPLINE VISUAL GUIDE OVERLAY (Instructional text layer on the left) */}
            <SplineCampaignVisual focusedField={focusedField} />
            
            {/* 3. SCROLLABLE CONTENT CONTAINER (z-20 and pushed to the right half) */}
            <div className="relative z-20 w-full min-h-screen">
                <div className="max-w-6xl mx-auto px-4 pt-32 pb-16">
                    
                    {/* --- Progress Bar --- */}
                    <div className="w-full lg:ml-[50%] lg:w-1/2 mb-8">
                        {/* THEME UPDATED: Changed bg-white/80 to bg-white/50 */}
                        <Card className="p-6 bg-white/50 dark:bg-black/30 backdrop-blur-2xl shadow-2xl border-gray-300/50 dark:border-white/10">
                            <StepProgressBar currentStep={currentStep} steps={steps} />
                        </Card>
                    </div>

                    {/* --- The Floating Form Card (Steps Content) --- */}
                    <div className="w-full lg:ml-[50%] lg:w-1/2">
                         {/* THEME UPDATED: Changed bg-white/80 to bg-white/50 */}
                         <Card className="p-8 sm:p-12 lg:p-16 bg-white/50 dark:bg-gray-900/50 backdrop-blur-2xl shadow-4xl shadow-blue-500/10 dark:shadow-purple-900/40 border-gray-300/50 dark:border-white/10">
                            <form onSubmit={handleLaunchCampaign} noValidate>
                                {/* --- Step Content --- */}
                                <div className="min-h-[500px]">
                                    {renderStepContent()}
                                </div>

                                {/* --- Navigation Buttons --- */}
                                {/* Border color is dark in light mode, gray in dark mode */}
                                <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-700 flex justify-between items-center">
                                    <Button 
                                        type="button"
                                        variant="outline"
                                        onClick={prevStep}
                                        disabled={currentStep === 1 || isLoading}
                                        className={`transition-all ${currentStep === 1 ? 'opacity-0 invisible' : 'opacity-100 visible'}`}
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back
                                    </Button>
                                    
                                    {currentStep < steps.length ? (
                                        <Button 
                                            type="button"
                                            variant="default"
                                            size="lg"
                                            onClick={nextStep}
                                        >
                                            Next
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    ) : (
                                        <Button 
                                            type="submit"
                                            size="lg"
                                            className="bg-green-600 hover:bg-green-700 focus:ring-green-500"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? <LoaderCircle className="animate-spin" /> : (
                                                <>
                                                    <Rocket className="h-5 w-5 mr-2" />
                                                    Launch Campaign
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </form>
                         </Card>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CreateCampaignPage;
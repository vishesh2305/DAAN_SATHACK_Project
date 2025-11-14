// src/pages/AuthPage.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// Ensure all Lucide icons, including Sun and Moon, are imported
import { ShieldCheck, LoaderCircle, Lock, User, Mail, Camera, AlertTriangle, Info, Sun, Moon } from 'lucide-react'; 
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useUser } from '../contexts/UserProvider';
import { useNotification } from '../contexts/NotificationProvider';
import AuthLayout from '../components/AuthLayout';
import { useTheme } from '../contexts/ThemeProvider'; // <-- CORRECT IMPORT

// --- STYLED HELPER COMPONENTS (Making all text dark for contrast on the light panel) ---

const InputGroup = ({ icon, children }) => (
    <div className="relative flex items-center">
        {/* Icons are explicitly dark grey in all modes for contrast */}
        <span className="absolute left-3 text-gray-400 dark:text-gray-500">
            {icon}
        </span>
        {/* Input is now clean, light, and high-contrast */}
        {React.cloneElement(children, { 
            className: `${children.props.className} pl-10 h-12 text-base 
                       !bg-white border-gray-300 text-gray-900 
                       placeholder-gray-500 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500` 
        })}
    </div>
);

const VerificationStatus = ({ message, isVerifying, isVerified }) => {
    let Icon = Info;
    let colorClass = 'text-gray-700 border-gray-300 bg-gray-100 dark:bg-gray-200 dark:border-gray-400';

    if (isVerifying) {
        Icon = () => <LoaderCircle className="animate-spin h-5 w-5" />;
        colorClass = 'text-blue-700 border-blue-400 bg-blue-100 dark:bg-blue-200 dark:border-blue-500';
    } else if (isVerified) {
        Icon = ShieldCheck;
        colorClass = 'text-green-700 border-green-400 bg-green-100 dark:bg-green-200 dark:border-green-500';
    } else if (message.toLowerCase().includes('failed') || message.toLowerCase().includes('error') || message.toLowerCase().includes('denied')) {
        Icon = AlertTriangle;
        colorClass = 'text-red-700 border-red-400 bg-red-100 dark:bg-red-200 dark:border-red-500';
    }

    // LIGHT STYLING: Clearly defined box with high contrast
    return (
        <div className={`flex items-center justify-start gap-2 text-sm p-3 rounded-lg border min-h-[50px] font-semibold ${colorClass}`}>
            <Icon className="h-5 w-5 flex-shrink-0" />
            <p className="text-left">{message}</p>
        </div>
    );
};


// --- AUTH LOGIC & RENDERING ---

const AuthPage = () => {
    const [isSignUp, setIsSignUp] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useUser();
    const { showNotification } = useNotification();
    const { theme, toggleTheme } = useTheme(); // <-- USE THEME HOOK

    const [formData, setFormData] = useState({
        fullName: '',
        dob: '',
        address: '',
        email: '',
        password: '',
        coordinates: { lat: null, lng: null }
    });

    const [docImage, setDocImage] = useState(null);
    const [docImageBase64, setDocImageBase64] = useState(null);
    const [selfieBase64, setSelfieBase64] = useState(null);
    const [isVerified, setIsVerified] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [showWebcam, setShowWebcam] = useState(false);
    const [verificationMessage, setVerificationMessage] = useState('Please upload an Aadhar Card to begin.');

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    // --- Original Logic (UNCHANGED) ---
    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const res = await fetch("https://ipapi.co/json/");
                const data = await res.json();
                setFormData(prev => ({
                    ...prev,
                    coordinates: {
                        lat: data.latitude,
                        lng: data.longitude
                    }
                }));
            } catch (err) {
                console.error("📡 Location fetch failed:", err);
            }
        };
        fetchLocation();
    }, []);

    useEffect(() => {
        if (location.state?.isSignUp !== undefined) {
            setIsSignUp(location.state.isSignUp);
        }
    }, [location.state]);

    const stopWebcam = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    }, []);

    useEffect(() => {
        const startWebcam = async () => {
            // FIX: Added videoRef.current check to prevent race condition before element mounts
            if (showWebcam && navigator.mediaDevices?.getUserMedia && videoRef.current) { 
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    streamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } catch (err) {
                    console.error("Webcam error:", err);
                    setVerificationMessage("Webcam access denied. Please enable camera permissions.");
                    setShowWebcam(false);
                }
            }
        };
        startWebcam();
        return () => stopWebcam();
    }, [showWebcam, stopWebcam]);

    const handleDocImageChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setDocImage(file);
            setShowWebcam(true);
            setVerificationMessage('Document selected. Position your face and click Verify.');

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1];
                setDocImageBase64(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleVerification = async () => {
        if (!docImage || !videoRef.current?.srcObject?.active || videoRef.current.videoWidth === 0) {
            setVerificationMessage("Camera not ready. Please wait a moment and try again.");
            return;
        }

        setIsVerifying(true);
        setVerificationMessage("Analyzing ID and face... Please hold still.");

        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
            if (!blob) {
                setIsVerifying(false);
                setVerificationMessage("Failed to capture face. Please try again.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1];
                setSelfieBase64(base64String);
            };
            reader.readAsDataURL(blob);

            const apiFormData = new FormData();
            apiFormData.append('document', docImage);
            apiFormData.append('live_face', blob, 'live_face.jpg');

            try {
                const response = await fetch('http://127.0.0.1:5000/upload', {
                    method: 'POST',
                    body: apiFormData,
                });

                const data = await response.json();

                if (response.ok && data.verification_status === "Verified") {
                    setVerificationMessage(data.message || "Verification successful!");
                    setIsVerified(true);
                    setShowWebcam(false);
                    stopWebcam();
                    setFormData(prev => ({
                        ...prev,
                        fullName: data.extracted_data.name || '',
                        dob: data.extracted_data.dob || '',
                        address: data.extracted_data.address || ''
                    }));
                } else {
                    setVerificationMessage(data.message || "Verification failed. The face may not match the ID.");
                    setIsVerified(false);
                }
            } catch (error) {
                console.error("Verification API Error:", error);
                setVerificationMessage("Verification failed. The server might be offline.");
            } finally {
                setIsVerifying(false);
            }
        }, 'image/jpeg');
    };


    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        const apiEndpoint = isSignUp ? "http://localhost:3000/api/signup" : "http://localhost:3000/api/login";
        const isLogin = !isSignUp;

        const bodyPayload = isLogin ? {
            email: formData.email,
            password: formData.password
        } : {
            name: formData.fullName,
            dob: formData.dob,
            location: formData.address,
            email: formData.email,
            password: formData.password,
            govtImage: docImageBase64,
            selfieImage: selfieBase64,
            blockchainAddress: "0x123abc456def789ghi", // Replace with actual address
            coordinates: formData.coordinates,
        };

        try {
            const res = await fetch(apiEndpoint, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyPayload),
            });

            const data = await res.json();
            if (res.ok) {
                login(data.user || formData);
                navigate("/dashboard");
            } else {
                showNotification(`${isLogin ? 'Login' : 'Signup'} failed: ${data.error}`, "error");
            }
        } catch (err) {
            console.error(`${isLogin ? 'Login' : 'Signup'} error:`, err);
            showNotification(`${isLogin ? 'Login' : 'Signup'} failed due to a network error.`, "error");
        }
    };
    
    const resetAuthState = (targetIsSignUp) => {
        setIsSignUp(targetIsSignUp);
        setIsVerified(false);
        setShowWebcam(false);
        setDocImage(null);
        setDocImageBase64(null);
        setSelfieBase64(null);
        setVerificationMessage('Please upload an Aadhar Card to begin.');
        setFormData({ ...formData, email: '', password: '' });
        stopWebcam();
    };


    // --- RENDER METHODS ---

    const renderVerificationStep = () => (
        <div className="space-y-4 animate-fade-in">
            {/* FUNKY TEXT: Blue/Purple Gradient, bold, drop shadow */}
            <h3 className="font-extrabold text-center text-2xl flex items-center justify-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-800 drop-shadow-md">
                <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-700" />
                Step 1: Identity & Face Verification
            </h3>

            <div>
                <label htmlFor="doc-upload" className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-800">Upload Aadhaar Card</label>
                {/* HIGH-CONTRAST UPLOAD BOX - Theme-aware border/background */}
                <label htmlFor="doc-upload" className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-gray-100 dark:bg-gray-200 border-2 border-gray-300 dark:border-blue-400/50 border-dashed rounded-lg cursor-pointer hover:border-blue-500 shadow-sm">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Camera className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-600" />
                        <p className="mb-1 text-sm text-gray-500">
                            {docImage ? <span className="font-semibold text-gray-900">{docImage.name}</span> : <span><span className="font-semibold text-blue-600">Click to upload</span> or drag and drop</span>}
                        </p>
                    </div>
                    <input id="doc-upload" type="file" accept="image/*" onChange={handleDocImageChange} className="opacity-0 w-0 h-0" />
                </label>
            </div>
            
            {showWebcam && (
                <div className="space-y-2 animate-fade-in">
                     <p className="text-sm font-semibold text-center text-gray-700 dark:text-gray-800">Live Selfie Preview</p>
                    {/* Dark background for video, light card border */}
                    <video ref={videoRef} autoPlay playsInline muted className="w-full rounded-lg border-2 border-gray-300 dark:border-blue-500/70 aspect-video object-cover bg-gray-900/90 shadow-inner" />
                    <canvas ref={canvasRef} className="hidden"></canvas>
                </div>
            )}

            <Button 
                onClick={handleVerification} 
                disabled={!docImage || isVerifying || !showWebcam} 
                className="w-full !mt-6 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/40 font-bold"
            >
                {isVerifying ? (
                    <>
                        <LoaderCircle className="animate-spin mr-2 h-5 w-5" /> Verifying...
                    </>
                ) : (
                    <>
                        <Camera className="mr-2 h-5 w-5" /> Verify Identity
                    </>
                )}
            </Button>
            
            <VerificationStatus message={verificationMessage} isVerifying={isVerifying} isVerified={isVerified} />
        </div>
    );

    const renderAuthForm = () => (
        <form onSubmit={handleAuthSubmit} className="space-y-4 animate-fade-in">
            {isSignUp && (
                 <div className="p-4 border rounded-lg border-blue-400/50 bg-blue-50/70 dark:bg-blue-200/50 space-y-3 shadow-inner">
                    {/* FUNKY TEXT: Green/Teal Gradient, bold, drop shadow */}
                    <h3 className="font-extrabold text-center text-2xl flex items-center justify-center gap-2 mb-3 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600 drop-shadow-md">
                         <User className="h-6 w-6 text-green-600 dark:text-green-700" />
                         Step 2: Complete Your Profile
                    </h3>
                    <div className="text-sm">
                        <label className="font-semibold text-gray-600 dark:text-gray-700">Full Name</label>
                        {/* HIGH-CONTRAST DATA DISPLAY - Theme-aware background */}
                        <p className="p-2 rounded-lg bg-white dark:bg-gray-100 text-gray-900 font-medium mt-1 border border-gray-300 shadow-sm">{formData.fullName || 'N/A'}</p>
                    </div>
                     <div className="text-sm">
                        <label className="font-semibold text-gray-600 dark:text-gray-700">Date of Birth</label>
                        <p className="p-2 rounded-lg bg-white dark:bg-gray-100 text-gray-900 font-medium mt-1 border border-gray-300 shadow-sm">{formData.dob || 'N/A'}</p>
                    </div>
                      <div className="text-sm">
                        <label className="font-semibold text-gray-600 dark:text-gray-700">Address</label>
                        <p className="p-2 rounded-lg bg-white dark:bg-gray-100 text-gray-900 font-medium mt-1 border border-gray-300 shadow-sm">{formData.address || 'N/A'}</p>
                    </div>
                 </div>
            )}

            <InputGroup icon={<Mail size={18} />}>
                <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleFormInputChange} required className="block w-full p-3 border rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-offset-white" />
            </InputGroup>

            <InputGroup icon={<Lock size={18} />}>
                <input name="password" type="password" placeholder="Password" onChange={handleFormInputChange} required className="block w-full p-3 border rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-offset-white" />
            </InputGroup>

            <Button type="submit" size="lg" className="w-full !mt-6 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/40 font-bold" disabled={isSignUp && !isVerified}>
                {isSignUp ? 'Create Account & Sign In' : 'Sign In'}
            </Button>
        </form>
    );

    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            
            {/* Two-Panel Layout Container */}
            <AuthLayout isSignUpMode={isSignUp}>
                
                {/* --- THEME TOGGLE BUTTON --- */}
                {/* Positioned absolutely within the light form panel content */}
                <button
                    onClick={toggleTheme}
                    className="absolute top-6 right-6 p-2 rounded-full text-gray-700 dark:text-gray-800 bg-gray-100/50 dark:bg-gray-200/80 border border-gray-300 dark:border-gray-500 hover:bg-gray-100 transition-colors z-20 shadow-md"
                    title="Toggle Theme"
                >
                    {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                {/* --------------------------- */}

                <header className="mb-8">
                    {/* FUNKY TEXT: Main Heading with Gradient */}
                    <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-800 drop-shadow-sm">
                        {isSignUp ? 'Verify Your Identity' : 'Secure Sign-In'}
                    </h2>
                    <p className="text-md text-gray-600 dark:text-gray-700 mt-1">
                        {isSignUp ? 'Your first step to a transparent future.' : 'Access your decentralized dashboard.'}
                    </p>
                </header>
                
                {/* FIX: Removed flex-grow flex flex-col justify-center classes for content compatibility */}
                <div className="flex flex-col"> 
                    {isSignUp ? (
                        isVerified ? renderAuthForm() : renderVerificationStep()
                    ) : (
                        renderAuthForm()
                    )}
                </div>

                <p className="text-center text-sm text-gray-500 dark:text-gray-600 mt-8">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                    <button onClick={() => resetAuthState(!isSignUp)} className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-700 dark:hover:text-blue-600 ml-1">
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                </p>
            </AuthLayout>
        </main>
    );
};

export default AuthPage;
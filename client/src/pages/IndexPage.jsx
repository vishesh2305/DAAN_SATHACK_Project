import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, CheckCircle, Users, Target, Zap, DollarSign, Globe, TrendingUp } from 'lucide-react';

// Import your assets
import landing_video from "../assets/videos/landing_background.mp4";
import secure_authentication_image from "../assets/images/secure_authentication_landingpage.png";
import increasing_fund_image from "../assets/images/increasing_funds_landingPage.png";

// --- NEW CSS-ONLY BACKGROUND GRAPHIC (FIXED for DARK MODE VISIBILITY) ---
const BackgroundGrid = () => (
    <div className="absolute inset-0 z-0 overflow-hidden">
        <style>
            {`
            .bg-grid-animation {
                position: absolute;
                inset: -100%; 
                /* Base lines use a much darker blue for visibility in light mode */
                background-size: 80px 80px; 
                background-image: linear-gradient(to right, #2563eb 1px, transparent 1px), 
                                  linear-gradient(to bottom, #2563eb 1px, transparent 1px);
                animation: pulse-grid 20s infinite alternate;
                opacity: 0.5; 
                transform: scale(2) rotate(15deg);
                filter: blur(1px); 
                
                /* GLOW EFFECT using pseudo-elements */
                /* Horizontal glow */
                &::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-size: 80px 80px;
                    background-image: linear-gradient(to right, #2563eb 1px, transparent 1px);
                    animation: pulse-grid 20s infinite alternate;
                    filter: blur(5px); 
                    opacity: 0.4; 
                }
                /* Vertical glow */
                &::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-size: 80px 80px;
                    background-image: linear-gradient(to bottom, #2563eb 1px, transparent 1px);
                    animation: pulse-grid 20s infinite alternate;
                    filter: blur(5px); 
                    opacity: 0.4; 
                }
            }

            .dark .bg-grid-animation {
                /* FIX: Switched to a bright, almost neon blue (#4299e1 is Tailwind blue-500) */
                background-image: linear-gradient(to right, #4299e1 1px, transparent 1px), 
                                  linear-gradient(to bottom, #4299e1 1px, transparent 1px);
                /* FIX: Increased base opacity in dark mode */
                opacity: 0.5; 

                &::before {
                    background-image: linear-gradient(to right, #4299e1 1px, transparent 1px);
                    /* FIX: Significantly increased glow opacity in dark mode */
                    opacity: 0.5; 
                }
                &::after {
                    background-image: linear-gradient(to bottom, #4299e1 1px, transparent 1px);
                    /* FIX: Significantly increased glow opacity in dark mode */
                    opacity: 0.5; 
                }
            }

            @keyframes pulse-grid {
                0% { background-position: 0% 0%; }
                100% { background-position: 100% 100%; }
            }
            `}
        </style>
        <div className="bg-grid-animation" />
    </div>
);
// ----------------------------------------

// --- ADVANCED CARD COMPONENT LOGIC ---
const HowItWorksCard = ({ icon: Icon, step, title, description }) => (
    // Outer Container: Adds perspective and groups hover effect
    <div className="relative group hover:z-20">
        {/* Layer 1: Gradient Border/Shadow Base */}
        <div className="p-0.5 rounded-2xl transition-all duration-700 ease-out 
                        bg-gradient-to-br from-blue-500/50 to-purple-600/50 
                        shadow-2xl shadow-purple-600/20 dark:shadow-purple-600/10 
                        group-hover:shadow-4xl group-hover:shadow-blue-500/40"
        >
            {/* Layer 2: Main Content Panel (The core of the visual design) */}
            <div className="p-8 rounded-2xl h-full bg-white dark:bg-gray-900/90 backdrop-blur-md 
                            transform transition-all duration-700 ease-out 
                            group-hover:-translate-y-2 group-hover:scale-[1.02] 
                            border border-gray-100 dark:border-gray-700"
            >
                {/* 1. ICON & STEP COUNTER: High Contrast Top Bar */}
                <div className="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                    {/* The Icon Container */}
                    <div className="inline-flex items-center justify-center h-14 w-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg shadow-blue-500/30">
                        <Icon className="h-7 w-7 text-white" />
                    </div>
                    {/* STEP NUMBER: Large, stylized, glowing text */}
                    <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 drop-shadow-lg transition-opacity duration-700">
                        {step}
                    </span>
                </div>
                
                {/* 2. TITLE & DESCRIPTION */}
                <h3 className="text-2xl font-extrabold mb-3 text-gray-900 dark:text-white">
                    {title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    {description}
                </p>
            </div>
        </div>
        {/* Dynamic Glow Element (More dramatic effect on hover) */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-70 
                        transition-opacity duration-700 ease-out 
                        bg-gradient-to-br from-blue-500/50 to-purple-600/50 blur-xl z-[-1]" />
    </div>
);
// ----------------------------------------


const IndexPage = () => {

    return (
        <main className="animate-fade-in bg-white dark:bg-gray-950 text-gray-900 dark:text-white">

            {/* --- 1. WHAT (Hero) --- */}
            <section className="relative flex items-center justify-center h-screen min-h-[700px] overflow-hidden">
                {/* Background Video Layer */}
                <div className="absolute top-0 left-0 w-full h-full z-0">
                    <video
                        src={landing_video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                    {/* Artistic Overlay */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 via-black/30 to-black/10 z-10"></div>
                </div>

                {/* Content Layer */}
                <div className="relative z-20 container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-white">
                        Fundraising Forged on the Blockchain.
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                            Verifiably Secure. Unbreakably Transparent.
                        </span>
                    </h1>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link 
                            to="/create" 
                            className="inline-flex items-center justify-center text-lg font-semibold px-8 py-4 rounded-lg 
                                       bg-gradient-to-r from-blue-500 to-purple-600 text-white 
                                       shadow-lg shadow-blue-500/30
                                       hover:from-blue-600 hover:to-purple-700 hover:-translate-y-1 transform transition-all duration-300"
                        >
                            Start Your Campaign <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </section>
            
            {/* --- 2. WHAT IS DAAN? (THE MOST INTERESTING PART) --- */}
            <section className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-950">
                <div className="container mx-auto px-4 text-center max-w-7xl">
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest">The Core Difference</span>
                    
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-12">
                        Daan: Beyond Trust. <br className='hidden sm:inline'/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                            Proven Transparency.
                        </span>
                    </h2>

                    {/* 4-Column Stats Section (The primary visual anchor) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-6xl mx-auto">
                        {[
                            { value: "85.4 ETH", label: "Total Funds Raised", icon: DollarSign, color: "from-green-500 to-teal-500" },
                            { value: "1,200+", label: "Verified Campaigns", icon: ShieldCheck, color: "from-blue-500 to-purple-600" },
                            { value: "5,000+", label: "Global Donors", icon: Globe, color: "from-red-500 to-yellow-500" },
                            { value: "Crypto Proof", label: "of Every Donation", icon: Zap, color: "from-yellow-500 to-orange-500" },
                        ].map((stat, index) => (
                            <div 
                                key={index}
                                className={`p-6 rounded-2xl border border-gray-300/50 dark:border-gray-700/50 backdrop-blur-sm shadow-xl 
                                            bg-white/70 dark:bg-gray-800/70 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300`}
                            >
                                <div className={`inline-flex items-center justify-center h-12 w-12 rounded-full mb-3 
                                                bg-gradient-to-r ${stat.color} shadow-lg shadow-black/20`}>
                                    {React.createElement(stat.icon, { className: 'h-6 w-6 text-white' })}
                                </div>
                                <p className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">{stat.value}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Detailed Feature Cards (4-Column) */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mt-16">
                         {[
                            { title: "Verifiable Security", text: "Aadhaar authentication ensures every creator is real and accountable.", icon: ShieldCheck },
                            { title: "Unbreakable Proof", text: "Every donation is a public, immutable transaction on the blockchain.", icon: CheckCircle },
                            { title: "Yield-Earning Funds", text: "Funds are invested via Aave, earning interest while waiting for project milestones.", icon: TrendingUp },
                            { title: "Global Reach", text: "Accept contributions instantly from MetaMask users around the world.", icon: Users },
                        ].map((feature, index) => (
                            <div 
                                key={index}
                                className="text-left p-6 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg transform hover:-translate-y-1 transition-transform duration-300"
                            >
                                <div className="inline-flex items-center justify-center h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                                    {React.createElement(feature.icon, { className: 'h-5 w-5 text-blue-600 dark:text-blue-400' })}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* --- 3. WHY: The Problem & Solution (CENTERED FIX) --- */}
            <section className="relative py-20 lg:py-32 overflow-hidden bg-white dark:bg-gray-900">
                {/* Background Graphic Layer */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src={secure_authentication_image} 
                        alt="Secure Authentication" 
                        className="w-full h-full object-cover opacity-20 dark:opacity-10" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 via-white/90 dark:via-gray-900/90 to-transparent"></div>
                </div>

                {/* Content Layer */}
                <div className="relative z-10 container mx-auto px-4">
                    {/* FIX: Added max-w-5xl mx-auto to center and constrain the grid content */}
                    <div className="max-w-5xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            {/* Left Column: Text and List */}
                            <div>
                                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">The Daan Difference</span>
                                <h2 className="text-4xl md:text-5xl font-bold my-4">
                                    Why Trust When You Can <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Verify?</span>
                                
                                </h2>
                                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                                    Traditional crowdfunding is a black box. Funds disappear, projects stall, and trust is broken. 
                                    We built Daan to end this. Our platform is founded on <strong className="text-gray-900 dark:text-white">provable trust</strong>, 
                                    creating a new standard for both creators and donors.
                                </p>
                                <ul className="space-y-3 text-lg">
                                    <li className="flex items-center">
                                        <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                                        <strong>Immutable Transparency:</strong> Every transaction is a public record.
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                                        <strong>Creator Accountability:</strong> Aadhaar verification links every campaign to a real identity.
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                                        <strong>Donor Security:</strong> Funds move directly via secure MetaMask wallets.
                                    </li>
                                </ul>
                            </div>
                            {/* Right Column: Comparison Card */}
                            <div className="p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl shadow-blue-500/10">
                                <h3 className="text-2xl font-semibold mb-4 text-center">The Old Way vs. The Daan Way</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-bold text-lg text-red-600 dark:text-red-400 mb-2">Traditional</h4>
                                        <ul className="space-y-2 list-disc list-inside text-gray-500 dark:text-gray-400">
                                            <li>Opaque fund handling</li>
                                            <li>Anonymous creators</li>
                                            <li>High platform fees</li>
                                            <li>Risk of fraud</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-green-600 dark:text-green-400 mb-2">Daan (Web3)</h4>
                                        <ul className="space-y-2 list-disc list-inside text-gray-700 dark:text-gray-200">
                                            <li>On-chain transparency</li>
                                            <li>Verified identities</li>
                                            <li>Decentralized control</li>
                                            <li>Cryptographically secure</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 4. HOW: The Mechanism (ADVANCED CARDS) --- */}
            <section className="relative py-20 lg:py-32 bg-gray-100 dark:bg-black overflow-hidden">
                
                {/* REPLACED BACKGROUND IMAGE with CSS Grid */}
                <BackgroundGrid />

                {/* Content Layer (Stays on top) */}
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        How It Works: A Transparent 3-Step Journey
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-16">
                        We've engineered a process that builds trust at every step, from creation to completion.
                    </p>
                    <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                        
                        {/* CARD 1: Verify & Create */}
                        <HowItWorksCard 
                            step="01"
                            icon={ShieldCheck} 
                            title="Verify & Create"
                            description="Secure your identity in minutes with our Face Recognition and Aadhaar OCR scan to prove you're a real, accountable person."
                        />

                        {/* CARD 2: Share & Collect */}
                         <HowItWorksCard 
                            step="02"
                            icon={Users} 
                            title="Share & Collect"
                            description="Launch your campaign and share your vision. Receive contributions directly and securely to your MetaMask wallet from a global community."
                        />
                        
                        {/* CARD 3: Watch It Grow */}
                        <HowItWorksCard 
                            step="03"
                            icon={Target} 
                            title="Watch It Grow"
                            description="Our unique bot puts idle funds to work in the Aave protocol, earning interest to help you exceed your goal. A new era of smart fundraising."
                        />
                    </div>
                </div>
            </section>
            
            {/* --- 5. WHO & 6. WHERE: The Audience & Platform --- */}
            <section className="relative py-20 lg:py-40 text-center overflow-hidden bg-white dark:bg-gray-950">
                
                <div className="absolute inset-0 z-0 flex items-center justify-center">
                    <img 
                        src={increasing_fund_image} 
                        alt="Increasing Funds Graphic" 
                        className="w-3/4 lg:w-1/2 h-auto object-contain opacity-40 dark:opacity-30 blur-sm rotate-6" 
                    />
                </div>

                <div className="relative z-10 container mx-auto px-4">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600">Who</span> Is This For? 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600">Where</span> Is This Used?
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-16">
                        Daan is a global, decentralized platform for visionaries and the communities that believe in them.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
                        <div className="bg-white/50 dark:bg-gray-800/50 p-8 rounded-2xl border border-gray-200 dark:border-white/10 backdrop-blur-lg shadow-xl">
                            <h3 className="text-3xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">For Creators</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Whether you're an artist, innovator, or community leader, Daan gives you the tools to
                                launch a campaign built on verifiable trust.
                            </p>
                            <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-300">
                                <li>Launch tech & Web3 innovations</li>
                                <li>Fund creative projects (film, music, art)</li>
                                <li>Build community initiatives</li>
                            </ul>
                        </div>
                        
                        <div className="bg-white/50 dark:bg-gray-800/50 p-8 rounded-2xl border border-gray-200 dark:border-white/10 backdrop-blur-lg shadow-xl">
                            <h3 className="text-3xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-500">For Donors</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Fund the future with absolute certainty. Browse campaigns from verified creators. Track your
                                donation on the blockchain and know *exactly* where your money goes.
                            </p>
                            <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-300">
                                <li>Donate with confidence</li>
                                <li>Verify creator identities</li>
                                <li>Track all funds transparently</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 7. WHEN: The Call to Action --- */}
            <section className="relative py-20 lg:py-32 text-center overflow-hidden bg-gray-50 dark:bg-gray-900">
                {/* Background Glow Layer */}
                <div className="absolute inset-x-0 bottom-0 z-0">
                    <div className="w-full h-80 bg-gradient-to-t from-blue-500/20 dark:from-blue-600/30 via-purple-500/10 dark:via-purple-600/10 to-transparent blur-3xl" />
                </div>
                
                {/* Content Layer */}
                <div className="relative z-10 container mx-auto px-4">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        The Future Is Not Waiting.
                        <br />
                        When Will You Begin?
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
                        Join a new generation of creators and backers building the future on a foundation of
                        provable trust and innovation.
                    </p> 
                    <Link 
                        to="/create" 
                        className="inline-flex items-center justify-center text-xl font-semibold px-10 py-5 rounded-lg 
                                   bg-gradient-to-r from-blue-500 to-purple-600 text-white 
                                   shadow-2xl shadow-blue-500/40
                                   hover:from-blue-600 hover:to-purple-700 hover:-translate-y-1 transform transition-all duration-300"
                    >
                        Create Your Campaign Now
                        <ArrowRight className="ml-3 h-6 w-6" />
                    </Link>
                </div>
            </section>

        </main>
    );
};

export default IndexPage;
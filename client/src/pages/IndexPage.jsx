import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, CheckCircle, Users, Target } from 'lucide-react';

// Import your assets
import landing_video from "../assets/videos/landing_background.mp4";
import secure_authentication_image from "../assets/images/secure_authentication_landingpage.png";
import blockchain_image from "../assets/images/blockchain_landingpage.png";
import increasing_fund_image from "../assets/images/increasing_funds_landingPage.png";

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
                    {/* MODIFIED: Removed 'shadow-black/50 shadow-lg' */}
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
            
            {/* --- NEW SECTION: "WHAT" (The First Paragraph) --- */}
            <section className="py-20 lg:py-24 bg-white dark:bg-gray-950">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-semibold mb-6">What is Daan?</h2>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Daan is a decentralized crowdfunding platform that transforms how ideas are funded. 
                        We replace uncertainty with cryptographic proof, ensuring every donation is secure, 
                        every creator is Aadhaar-verified, and every contribution is transparently recorded on the blockchain.
                    </p>
                </div>
            </section>

            {/* --- 2. WHY: The Problem & Solution --- */}
            <section className="relative py-20 lg:py-32 overflow-hidden bg-gray-50 dark:bg-gray-900">
                {/* Background Graphic Layer */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src={secure_authentication_image} 
                        alt="Secure Authentication" 
                        className="w-full h-full object-cover opacity-20 dark:opacity-10" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-gray-900 via-gray-50/90 dark:via-gray-900/90 to-transparent"></div>
                </div>

                {/* Content Layer */}
                <div className="relative z-10 container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">The Daan Difference</span>
                            <h2 className="text-4xl md:text-5xl font-bold my-4">
                                Why Trust When You Can <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Verify?</span>
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                                Traditional crowdfunding is a black box. Funds disappear, projects stall, and trust is broken. 
                                We built Daan to end this. Our platform is founded on <strong className="text-gray-900 dark:text-white">provable trust</strong>, 
                                creating a new standard for both creators and donors.
                            </p>
                            <ul className="space-y-4 text-lg">
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
                        {/* UPDATED: Glassmorphic, theme-aware card */}
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
            </section>

            {/* --- 3. HOW: The Mechanism (MODIFIED SECTION) --- */}
            <section className="relative py-20 lg:py-32 bg-gray-100 dark:bg-black overflow-hidden">
                
                {/* MODIFIED Background Graphic Layer */}
                <div className="absolute inset-0 z-0 flex items-center justify-center">
                    <img 
                        src={blockchain_image} 
                        alt="Blockchain Network Graphic" 
                        className="w-3/4 lg:w-1/2 h-auto object-contain opacity-40 dark:opacity-30 blur-sm -rotate-12" 
                    />
                </div>

                {/* Content Layer (Stays on top) */}
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        How It Works: A Transparent 3-Step Journey
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-16">
                        We've engineered a process that builds trust at every step, from creation to completion.
                    </p>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* UPDATED: Theme-aware cards */}
                        <div className="bg-white/50 dark:bg-gray-800/50 p-8 rounded-2xl border border-gray-200 dark:border-white/10 backdrop-blur-lg transform hover:-translate-y-2 transition-transform duration-300 shadow-xl hover:shadow-blue-500/20">
                            <div className="inline-flex items-center justify-center h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
                                <ShieldCheck className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-2">1. Verify & Create</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Secure your identity in minutes with our Face Recognition and Aadhaar OCR scan to prove
                                you're a real, accountable person.
                            </p>
                        </div>
                        <div className="bg-white/50 dark:bg-gray-800/50 p-8 rounded-2xl border border-gray-200 dark:border-white/10 backdrop-blur-lg transform hover:-translate-y-2 transition-transform duration-300 shadow-xl hover:shadow-blue-500/20">
                            <div className="inline-flex items-center justify-center h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
                                <Users className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-2">2. Share & Collect</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Launch your campaign and share your vision. Receive contributions directly and securely 
                                to your MetaMask wallet from a global community.
                            </p>
                        </div>
                        <div className="bg-white/50 dark:bg-gray-800/50 p-8 rounded-2xl border border-gray-200 dark:border-white/10 backdrop-blur-lg transform hover:-translate-y-2 transition-transform duration-300 shadow-xl hover:shadow-blue-500/20">
                            <div className="inline-flex items-center justify-center h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
                                <Target className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-2">3. Watch It Grow</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Our unique bot puts idle funds to work in the Aave protocol, earning interest to 
                                help you exceed your goal. A new era of smart fundraising.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* --- 4. WHO & 5. WHERE: The Audience & Platform (MODIFIED SECTION) --- */}
            {/* UPDATED: Changed background from wallpaper to a simple color */}
            <section className="relative py-20 lg:py-40 text-center overflow-hidden bg-white dark:bg-gray-950">
                
                {/* MODIFIED Background Graphic Layer (to make it stand out) */}
                <div className="absolute inset-0 z-0 flex items-center justify-center">
                    <img 
                        src={increasing_fund_image} 
                        alt="Increasing Funds Graphic" 
                        className="w-3/4 lg:w-1/2 h-auto object-contain opacity-40 dark:opacity-30 blur-sm rotate-6" 
                    />
                </div>

                {/* Content Layer (Stays on top) */}
                <div className="relative z-10 container mx-auto px-4">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600">Who</span> Is This For? 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600">Where</span> Is This Used?
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-16">
                        Daan is a global, decentralized platform for visionaries and the communities that believe in them.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-8 text-left">
                        {/* UPDATED: Theme-aware cards */}
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

            {/* --- 6. WHEN: The Call to Action --- */}
            {/* UPDATED: Theme-aware */}
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
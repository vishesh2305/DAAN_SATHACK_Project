// src/pages/ProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    LoaderCircle, 
    Pencil, 
    Target, 
    Heart, 
    Users, 
    CheckCircle,
    Copy,
    Clock,
    DollarSign,
    Gift,
    UserCheck
} from 'lucide-react';
import Web3 from 'web3';
import { CROWDFUNDING_ABI, CROWDFUNDING_CONTRACT_ADDRESS } from '../constants';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useUser } from '../contexts/UserProvider';
import ProgressBar from '../components/common/ProgressBar';
import { useNotification } from '../contexts/NotificationProvider';
import { getOrganizerProfile } from '../data/mockData'; 
// import FormWatcher has been removed

// ... (devDefaultUser remains unchanged) ...
const devDefaultUser = {
  avatar: "https://placehold.co/100x100/E0E7FF/4F46E5?text=U",
  name: "Test User",
  email: "test@example.com"
};

// CampaignRowCard: Maintains glossy aesthetic
const CampaignRowCard = ({ campaign, isOwner, onClaim, isClaiming }) => {
    const isExpired = Date.now() > campaign.deadline;
    const daysLeft = isExpired ? 0 : Math.ceil((new Date(campaign.deadline) - Date.now()) / (1000 * 60 * 60 * 24));
    
    let statusBadge;
    if (campaign.claimed) {
        statusBadge = (
            <div className="flex items-center text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-0.5 rounded-full">
                <CheckCircle className="h-3 w-3 mr-1" /> Claimed
            </div>
        );
    } else if (isExpired) {
        statusBadge = (
            <div className="flex items-center text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                <Clock className="h-3 w-3 mr-1" /> Ended
            </div>
        );
    } else {
         statusBadge = (
            <div className="flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded-full">
                <Clock className="h-3 w-3 mr-1" /> {daysLeft} {daysLeft === 1 ? 'Day' : 'Days'} Left
            </div>
        );
    }

    // AESTHETIC CHANGE: Thicker border, glossy background, colored shadow hover
    return (
        <Card className="p-4 w-full transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30 
                        !bg-white/40 dark:!bg-gray-800/40 backdrop-blur-sm 
                        border border-blue-400/50 dark:border-blue-700/50">
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <img 
                    src={campaign.image} 
                    alt={campaign.title} 
                    className="w-full sm:w-32 h-32 sm:h-24 rounded-lg object-cover flex-shrink-0 shadow-lg" 
                />
                <div className="flex-grow w-full">
                    <div className="flex justify-between items-start mb-1">
                        <h4 className="font-extrabold text-lg text-gray-900 dark:text-white">{campaign.title}</h4>
                        {statusBadge}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {/* Bold typography for numbers */}
                        <span className="font-extrabold text-gray-900 dark:text-white">{campaign.amountCollected} ETH</span> raised of {campaign.target} ETH
                    </p>
                    <ProgressBar current={campaign.amountCollected} target={campaign.target} />
                </div>
                <div className="w-full sm:w-auto flex-shrink-0">
                    {isOwner && isExpired && !campaign.claimed ? (
                        <Button onClick={() => onClaim(campaign.id)} disabled={isClaiming === campaign.id} className="w-full">
                            {isClaiming === campaign.id ? <LoaderCircle className="animate-spin" /> : "Claim Funds"}
                        </Button>
                    ) : (
                        <Button as={Link} to={`/campaign/${campaign.id}`} variant="outline" size="sm" className="w-full">
                            View Campaign
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
};

// StatCard: Maintains glossy aesthetic
const StatCard = ({ icon, label, value, unit = '' }) => (
    <Card className="p-4 !bg-white/50 dark:!bg-gray-800/60 backdrop-blur-md border-blue-400/50 dark:border-blue-700/50 shadow-lg transition-transform duration-300 hover:scale-[1.02] hover:shadow-blue-500/30">
        <div className="flex items-center space-x-3">
            {/* Bold icon container */}
            <div className="p-3 bg-blue-600/10 dark:bg-blue-900/40 rounded-xl"> 
                {React.cloneElement(icon, { className: "h-7 w-7 text-blue-600 dark:text-blue-400 drop-shadow-md" })}
            </div>
            <div>
                {/* Clear hierarchy in typography */}
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{label}</p>
                <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-0.5">
                    {value} <span className="text-sm font-normal text-blue-600 dark:text-blue-400">{unit}</span>
                </p>
            </div>
        </div>
    </Card>
);


const ProfilePage = () => {
    const { currentUser, followedOrganizers } = useUser(); 
    const user = currentUser || devDefaultUser;
    const { showNotification } = useNotification(); 

    const [activeTab, setActiveTab] = useState('created');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userAccount, setUserAccount] = useState(null);
    const [createdCampaigns, setCreatedCampaigns] = useState([]);
    const [donatedCampaigns, setDonatedCampaigns] = useState([]);
    const [totalDonatedAmount, setTotalDonatedAmount] = useState('0');
    const [totalRaisedInUserCampaigns, setTotalRaisedInUserCampaigns] = useState('0');
    const [isClaiming, setIsClaiming] = useState(null);
    const navigate = useNavigate();

    // ... (fetchData logic simplified)
    const fetchData = async () => {
        if (!window.ethereum) {
             setError("Using mock data for styling. Connect MetaMask to see live data.");
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const web3 = new Web3(window.ethereum);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const currentUserAddress = accounts[0].toLowerCase();
            setUserAccount(currentUserAddress);

            const contract = new web3.eth.Contract(CROWDFUNDING_ABI, CROWDFUNDING_CONTRACT_ADDRESS);
            const allCampaigns = await contract.methods.getCampaigns().call();
            
            const created = [];
            const donated = new Set();
            let userTotalDonation = BigInt(0);
            let totalRaised = BigInt(0);

            await Promise.all(allCampaigns.map(async (campaignData, i) => {
                const formattedCampaign = {
                    id: i,
                    owner: campaignData.owner,
                    title: campaignData.title,
                    target: web3.utils.fromWei(campaignData.target.toString(), 'ether'),
                    amountCollected: web3.utils.fromWei(campaignData.amountCollected.toString(), 'ether'),
                    deadline: Number(campaignData.deadline) * 1000,
                    claimed: campaignData.claimed,
                    image: campaignData.image || 'https://placehold.co/600x400/94a3b8/ffffff?text=Daan',
                };

                if (formattedCampaign.owner.toLowerCase() === currentUserAddress) {
                    created.push(formattedCampaign);
                    totalRaised += BigInt(campaignData.amountCollected.toString());
                }

                const donatorsData = await contract.methods.getDonators(i).call();
                const donatorAddresses = donatorsData[0];
                const donationAmounts = donatorsData[1];
                let userHasDonatedToThisCampaign = false;

                donatorAddresses.forEach((addr, index) => {
                    if (addr.toLowerCase() === currentUserAddress) {
                        userTotalDonation += BigInt(donationAmounts[index].toString());
                        userHasDonatedToThisCampaign = true;
                    }
                });

                if (userHasDonatedToThisCampaign) {
                    donated.add(formattedCampaign);
                }
            }));

            setCreatedCampaigns(created);
            setDonatedCampaigns(Array.from(donated));
            setTotalDonatedAmount(web3.utils.fromWei(userTotalDonation.toString(), 'ether'));
            setTotalRaisedInUserCampaigns(web3.utils.fromWei(totalRaised.toString(), 'ether'));

        } catch (err) {
            console.error("Failed to fetch profile data:", err);
            setError("Could not load profile data.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!window.ethereum) {
             setIsLoading(false);
             setError("Using mock data for styling. Connect MetaMask to see live data.");
        } else {
            fetchData();
        }
    }, []);
    
    const handleClaim = async (campaignId) => {
        setIsClaiming(campaignId);
        try {
            const web3 = new Web3(window.ethereum);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const contract = new web3.eth.Contract(CROWDFUNDING_ABI, CROWDFUNDING_CONTRACT_ADDRESS);

            await contract.methods.claim(campaignId).send({ from: accounts[0] });
            
            showNotification("Funds claimed successfully! The page will now refresh.", "success");
            fetchData(); 
        } catch (err) {
            console.error("Failed to claim funds:", err);
            showNotification(`Error claiming funds: ${err.message}`, "error");
        } finally {
            setIsClaiming(null);
        }
    };

    // Followed Organizers List component
    const FollowedOrganizersList = () => {
        if (followedOrganizers.length === 0) {
            return (
                <div className="text-center text-gray-600 dark:text-gray-400 py-16">
                    <p>You are not following any organizers yet.</p>
                    <p className='text-sm mt-2'>Find campaigns and follow the creators to see them here!</p>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {followedOrganizers.map(address => {
                    const profileData = getOrganizerProfile(address);
                    return (
                        // AESTHETIC CHANGE: Apply Glassmorphism to following cards
                        <Card key={address} className="p-4 flex items-center justify-between transition-shadow hover:shadow-xl !bg-white/40 dark:!bg-gray-800/40 backdrop-blur-sm border-gray-300 dark:border-gray-700/50">
                            <div className='flex items-center space-x-4'>
                                <img src={profileData.avatar} alt={profileData.name} className='w-12 h-12 rounded-full object-cover border-2 border-blue-400'/>
                                <div>
                                    <p className="font-bold text-lg text-gray-900 dark:text-white">{profileData.name}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{profileData.campaignsCompleted} completed projects</p>
                                </div>
                            </div>
                            <Button as={Link} to={`/organizer/${address}`} variant="outline" size="sm">
                                View Profile
                            </Button>
                        </Card>
                    );
                })}
            </div>
        );
    };

    const tabClasses = (tabName) => `py-3 px-4 font-semibold border-b-2 transition-colors ${ 
        activeTab === tabName 
        ? 'border-blue-500 text-blue-500 dark:text-blue-400' 
        : 'border-transparent text-gray-600 hover:text-gray-900 dark:hover:text-gray-300'
    }`;

    const CampaignList = ({ campaigns, emptyMessage, isCreatedTab = false }) => {
        if (isLoading) {
             return <div className="flex justify-center p-8"><LoaderCircle className="animate-spin h-8 w-8 text-blue-500" /></div>;
        }
        if (campaigns.length === 0) {
            return <p className="text-center text-gray-600 dark:text-gray-400 py-16">{emptyMessage}</p>;
        }
        return (
            <div className="space-y-4">
                {campaigns.map(campaign => (
                    <CampaignRowCard
                        key={campaign.id}
                        campaign={campaign}
                        isOwner={isCreatedTab}
                        onClaim={handleClaim}
                        isClaiming={isClaiming}
                    />
                ))}
            </div>
        );
    };
    
    const renderContent = () => {
        if (error && !userAccount) { 
            return <div className="text-center text-red-500 p-4">{error}</div>;
        }
        switch (activeTab) {
            case 'created':
                return <CampaignList campaigns={createdCampaigns} emptyMessage="You have not created any campaigns yet." isCreatedTab={true} />;
            case 'donated':
                return <CampaignList campaigns={donatedCampaigns} emptyMessage="You have not donated to any campaigns yet." />;
            case 'following': 
                return <FollowedOrganizersList />;
            default:
                return null;
        }
    };
    
    return (
        <main className="container mx-auto px-4 py-8 relative z-10 pt-28">
             
             {/* AESTHETIC CHANGE: Profile Header Card - Clean Glassmorphism without character */}
             <Card className="p-0 mb-8 overflow-hidden !bg-white/30 dark:!bg-gray-900/30 backdrop-blur-xl border-gray-300 dark:border-gray-700/50 shadow-2xl">
                
                {/* Top Section: Simplified Aesthetic Background (h-40 for depth) */}
                <div className="relative h-40 w-full bg-gradient-to-br from-blue-600/70 via-purple-700/70 to-pink-500/70">
                    {/* Glossy Overlay */}
                    <div className="absolute inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-sm"></div>
                </div>

                {/* Bottom Section: User Details & Wallet */}
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                            <img 
                                src={user.avatar} 
                                alt="Profile" 
                                // Maintain overlap appearance
                                className="w-28 h-28 rounded-full border-4 border-white dark:border-gray-800 -mt-16 object-cover shadow-xl z-20" 
                            />
                            <div className="mb-2">
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{user.email || 'No email provided'}</p>
                            </div>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <Button as={Link} to="/settings" variant="outline">
                                <Pencil className="h-4 w-4 mr-2" /> Edit Profile
                            </Button>
                        </div>
                    </div>
                    <div className="mt-6 border-t border-gray-400/30 dark:border-gray-700/50 pt-4">
                         <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Your Wallet</p>
                         <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-mono text-xs break-all bg-gray-100/70 dark:bg-gray-800/70 p-2 rounded-lg border dark:border-gray-700/50">
                            <span>{userAccount || 'Wallet not connected'}</span>
                            <button 
                                onClick={() => userAccount && navigator.clipboard.writeText(userAccount)}
                                className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                                title="Copy to clipboard"
                            >
                                <Copy className="h-4 w-4" />
                            </button>
                         </div>
                    </div>
                </div>
            </Card>

            {/* AESTHETIC CHANGE: Impact Summary Card - Glassmorphism applied with enhanced StatCard definitions */}
            <Card className="p-6 mb-8 !bg-white/30 dark:!bg-gray-900/30 backdrop-blur-xl border-gray-300 dark:border-gray-700/50 shadow-2xl">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Your Impact Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        icon={<DollarSign />}
                        label="Total Raised by You"
                        value={parseFloat(totalRaisedInUserCampaigns).toFixed(4)}
                        unit="ETH"
                    />
                    <StatCard 
                        icon={<Gift />}
                        label="Total Donated by You"
                        value={parseFloat(totalDonatedAmount).toFixed(4)}
                        unit="ETH"
                    />
                    <StatCard 
                        icon={<Target />}
                        label="Campaigns Created"
                        value={createdCampaigns.length}
                    />
                    <StatCard 
                        icon={<UserCheck />}
                        label="Following Organizers"
                        value={followedOrganizers.length}
                    />
                </div>
            </Card>

            {/* AESTHETIC CHANGE: Main Content Tab Card - Glassmorphism applied */}
            <Card className="p-6 !bg-white/30 dark:!bg-gray-900/30 backdrop-blur-xl border-gray-300 dark:border-gray-700/50 shadow-2xl">
                <div className="border-b border-gray-400/30 dark:border-gray-700/50">
                    <nav className="-mb-px flex space-x-6">
                        <button className={tabClasses('created')} onClick={() => setActiveTab('created')}>
                            My Campaigns ({createdCampaigns.length})
                        </button>
                        <button className={tabClasses('donated')} onClick={() => setActiveTab('donated')}>
                            My Donations ({donatedCampaigns.length})
                        </button>
                        <button className={tabClasses('following')} onClick={() => setActiveTab('following')}> 
                            Following ({followedOrganizers.length})
                        </button>
                    </nav>
                </div>
                <div className="py-6">{renderContent()}</div>
            </Card>
        </main>
    );
};

export default ProfilePage;
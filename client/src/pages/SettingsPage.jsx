// src/pages/SettingsPage.jsx

import React, { useState, useRef } from 'react';
import { 
    User, 
    Shield, 
    Bell, 
    XCircle, 
    LogOut, 
    LoaderCircle, 
    ImagePlus, 
    UploadCloud,
    Trash2 
} from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useUser } from '../contexts/UserProvider';
import { useNotification } from '../contexts/NotificationProvider';

// --- Default user for styling/preview ---
const devDefaultUser = {
  avatar: "https://placehold.co/100x100/E0E7FF/4F46E5?text=U",
  name: "Test User",
  email: "test@example.com"
};

// --- New Form Input Component ---
const FormInput = ({ id, label, type = 'text', value, onChange, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
        </label>
        <input
            type={type}
            id={id}
            name={id} // Ensure name matches id for handleFormChange
            value={value}
            onChange={onChange}
            className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-base focus:ring-blue-500 focus:border-blue-500"
            {...props}
        />
    </div>
);

// --- New Avatar Upload Component ---
const AvatarUploader = ({ avatarPreview, onAvatarChange, onClear }) => {
    const fileInputRef = useRef(null);
    return (
        <div className="flex flex-col sm:flex-row items-center gap-6">
            <img 
                src={avatarPreview} 
                alt="Preview" 
                className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-100 dark:ring-blue-900/50" 
            />
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={onAvatarChange} 
            />
            <div className="flex-grow space-y-2">
                <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => fileInputRef.current.click()}
                    className="w-full sm:w-auto"
                >
                    <UploadCloud className="h-4 w-4 mr-2" /> Change Picture
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, or GIF. 400x400px recommended.
                </p>
            </div>
        </div>
    );
};

// --- Main Settings Page ---
const SettingsPage = () => {
    const { currentUser, updateUser, logout } = useUser();
    const { showNotification } = useNotification();
    const user = currentUser || devDefaultUser;

    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || ''
    });
    const [avatarPreview, setAvatarPreview] = useState(user.avatar);
    const [avatarFile, setAvatarFile] = useState(null);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setAvatarFile(file); // Store the file for upload
            setAvatarPreview(URL.createObjectURL(file)); // Show preview
        }
    };

    const handleSaveChanges = (e) => {
        e.preventDefault();
        
        if (!currentUser) {
            showNotification("This is a demo. Log in to save changes.", "info");
            return;
        }

        setIsLoading(true);
        // In a real app, you'd upload avatarFile here
        const newDetails = {
            name: formData.name,
            email: formData.email,
            avatar: avatarPreview, // In real app, this would be the URL from upload
        };
        updateUser(newDetails);

        setTimeout(() => {
            setIsLoading(false);
            showNotification("Profile updated successfully!", "success");
        }, 1000);
    };

    const tabs = [
        { id: 'profile', name: 'Public Profile', icon: User },
        { id: 'account', name: 'Account & Security', icon: Shield },
        { id: 'notifications', name: 'Notifications', icon: Bell },
    ];

    return (
        <main className="container mx-auto px-4 pt-28 pb-16 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Settings
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                        Manage your profile, account, and notification preferences.
                    </p>
                </header>
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* --- Vertical Tab Navigation --- */}
                    <nav className="lg:col-span-1">
                        <ul className="space-y-2">
                            {tabs.map(tab => (
                                <li key={tab.id}>
                                    <button 
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center w-full p-3 rounded-lg text-left transition-colors ${
                                            activeTab === tab.id
                                            ? 'bg-blue-50 text-blue-700 font-semibold dark:bg-blue-900/50 dark:text-blue-300'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                    >
                                        <tab.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                                        <span>{tab.name}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* --- Tab Content Area --- */}
                    <div className="lg:col-span-3">
                        {activeTab === 'profile' && (
                            <form onSubmit={handleSaveChanges}>
                                <Card>
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                            Profile Information
                                        </h3>
                                        <div className="space-y-6">
                                            <AvatarUploader 
                                                avatarPreview={avatarPreview}
                                                onAvatarChange={handleAvatarChange}
                                            />
                                            <hr className="dark:border-gray-700"/>
                                            <FormInput
                                                id="name"
                                                label="Full Name"
                                                value={formData.name}
                                                onChange={handleFormChange}
                                            />
                                            <FormInput
                                                id="email"
                                                label="Email Address"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleFormChange}
                                            />
                                        </div>
                                    </div>
                                    <footer className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700 text-right">
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading ? <LoaderCircle className="animate-spin" /> : 'Save Changes'}
                                        </Button>
                                    </footer>
                                </Card>
                            </form>
                        )}

                        {activeTab === 'account' && (
                            <div className="space-y-8">
                                <Card>
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                            Change Password
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                                            It's a good idea to use a strong password that you're not using elsewhere.
                                        </p>
                                        <form className="space-y-4">
                                            <FormInput id="currentPassword" label="Current Password" type="password" />
                                            <FormInput id="newPassword" label="New Password" type="password" />
                                            <FormInput id="confirmPassword" label="Confirm New Password" type="password" />
                                            <div className="pt-2">
                                                <Button type="submit" variant="secondary">
                                                    Update Password
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                </Card>
                                
                                <Card className="border-red-300 dark:border-red-500 border-l-4">
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-4">
                                            Danger Zone
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white">Log Out</h4>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                                                    You will be returned to the login screen.
                                                </p>
                                                <Button variant="danger_outline" onClick={logout}>
                                                    <LogOut className="mr-2 h-4 w-4"/>Log Out
                                                </Button>
                                            </div>
                                            <hr className="dark:border-gray-700"/>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white">Deactivate Account</h4>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                                                    This action is not reversible. All your data will be permanently deleted.
                                                </p>
                                                <Button 
                                                    variant="danger" 
                                                    onClick={() => showNotification('Deactivate account clicked!', 'info')}
                                                >
                                                    <XCircle className="mr-2 h-4 w-4"/>Deactivate Account
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )}
                        
                        {activeTab === 'notifications' && (
                            <Card>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                        Notification Settings
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        (Notification settings would go here...)
                                    </p>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default SettingsPage;
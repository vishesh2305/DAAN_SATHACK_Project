// src/contexts/UserProvider.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import defaultprofileimg from "../assets/images/default_profile_image.jpg"
import { useNotification } from './NotificationProvider'; // 1. IMPORT THE HOOK

const UserContext = createContext();

// --- THIS IS THE FIX ---
export const useUser = () => useContext(UserContext);
// --- END FIX ---

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [followedOrganizers, setFollowedOrganizers] = useState([]); // NEW STATE
    const { showNotification } = useNotification(); // 2. GET THE FUNCTION

    // Restore session and followed list from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setCurrentUser(user);
            setIsAuthenticated(true);
        }

        const storedFollows = localStorage.getItem("followedOrganizers");
        if (storedFollows) {
            setFollowedOrganizers(JSON.parse(storedFollows));
        }

        setLoading(false);
    }, []);

    const login = (userData) => {
        const user = {
            name: userData.name || userData.fullName || '',
            email: userData.email || '',
            avatar: userData.avatar || defaultprofileimg,
        };
        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(user)); 
    };

const logout = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/logout", {
      method: "POST",
      credentials: "include", 
    });

    const data = await res.json();
    console.log("🚪 Logout response:", data.message);

    // Now update local state
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  } catch (err) {
    console.error("Logout failed:", err);
    // 3. REPLACE ALERT
    showNotification("Logout request failed.", "error");
  }
};


    const updateUser = (newDetails) => {
        const updatedUser = { ...currentUser, ...newDetails };
        setCurrentUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser)); // keep synced
    };

    // NEW: Follow/Unfollow Logic
    const followOrganizer = (organizerAddress) => {
        setFollowedOrganizers(prev => {
            const newState = [...prev, organizerAddress];
            localStorage.setItem("followedOrganizers", JSON.stringify(newState));
            return newState;
        });
        showNotification("You are now following this organizer!", "success");
    };

    const unfollowOrganizer = (organizerAddress) => {
        setFollowedOrganizers(prev => {
            const newState = prev.filter(addr => addr !== organizerAddress);
            localStorage.setItem("followedOrganizers", JSON.stringify(newState));
            return newState;
        });
        showNotification("Unfollowed organizer.", "info");
    };

    return (
        <UserContext.Provider value={{
             currentUser, 
             isAuthenticated,
             loading, 
             updateUser, 
             logout, 
             login,
             followedOrganizers, // NEW
             followOrganizer,    // NEW
             unfollowOrganizer,  // NEW
        }}>
            {children}
        </UserContext.Provider>
    );
};
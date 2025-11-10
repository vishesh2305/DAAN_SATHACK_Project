import React, { useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Sun,
  Moon,
  Heart,
  User,
  Settings,
  LogOut,
  Grid3X3,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeProvider";
import { useUser } from "../../contexts/UserProvider";
import Button from "../common/Button";

// A default user object for styling when logged out
const devDefaultUser = {
  avatar: "https://placehold.co/100x100/E0E7FF/4F46E5?text=U",
  name: "Test User"
};

// Map pathnames to their display names for the collapsed island
const pageTitles = {
  "/dashboard": "Campaigns",
  "/create": "Create Campaign",
  "/profile": "My Profile",
  "/settings": "Settings",
  "/": "DAAN"
};

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  // We still get the real user, but we'll use fallbacks
  const { currentUser, isAuthenticated, logout } = useUser(); 
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isLandingPage = location.pathname === '/';
  const currentPageTitle = pageTitles[location.pathname] || 'Menu';
  const isExpanded = isLandingPage || isHovered;

  const mainNavLinkClasses = ({ isActive }) =>
    `font-semibold px-4 py-2 rounded-lg text-lg transition-colors ${
      isActive
        ? 'text-gray-900 dark:text-white'
        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
    }`;

  const profileLinkClasses = ({ isActive }) =>
    `block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
      isActive ? "bg-gray-100 dark:bg-gray-700 font-semibold" : ""
    }`;

  const handleSignOut = () => {
    logout();
    setIsProfileMenuOpen(false);
  };

  // This forces the profile menu to show for development
  const IS_DEV_STYLING_MODE = true;
  
  // Use the real user if they exist, otherwise use our dev default
  const displayUser = currentUser || devDefaultUser;

  return (
    /* --- THIS IS THE FIX (PART 1) --- */
    /* The hover events are moved to this parent div */
    <div 
      className="nav-island"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <nav
        /* The hover events are REMOVED from here */
        className={`nav-island-content ${isExpanded ? 'expanded' : 'collapsed'}`}
      >
        <div className="island-collapsed-view island-content-wrapper">
          <span className="font-semibold text-lg text-gray-900 dark:text-white">
            {currentPageTitle}
          </span>
        </div>

        <div className="island-expanded-view island-content-wrapper">
          <div className="flex items-center justify-between w-full space-x-4">
            
            <Link to="/dashboard" className="flex items-center space-x-2 flex-shrink-0">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                DAAN
              </span>
            </Link>

            <nav className="flex items-center space-x-2">
              <NavLink to="/" className={mainNavLinkClasses} end>Home</NavLink>
              <NavLink to="/dashboard" className={mainNavLinkClasses}>Campaigns</NavLink>
              <NavLink to="/create" className={mainNavLinkClasses}>Create</NavLink>
            </nav>

            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              
              {(IS_DEV_STYLING_MODE || isAuthenticated) ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="focus:outline-none"
                  >
                    <img
                      src={displayUser.avatar} 
                      alt="Profile"
                      className="h-9 w-9 rounded-full border-2 border-gray-400 hover:border-black dark:hover:border-white object-cover transition-colors"
                    />
                  </button>
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-4 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-2 z-60 border border-gray-200 dark:border-gray-700">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">Signed in as</p>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
                          {displayUser.name}
                        </p>
                      </div>
                      <div className="py-1">
                        <NavLink to="/dashboard" className={profileLinkClasses} onClick={() => setIsProfileMenuOpen(false)}>
                          <Grid3X3 className="h-4 w-4 mr-2 inline-block"/> Dashboard
                        </NavLink>
                        <NavLink to="/profile" className={profileLinkClasses} onClick={() => setIsProfileMenuOpen(false)}>
                          <User className="h-4 w-4 mr-2 inline-block"/> My Profile
                        </NavLink>
                        <NavLink to="/settings" className={profileLinkClasses} onClick={() => setIsProfileMenuOpen(false)}>
                          <Settings className="h-4 w-4 mr-2 inline-block"/> Settings
                        </NavLink>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                        >
                          <LogOut className="h-4 w-4 mr-2 inline-block"/> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/auth" state={{ isSignUp: false }}>
                    <Button 
                      variant="outline" 
                      className="text-gray-800 dark:text-white border-gray-500 dark:border-gray-400 hover:bg-gray-100 dark:hover:bg-white/20"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth" state={{ isSignUp: true }}>
                    <Button>
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
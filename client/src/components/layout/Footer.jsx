// src/components/layout/Footer.jsx

import React from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Globe
} from "lucide-react";
import Button from "../common/Button";

const Footer = () => {
  const footerLinkClasses = "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors";
  const footerTitleClasses = "text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-4";

  return (
    // --- THIS IS THE FIX ---
    // Reverted from transparent 'bg-white/10...' back to a solid background.
    // I am using dark:bg-gray-800/50 here to match your Card style, but we can make it dark:bg-gray-900 if you prefer
    <footer className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700/50 mt-16 relative z-10">
      <div className="container mx-auto px-4 py-16">
        
        {/* Top Section: CTA and Socials (Discord Style) */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
              FUND THE FUTURE.
              <br />
              SECURELY.
            </h2>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <Globe className="h-5 w-5" />
                <span>English (US)</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-blue-500"><Twitter className="h-6 w-6" /></a>
              <a href="#" className="text-gray-400 hover:text-blue-500"><Instagram className="h-6 w-6" /></a>
              <a href="#" className="text-gray-400 hover:text-blue-500"><Facebook className="h-6 w-6" /></a>
              <a href="#" className="text-gray-400 hover:text-blue-500"><Youtube className="h-6 w-6" /></a>
            </div>
          </div>
          
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {/* Column 1 */}
            <div>
              <h4 className={footerTitleClasses}>Platform</h4>
              <ul className="space-y-3">
                <li><Link to="/dashboard" className={footerLinkClasses}>Campaigns</Link></li>
                <li><Link to="/create" className={footerLinkClasses}>Create</Link></li>
                <li><Link to="#" className={footerLinkClasses}>How it Works</Link></li>
                <li><Link to="#" className={footerLinkClasses}>Success Stories</Link></li>
              </ul>
            </div>
            {/* Column 2 */}
            <div>
              <h4 className={footerTitleClasses}>Support</h4>
              <ul className="space-y-3">
                <li><Link to="#" className={footerLinkClasses}>Help Center</Link></li>
                <li><Link to="#" className={footerLinkClasses}>Contact Us</Link></li>
                <li><Link to="#" className="text-red-500 hover:underline">Report Campaign</Link></li>
              </ul>
            </div>
            {/* Column 3 */}
            <div>
              <h4 className={footerTitleClasses}>Legal</h4>
              <ul className="space-y-3">
                <li><Link to="#" className={footerLinkClasses}>Terms of Service</Link></li>
                <li><Link to="#" className={footerLinkClasses}>Privacy Policy</Link></li>
                <li><Link to="#" className={footerLinkClasses}>Donation Terms</Link></li>
              </ul>
            </div>
            {/* Column 4 */}
            <div>
              <h4 className={footerTitleClasses}>Company</h4>
              <ul className="space-y-3">
                <li><Link to="#" className={footerLinkClasses}>About Us</Link></li>
                <li><Link to="#" className={footerLinkClasses}>Careers</Link></li>
                <li><Link to="#" className={footerLinkClasses}>Blog</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar (Discord Style) */}
        <div className="border-t border-gray-300 dark:border-gray-700 pt-8 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
              DAAN
            </span>
          </Link>
          <Link to="/create">
            <Button>
              Start a Campaign
            </Button>
          </Link>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
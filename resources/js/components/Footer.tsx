import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

const Footer = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Set mounted state and detect theme after initial render
  useEffect(() => {
    setMounted(true);
    
    // Check if dark mode is enabled
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setIsDarkMode(isDark);
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  // ICMA colors based on the logo
  const colors = {
    red: '#E52531',
    green: '#4CB050',
    blue: '#2a3b8f',
    orange: '#F0A023'
  };

  if (!mounted) {
    // Return a placeholder or initial state to prevent hydration mismatch
    return (
      <footer className="bg-gray-50">
        {/* Placeholder content */}
        <div className="h-40"></div>
      </footer>
    );
  }

  return (
    <footer className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      {/* Straight top border instead of diagonal */}
      <div className="relative">
        <div className={`${isDarkMode ? 'border-gray-800' : 'border-gray-200'} border-t-4`}></div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-10 gap-8 lg:gap-12">
          {/* Organization Info - Wider column */}
          <div className="md:col-span-4">
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <img 
                  src="/images/assets/logo.png" 
                  alt="ICMASURE Logo" 
                  className="h-20 w-auto mr-5"
                />
                <div>
                  <h2 className="font-bold text-lg sm:text-xl md:text-2xl flex items-center">
                    <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>The 8</span>
                    <sup className="text-sm mt-0.5">th</sup>
                    <span 
                      className="ml-1"
                      style={{ 
                        background: `linear-gradient(to right, ${colors.green}, ${colors.orange}, ${colors.red})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      ICMA SURE
                    </span>
                  </h2>
                  <p className="text-sm md:text-base text-gray-500 mt-1">
                    International Conference on Multidiscipline Approaches for Sustainable Rural Development
                  </p>
                </div>
              </div>
             
            </div>
          </div>

          {/* Office Address */}
          <div className="md:col-span-3">
            <h3 className={`text-lg font-semibold mb-4 pb-1 border-b ${isDarkMode ? 'text-white border-gray-800' : 'text-gray-900 border-gray-200'}`}
                style={{ borderBottomWidth: '2px', borderBottomColor: colors.green }}>
              Office Address
            </h3>
            <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} space-y-2 text-sm`}>
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <div>
                  <p>LPPM Universitas Jenderal Soedirman</p>
                  <p>Dr. Soeparno Utara Street</p>
                  <p>Purwokerto Utara, Banyumas</p>
                  <p>Jawa Tengah, Indonesia</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 pt-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <a href="mailto:icmasure@unsoed.ac.id" className="hover:text-blue-500 transition-colors duration-300">
                icmasure.lppm@unsoed.ac.id
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h3 className={`text-lg font-semibold mb-4 pb-1 border-b ${isDarkMode ? 'text-white border-gray-800' : 'text-gray-900 border-gray-200'}`}
                style={{ borderBottomWidth: '2px', borderBottomColor: colors.red }}>
              Quick Links
            </h3>
            <ul className={`space-y-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
              <li>
                <Link 
                  href="/" 
                  className="hover:text-blue-500 transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full inline-block transform transition-transform duration-300 group-hover:scale-125"
                       style={{ backgroundColor: colors.blue }}></span>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="hover:text-blue-500 transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full inline-block transform transition-transform duration-300 group-hover:scale-125"
                       style={{ backgroundColor: colors.green }}></span>
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/programs" 
                  className="hover:text-blue-500 transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full inline-block transform transition-transform duration-300 group-hover:scale-125"
                       style={{ backgroundColor: colors.orange }}></span>
                  <span>Programs</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/publications" 
                  className="hover:text-blue-500 transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full inline-block transform transition-transform duration-300 group-hover:scale-125"
                       style={{ backgroundColor: colors.red }}></span>
                  <span>Publications</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="hover:text-blue-500 transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full inline-block transform transition-transform duration-300 group-hover:scale-125"
                       style={{ backgroundColor: colors.green }}></span>
                  <span>Contact Us</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className={`${isDarkMode ? 'bg-gray-950' : 'bg-gray-100'} py-4`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-600'} text-sm`}>
            © {new Date().getFullYear()} ICMASURE - International Conference on Multidiscipline Approaches for Sustainable Rural Development, Universitas Jenderal Soedirman. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
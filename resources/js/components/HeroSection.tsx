// resources/js/Components/HeroSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  tagline?: string;
  eventDate?: string;
  eventLocation?: string;
  backgroundImage?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = 'SUSTAINABLE DIGITAL TRANSFORMATION',
  subtitle = 'INTEGRATING LOCAL VALUES IN DOWNSTREAM DEVELOPMENT',
  tagline = 'INTERNATIONAL CONFERENCE',
  eventDate = '07 October 2025',
  eventLocation = 'Universitas Jenderal Soedirman',
  backgroundImage = '/images/assets/bg-lppm.jpg',
}) => {
  // Define ICMA color palette
  const colors = {
    red: '#E52531',
    green: '#4CB050',
    blue: '#2a3b8f',
    orange: '#F0A023'
  };
  
  // Get theme context
  const { isDarkMode } = useTheme();

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background image without any overlays */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          filter: isDarkMode ? 'brightness(0.6)' : 'brightness(0.7)'
        }}
      ></div>
      
      {/* Main Hero Content - improved responsive layout */}
      <div className="relative z-20 container mx-auto px-4 md:px-6 flex flex-col items-center justify-center min-h-screen pt-16 pb-24">
        <div className="max-w-full sm:max-w-6xl mx-auto text-center mb-8 sm:mb-16 md:mb-24">
          {/* Conference tagline */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-3 sm:mb-5 md:mb-7 flex justify-center"
          >
            <span 
              className="inline-block py-1.5 sm:py-2 px-4 sm:px-6 rounded-full text-xs sm:text-sm md:text-base font-medium tracking-wider"
              style={{ backgroundColor: colors.red, color: 'white' }}
            >
              {tagline}
            </span>
          </motion.div>
          
          {/* Main title with animation - improved responsive typography */}
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-3 sm:mb-4 md:mb-6 px-2"
          >
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight tracking-tight">
              {title}
            </h1>
          </motion.div>
          
          {/* Subtitle - improved for smaller screens */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mb-6 sm:mb-8 md:mb-10 lg:mb-14 px-2"
          >
            <p className="text-xl xs:text-2xl sm:text-2xl md:text-3xl lg:text-4xl text-white/90 font-light leading-relaxed">
              {subtitle}
            </p>
          </motion.div>
          
          {/* Event details with date and location */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex justify-center"
          >
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <span 
                className="hidden sm:block flex-shrink-0 w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                style={{ backgroundColor: colors.green }}
              ></span>
              <p className="text-base sm:text-lg md:text-xl text-white font-medium">
                <span className="block sm:inline">{eventDate}</span>
                <span className="hidden sm:inline"> · </span>
                <span className="block sm:inline">{eventLocation}</span>
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* Conference branding section - adjusted for better small screen display */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="absolute bottom-16 sm:bottom-20 md:bottom-24 left-0 right-0 z-20 flex flex-col items-center"
        >
          <h1 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl font-lilita flex items-center">
            <span className="text-white">The 8</span><sup className="text-xs sm:text-sm mt-0.5">th</sup>
            <span className="ml-1 sm:ml-2 bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-transparent bg-clip-text">ICMA SURE</span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base font-poppins text-white max-w-md text-center px-4 mt-1">
            International Conference on Multidiscipline Approaches for Sustainable Rural Development
          </p>
        </motion.div>
      </div>
      
      {/* Static scroll indicator */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center">
        <p className="text-white/90 text-xs uppercase tracking-widest font-light mb-1">
          EXPLORE
        </p>
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L8 8L15 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  duration?: number;
}

interface CounterStatsSectionProps {
  stats?: StatItemProps[];
  backgroundImage?: string;
  showSubmitButton?: boolean;
  submitUrl?: string;
}

// Counter component for animating numbers
const Counter: React.FC<{ from: number; to: number; duration?: number }> = ({ 
  from = 0, 
  to, 
  duration = 2 
}) => {
  const [count, setCount] = useState(from);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, amount: 0.5 });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
      
      const steps = 60;
      const increment = (to - from) / steps;
      let currentCount = from;
      
      const timer = setInterval(() => {
        currentCount += increment;
        if (currentCount >= to) {
          clearInterval(timer);
          setCount(to);
        } else {
          setCount(Math.floor(currentCount));
        }
      }, (duration * 1000) / steps);
      
      return () => clearInterval(timer);
    }
  }, [inView, from, to, duration, controls]);

  return <span ref={nodeRef}>{count.toLocaleString()}</span>;
};

// Stat item component
const StatItem: React.FC<StatItemProps> = ({ icon, value, label, duration }) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0
    }
  };

  const transition = {
    duration: 0.6,
    ease: [0.25, 0.46, 0.45, 0.94] as const
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={transition}
      className="flex flex-col items-center justify-center"
    >
      <div className="text-4xl sm:text-5xl md:text-6xl mb-4 text-white">
        {icon}
      </div>
      <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-2 text-white">
        <Counter from={0} to={value} duration={duration} />
      </div>
      <div className="text-base sm:text-lg uppercase tracking-wider text-white/90 font-light">
        {label}
      </div>
    </motion.div>
  );
};

const CounterStatsSection: React.FC<CounterStatsSectionProps> = ({ 
  stats = [],
  backgroundImage,
  showSubmitButton = true,
  submitUrl = "/user/submissions/create"
}) => {
  const { isDarkMode } = useTheme();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  // Define ICMA color palette
  const colors = {
    red: '#E52531',
    green: '#4CB050',
    blue: '#2a3b8f',
    orange: '#F0A023'
  };
  
  // Default stats if none provided
  const defaultStats = [
    {
      icon: (
        <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5zm2 4h10v2H7v-2zm0 4h7v2H7v-2z" />
        </svg>
      ),
      value: 2,
      label: 'Days',
      duration: 1
    },
    {
      icon: (
        <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
        </svg>
      ),
      value: 507,
      label: 'Speakers',
      duration: 2.5
    },
    {
      icon: (
        <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        </svg>
      ),
      value: 1550,
      label: 'Seats',
      duration: 3
    },
    {
      icon: (
        <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z" />
        </svg>
      ),
      value: 8,
      label: 'Countries',
      duration: 1.5
    }
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

  // Section variants for animation
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  // Create the gradient background based on the colors
  const backgroundGradient = isDarkMode
    ? `linear-gradient(90deg, ${colors.blue}CC 0%, ${colors.orange}99 50%, ${colors.red}CC 100%)`
    : `linear-gradient(90deg, ${colors.blue}BB 0%, ${colors.orange}88 50%, ${colors.red}BB 100%)`;

  const handleSubmit = () => {
    // Check if user is authenticated by trying to access a protected route
    // If not authenticated, Laravel will redirect to login page automatically
    window.location.href = '/user/submissions/create';
  };

  return (
    <div ref={sectionRef} className="relative py-16 sm:py-20 overflow-hidden">
      {/* Background with brand color gradient */}
      <div 
        className="absolute inset-0 z-0" 
        style={{ background: backgroundGradient }}
      ></div>
      
      {/* Subtle shadow overlay at top and bottom */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/20 to-transparent z-5"></div>
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent z-5"></div>
      
      {/* Content */}
      <motion.div 
        className="container mx-auto px-4 relative z-20"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={sectionVariants}
      >
        

        {/* Submit Button Section */}
        {showSubmitButton && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div className="mb-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Ready to Join?
              </h3>
              <p className="text-white/90 text-lg">
                Submit your research and be part of sustainable development
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                onClick={handleSubmit}
                className="group inline-flex items-center px-8 py-4 rounded-full bg-white text-gray-800 font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 relative overflow-hidden"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
                <span className="relative z-10">Submit Your Paper ( Abstract )</span>
                <svg className="w-5 h-5 ml-3 relative z-10 group-hover:translate-x-1 transition-transform duration-300 text-[#E52531]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </motion.button>

              <motion.button
                onClick={() => window.open('https://youtube.com/watch?si=N5GrRh3AwPOP81HA&v=6kS_7XpLTfg&feature=youtu.be', '_blank')}
                className="inline-flex items-center px-6 py-3 rounded-full bg-transparent border-2 border-white text-white font-semibold hover:bg-white hover:text-gray-800 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Registration Guide
              </motion.button>
            </div>

            {/* Additional info */}
            <div className="mt-6 inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <svg className="w-5 h-5 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-white text-sm">
                Abstract deadline: <strong>15 September 2025</strong>
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>
      
      {/* Thin colorful divider line */}
      <div className="absolute bottom-0 left-0 w-full h-1 z-10">
        <div className="h-full bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531]"></div>
      </div>
    </div>
  );
};

export default CounterStatsSection;
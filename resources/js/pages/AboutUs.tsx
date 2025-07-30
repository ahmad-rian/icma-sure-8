import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Head } from '@inertiajs/react';
import { Typography, Card, Divider } from 'antd';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface AboutUsProps {
  darkMode?: boolean;
}

const AboutUs: React.FC<AboutUsProps> = ({ darkMode = false }) => {
  const [isDarkMode, setIsDarkMode] = useState(darkMode);
  const [typedText, setTypedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const textToType = "International Conference on Multidisciplinary Approaches for Sustainable Rural Development";
  
  // Conference date: Tuesday, 7 October 2025
  const conferenceDate = new Date('2025-10-07T00:00:00');
  
  // Calculate countdown
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = conferenceDate - now;
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    if (currentIndex < textToType.length) {
      const timeout = setTimeout(() => {
        setTypedText(prev => prev + textToType[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      const resetTimeout = setTimeout(() => {
        setTypedText("");
        setCurrentIndex(0);
      }, 1500);
      return () => clearTimeout(resetTimeout);
    }
  }, [currentIndex]);

  const colors = {
    red: '#E52531',
    green: '#4CB050',
    blue: '#2a3b8f',
    orange: '#F0A023'
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.4, 0.0, 0.2, 1] }
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <>
      <Head title="About the 8th ICMA SURE" />
      <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-white dark:bg-gray-900">
            <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-gradient-to-tr from-[#4CB050]/10 to-transparent"></div>
            <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-gradient-to-bl from-[#E52531]/10 to-transparent"></div>
            <svg className="absolute top-0 left-0 w-full h-full opacity-5" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,0 L1000,0 L1000,1000 L0,1000 Z" fill="none" stroke={colors.blue} strokeWidth="2" />
              <circle cx="500" cy="500" r="300" fill="none" stroke={colors.green} strokeWidth="2" />
              <polygon points="500,200 800,500 500,800 200,500" fill="none" stroke={colors.red} strokeWidth="2" />
            </svg>
          </div>
          <motion.div 
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-36 relative z-10"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div className="flex flex-col items-center mb-16 text-center" variants={itemVariants}>
              <motion.img
                src="/images/assets/logo.png"
                alt="ICMA SURE Logo"
                className="h-24 sm:h-32 mb-6"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <div className="relative">
                <Typography.Title level={1} className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white">
                  <span>About The 8</span>
                  <sup className="text-xl">th</sup>
                  <span className="bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-transparent bg-clip-text"> ICMA SURE</span>
                </Typography.Title>
                <div className="h-16 mt-4 overflow-hidden">
                  <motion.p 
                    className="text-lg sm:text-xl font-medium text-gray-700 dark:text-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {typedText}
                    <span className="inline-block w-1 h-6 ml-1 bg-gray-700 dark:bg-white animate-pulse"></span>
                  </motion.p>
                </div>
              </div>
              <div className="h-1 w-40 mt-6 rounded-full bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531]"></div>
            </motion.div>

            {/* Countdown Timer Section */}
            <motion.div variants={itemVariants} className="mb-16">
              <div className="text-center mb-8">
                <Typography.Text className="text-base uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                  Conference Starts In
                </Typography.Text>
                <Typography.Title level={2} className="mt-2 mb-3 text-gray-900 dark:text-white text-2xl sm:text-3xl">
                  Tuesday, 7 October 2025
                </Typography.Title>
              </div>
              
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
                  {[
                    { value: timeLeft.days, label: 'Days', color: 'from-[#4CB050] to-[#F0A023]' },
                    { value: timeLeft.hours, label: 'Hours', color: 'from-[#F0A023] to-[#E52531]' },
                    { value: timeLeft.minutes, label: 'Minutes', color: 'from-[#E52531] to-[#2a3b8f]' },
                    { value: timeLeft.seconds, label: 'Seconds', color: 'from-[#2a3b8f] to-[#4CB050]' }
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      className="text-center p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-gray-700/20"
                      initial={{ scale: 0.8, opacity: 0, y: 50 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ 
                        delay: index * 0.1, 
                        type: "spring", 
                        stiffness: 300,
                        damping: 20
                      }}
                      whileHover={{ 
                        scale: 1.05, 
                        y: -10,
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                      }}
                    >
                      <motion.div 
                        className={`text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r ${item.color} text-transparent bg-clip-text mb-2`}
                        key={item.value}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {String(item.value).padStart(2, '0')}
                      </motion.div>
                      <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wider">
                        {item.label}
                      </div>
                      {/* Animated bottom border */}
                      <div className={`h-1 w-full mt-4 rounded-full bg-gradient-to-r ${item.color} opacity-60`}></div>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-[#4CB050]/10 via-[#F0A023]/10 to-[#E52531]/10 border-2 border-[#4CB050]/20 backdrop-blur-sm">
                   
                    <Typography.Text className="text-base font-semibold text-gray-700 dark:text-gray-300">
                      100% Online Conference
                    </Typography.Text>
                    <motion.div
                      className="ml-3 w-2 h-2 bg-green-500 rounded-full"
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card 
                className="shadow-2xl rounded-3xl overflow-hidden backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 border-0"
                bordered={false}
              >
                <div className="relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#4CB050]/10 via-[#E52531]/5 to-transparent rounded-bl-full"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#E52531]/10 via-[#F0A023]/5 to-transparent rounded-tr-full"></div>
                  <div className="relative z-10 p-8 sm:p-10">
                    <motion.div 
                      variants={itemVariants} 
                      className="prose lg:prose-lg max-w-none"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="text-center mb-12">
                        <Typography.Text className="text-base uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                          Conference Overview
                        </Typography.Text>
                        <Typography.Title level={2} className="mt-3 mb-8 text-gray-900 dark:text-white text-2xl sm:text-3xl">
                          About ICMA SURE 2025
                        </Typography.Title>
                      </div>
                      
                      <Typography.Paragraph className="text-lg sm:text-xl leading-relaxed mb-8 text-center text-gray-700 dark:text-gray-200">
                        The International Conference on Multidisciplinary Approaches for Sustainable Rural Development (ICMA SURE) 2025 addresses the convergence of digital transformation and environmental stewardship, which has become increasingly paramount in shaping the future of our planet.
                      </Typography.Paragraph>

                      <Typography.Paragraph className="text-lg leading-relaxed mb-10 text-justify text-gray-700 dark:text-gray-200">
                        In the face of escalating environmental challenges and the pressing need for sustainable development, the intricate relationship between technological advancement and environmental sustainability presents both unprecedented opportunities and complex challenges. As we stand at the crossroads of digital innovation and ecological preservation, the integration of local values in downstream development emerges as a crucial paradigm for achieving sustainable growth while maintaining environmental equilibrium.
                      </Typography.Paragraph>
                    </motion.div>

                    <Divider className="my-8">
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className="inline-flex bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] p-1 rounded-full"
                      >
                        <div className="px-3 py-1 rounded-full bg-white dark:bg-gray-800">
                          <span className="bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-transparent bg-clip-text font-bold">
                            ICMA SURE 2025
                          </span>
                        </div>
                      </motion.div>
                    </Divider>

                    <motion.div 
                      variants={itemVariants}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="mb-12"
                    >
                      <div className="text-center mb-8">
                        <Typography.Text className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold">
                          2025 Conference Theme
                        </Typography.Text>
                        <div className="mt-4 p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600">
                          <Typography.Title level={1} className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                            <span className="bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-transparent bg-clip-text">
                              Sustainable Digital Transformation
                            </span>
                          </Typography.Title>
                          <Typography.Title level={2} className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
                            Integrating Local Values in Downstream Development
                          </Typography.Title>
                          <div className="h-1 w-32 mx-auto rounded-full bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531]"></div>
                        </div>
                      </div>
                      
                      <div className="max-w-4xl mx-auto">
                        <Typography.Paragraph className="text-lg leading-relaxed text-center text-gray-700 dark:text-gray-200 mb-8">
                          This theme addresses the critical intersection of technological advancement and sustainability, emphasizing how downstream implementation processes can be enhanced by incorporating local knowledge systems. It promotes a purposeful approach to digital transformation that extends beyond efficiency to embrace environmental stewardship.
                        </Typography.Paragraph>
                        
                        <div className="grid md:grid-cols-3 gap-6 mt-8">
                          <div className="text-center p-6 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-[#4CB050] to-[#F0A023] rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                            </div>
                            <Typography.Title level={4} className="text-green-700 dark:text-green-300 mb-2">Digital Innovation</Typography.Title>
                            <Typography.Text className="text-sm text-green-600 dark:text-green-400">
                              Cutting-edge technology solutions for sustainable development
                            </Typography.Text>
                          </div>
                          
                          <div className="text-center p-6 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-[#F0A023] to-[#E52531] rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                              </svg>
                            </div>
                            <Typography.Title level={4} className="text-orange-700 dark:text-orange-300 mb-2">Local Wisdom</Typography.Title>
                            <Typography.Text className="text-sm text-orange-600 dark:text-orange-400">
                              Indigenous knowledge and cultural practices integration
                            </Typography.Text>
                          </div>
                          
                          <div className="text-center p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-[#E52531] to-[#2a3b8f] rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <Typography.Title level={4} className="text-red-700 dark:text-red-300 mb-2">Sustainability</Typography.Title>
                            <Typography.Text className="text-sm text-red-600 dark:text-red-400">
                              Environmental preservation and future generations
                            </Typography.Text>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      variants={itemVariants}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.25 }}
                      className="mb-12"
                    >
                      <div className="text-center mb-8">
                        <Typography.Text className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold">
                          Research Focus Areas
                        </Typography.Text>
                        <Typography.Title level={2} className="mt-3 mb-8 text-gray-900 dark:text-white text-2xl sm:text-3xl">
                          Conference Sub-Themes
                        </Typography.Title>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {[
                          {
                            number: "01",
                            title: "Life and Applied Sciences",
                            description: "Scientific approaches to sustainable development and innovation",
                            gradient: "from-[#4CB050] to-[#F0A023]",
                            bgColor: "bg-green-50 dark:bg-green-900/20",
                            borderColor: "border-green-200 dark:border-green-800"
                          },
                          {
                            number: "02", 
                            title: "Health and Well-being",
                            description: "Comprehensive health approaches for sustainable communities",
                            gradient: "from-[#F0A023] to-[#E52531]",
                            bgColor: "bg-orange-50 dark:bg-orange-900/20",
                            borderColor: "border-orange-200 dark:border-orange-800"
                          },
                          {
                            number: "03",
                            title: "Resilience and Sustainable Infrastructure",
                            description: "Building robust systems for long-term sustainability",
                            gradient: "from-[#E52531] to-[#2a3b8f]",
                            bgColor: "bg-red-50 dark:bg-red-900/20",
                            borderColor: "border-red-200 dark:border-red-800"
                          },
                          {
                            number: "04",
                            title: "Social, Economy and Justice",
                            description: "Equitable development and social transformation",
                            gradient: "from-[#2a3b8f] to-[#4CB050]",
                            bgColor: "bg-blue-50 dark:bg-blue-900/20",
                            borderColor: "border-blue-200 dark:border-blue-800"
                          },
                          {
                            number: "05",
                            title: "Sustainable Communities",
                            description: "Building resilient and self-sufficient community systems",
                            gradient: "from-[#4CB050] to-[#E52531]",
                            bgColor: "bg-purple-50 dark:bg-purple-900/20",
                            borderColor: "border-purple-200 dark:border-purple-800"
                          }
                        ].map((theme, index) => (
                          <motion.div
                            key={index}
                            className={`p-6 rounded-2xl ${theme.bgColor} border ${theme.borderColor} hover:shadow-lg transition-all duration-300 hover:scale-105`}
                            whileHover={{ y: -5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <div className="flex items-start space-x-4">
                              <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-lg`}>
                                <span className="text-white font-bold text-lg">{theme.number}</span>
                              </div>
                              <div className="flex-1">
                                <Typography.Title level={4} className="text-gray-900 dark:text-white mb-2 text-lg">
                                  {theme.title}
                                </Typography.Title>
                                <Typography.Text className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                  {theme.description}
                                </Typography.Text>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      variants={itemVariants}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="mb-12"
                    >
                      <div className="text-center mb-8">
                        <Typography.Text className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold">
                          Mark Your Calendar
                        </Typography.Text>
                        <Typography.Title level={2} className="mt-3 mb-8 text-gray-900 dark:text-white text-2xl sm:text-3xl">
                          Important Dates & Deadlines
                        </Typography.Title>
                      </div>
                      
                      <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                          {[
                            {
                              icon: (
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              ),
                              title: "Abstract Submission Opens",
                              date: "15 August 2025",
                              gradient: "from-[#4CB050] to-[#F0A023]",
                              bgColor: "bg-green-50 dark:bg-green-900/20",
                              borderColor: "border-green-200 dark:border-green-800"
                            },
                            {
                              icon: (
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              ),
                              title: "Abstract Submission Deadline",
                              date: "4 September 2025",
                              gradient: "from-[#F0A023] to-[#E52531]",
                              bgColor: "bg-orange-50 dark:bg-orange-900/20",
                              borderColor: "border-orange-200 dark:border-orange-800"
                            },
                            {
                              icon: (
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                </svg>
                              ),
                              title: "Announcement",
                              date: "4 September 2025",
                              gradient: "from-[#E52531] to-[#2a3b8f]",
                              bgColor: "bg-red-50 dark:bg-red-900/20",
                              borderColor: "border-red-200 dark:border-red-800"
                            },
                            {
                              icon: (
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                              ),
                              title: "Payment Due",
                              date: "12 September 2025",
                              gradient: "from-[#2a3b8f] to-[#4CB050]",
                              bgColor: "bg-blue-50 dark:bg-blue-900/20",
                              borderColor: "border-blue-200 dark:border-blue-800"
                            },
                            {
                              icon: (
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              ),
                              title: "Full Paper Deadline",
                              date: "1 October 2025",
                              gradient: "from-[#4CB050] to-[#F0A023]",
                              bgColor: "bg-purple-50 dark:bg-purple-900/20",
                              borderColor: "border-purple-200 dark:border-purple-800"
                            }
                          ].map((item, index) => (
                            <motion.div
                              key={index}
                              className={`p-6 rounded-2xl ${item.bgColor} border ${item.borderColor} hover:shadow-lg transition-all duration-300`}
                              whileHover={{ scale: 1.02 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <div className="flex items-center space-x-4">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg`}>
                                  {item.icon}
                                </div>
                                <div className="flex-1">
                                  <Typography.Title level={4} className="text-gray-900 dark:text-white mb-1 text-lg">
                                    {item.title}
                                  </Typography.Title>
                                  <Typography.Text className="text-base font-semibold text-gray-600 dark:text-gray-400">
                                    {item.date}
                                  </Typography.Text>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        
                        {/* Conference Event Highlight */}
                        <motion.div
                          className="p-8 rounded-3xl bg-gradient-to-br from-[#4CB050]/10 via-[#F0A023]/10 to-[#E52531]/10 border-2 border-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] shadow-xl"
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="text-center">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-[#4CB050] via-[#F0A023] to-[#E52531] flex items-center justify-center shadow-xl">
                              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <Typography.Title level={3} className="text-gray-900 dark:text-white mb-2 text-xl sm:text-2xl">
                              Conference Event
                            </Typography.Title>
                            <Typography.Title level={2} className="mb-3 text-2xl sm:text-3xl font-bold">
                              <span className="bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-transparent bg-clip-text">
                                7 October 2025
                              </span>
                            </Typography.Title>
                            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600">
                              
                              <Typography.Text className="font-semibold text-gray-700 dark:text-gray-300">
                                100% Online Conference
                              </Typography.Text>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
        <Footer isDarkMode={isDarkMode} />
      </div>
    </>
  );
};

export default AboutUs;
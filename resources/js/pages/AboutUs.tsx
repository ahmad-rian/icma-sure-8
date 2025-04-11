import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Head } from '@inertiajs/react';
import { Typography, Card, Divider } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface AboutUsProps {
  darkMode?: boolean;
}

const AboutUs: React.FC<AboutUsProps> = ({ darkMode = false }) => {
  const [isDarkMode, setIsDarkMode] = useState(darkMode);
  const [typedText, setTypedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const textToType = "International Conference on Multidiscipline Approaches for Sustainable Rural Development";
  
  // Typing animation effect with continuous loop
  useEffect(() => {
    if (currentIndex < textToType.length) {
      const timeout = setTimeout(() => {
        setTypedText(prev => prev + textToType[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, 100);
      
      return () => clearTimeout(timeout);
    } else {
      // Reset after a short pause when complete
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

  const fadeInUp = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.6 }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <>
      <Head title="About the 8th " />
      
      <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        
        {/* Hero Section with Parallax Effect */}
        <div className="relative overflow-hidden">
          {/* Background - changed to white with subtle patterns */}
          <div className="absolute inset-0 bg-white dark:bg-gray-900">
            <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-gradient-to-tr from-[#4CB050]/10 to-transparent"></div>
            <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-gradient-to-bl from-[#E52531]/10 to-transparent"></div>
            
            {/* Abstract geometric shapes */}
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
                
                {/* Typing text animation */}
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

            <motion.div variants={itemVariants}>
              <Card 
                className="shadow-2xl rounded-3xl overflow-hidden backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 border-0"
                bordered={false}
              >
                <div className="relative">
                  {/* Glass morphism effect with gradient overlays */}
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
                      <Typography.Paragraph className="text-lg sm:text-xl leading-relaxed mb-10 text-justify text-gray-700 dark:text-gray-200">
                        ICMA Sure 2025 presents the theme <span className="font-semibold">"Sustainable Digital Transformation: Integrating Local Values in Downstream Development"</span> as a response to the pressing need to balance digital technological advancement with environmental preservation. Amid increasingly complex environmental challenges, this conference aims to explore how digital transformation can provide innovative solutions to environmental issues while respecting and integrating local wisdom and traditional knowledge systems, particularly in downstream development.
                      </Typography.Paragraph>

                      <Typography.Paragraph className="text-lg sm:text-xl leading-relaxed mb-10 text-justify text-gray-700 dark:text-gray-200">
                        ICMA Sure 2025 establishes a critical framework for synthesizing sustainability principles, digital capabilities, and local knowledge systems, thereby creating a promising pathway for achieving environmental conservation objectives while promoting technological progress and economic development. The success of this integration will be measured not merely by technological achievements, but also by its contribution to environmental preservation and sustainable development for future generations.
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
                    >
                      <div className="mb-6 text-center">
                        <Typography.Text className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Conference Theme
                        </Typography.Text>
                        <Typography.Title level={2} className="mt-2 font-bold text-gray-900 dark:text-white">
                          <span className="bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-transparent bg-clip-text">
                            SUSTAINABLE DIGITAL TRANSFORMATION
                          </span>
                        </Typography.Title>
                        <Typography.Title level={3} className="mt-1 text-gray-700 dark:text-gray-200">
                          INTEGRATING LOCAL VALUES IN DOWNSTREAM DEVELOPMENT
                        </Typography.Title>
                        <div className="mt-6">
                          <Typography.Paragraph className="text-lg leading-relaxed text-justify text-gray-700 dark:text-gray-200">
                            "Sustainable Digital Transformation: Integrating Local Values in Downstream Development" addresses the critical intersection of technological advancement and sustainability, emphasizing how downstream implementation processes can be enhanced by incorporating local knowledge systems. It promotes a purposeful approach to digital transformation that extends beyond efficiency to embrace environmental stewardship, while recognizing the importance of indigenous wisdom and cultural practices in creating contextually appropriate solutions. By focusing on the practical application stages where technologies directly impact communities and ecosystems, the theme advocates for a holistic sustainability framework that balances environmental preservation with cultural sustainability, economic viability, and social equity. Ultimately, it calls for meaningful dialogue between modern innovations and traditional practices to create more comprehensive and effective solutions that respect local environmental contexts while promoting technological progress.
                          </Typography.Paragraph>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      variants={itemVariants}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="mt-12 mb-8"
                    >
                      <div className="rounded-xl bg-gradient-to-r p-[1px] from-[#4CB050] via-[#F0A023] to-[#E52531]">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                          <Typography.Title level={4} className="text-center mb-6 text-gray-900 dark:text-white">
                            <span className="bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-transparent bg-clip-text">
                              Timeline
                            </span>
                          </Typography.Title>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#4CB050] to-[#F0A023] flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </div>
                              </div>
                              <div>
                                <Typography.Text className="font-medium text-gray-900 dark:text-white block">
                                  Abstract Submission deadline:
                                </Typography.Text>
                                <Typography.Text className="text-gray-700 dark:text-gray-300">
                                  Coming soon
                                </Typography.Text>
                              </div>
                            </div>
                            
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#F0A023] to-[#E52531] flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                              </div>
                              <div>
                                <Typography.Text className="font-medium text-gray-900 dark:text-white block">
                                  Payment due:
                                </Typography.Text>
                                <Typography.Text className="text-gray-700 dark:text-gray-300">
                                  Coming soon
                                </Typography.Text>
                              </div>
                            </div>
                            
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#E52531] to-[#2a3b8f] flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                              </div>
                              <div>
                                <Typography.Text className="font-medium text-gray-900 dark:text-white block">
                                  Presentation Files:
                                </Typography.Text>
                                <Typography.Text className="text-gray-700 dark:text-gray-300">
                                  Coming soon
                                </Typography.Text>
                              </div>
                            </div>
                            
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#2a3b8f] to-[#4CB050] flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              </div>
                              <div>
                                <Typography.Text className="font-medium text-gray-900 dark:text-white block">
                                  Conference Event:
                                </Typography.Text>
                                <Typography.Text className="text-gray-700 dark:text-gray-300">
                                  07 October 2025
                                </Typography.Text>
                              </div>
                            </div>
                            
                            <div className="flex items-start space-x-3 md:col-span-2">
                              <div className="flex-shrink-0">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#4CB050] to-[#2a3b8f] flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                              </div>
                              <div>
                                <Typography.Text className="font-medium text-gray-900 dark:text-white block">
                                  Full Paper Due:
                                </Typography.Text>
                                <Typography.Text className="text-gray-700 dark:text-gray-300">
                                  Coming soon
                                </Typography.Text>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      variants={itemVariants} 
                      className="mt-10 flex justify-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <div className="group inline-flex items-center px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-md bg-white/90 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#4CB050]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <Typography.Text className="font-medium text-gray-900 dark:text-white">
                            07 October 2025
                          </Typography.Text>
                        </div>
                        <div className="w-px h-6 mx-4 bg-gray-300 dark:bg-gray-600"></div>
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#E52531]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <Typography.Text className="font-medium text-gray-900 dark:text-white">
                            Universitas Jenderal Soedirman
                          </Typography.Text>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Map Section - Added before Footer */}
        {/* <div className="py-16 md:py-24 dark:bg-gray-900 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-12">
                <Typography.Title level={2} className="text-3xl md:text-4xl font-bold mb-3 dark:text-white text-gray-900">
                  Conference Location
                </Typography.Title>
                <div className="h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531]"></div>
              </div>
              
              <Card 
                className="shadow-lg rounded-xl overflow-hidden backdrop-blur-sm dark:bg-gray-800/90 bg-white/95 border-0"
                bordered={false}
              >
                <div className="relative">
                  
                  <div className="h-80 md:h-96 w-full overflow-hidden rounded-lg">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.273760998035!2d109.24904007454352!3d-7.4339913742242545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e655ea49d9f9885%3A0x62be0b6159700eab!2sUniversitas%20Jenderal%20Soedirman!5e0!3m2!1sen!2sid!4v1691562199867!5m2!1sen!2sid" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title="ICMA SURE Conference Location"
                    ></iframe>
                  </div>
                  
                 
                  <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 max-w-sm">
                    <div className="rounded-lg overflow-hidden shadow-lg">
                      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4">
                        <div className="flex items-center mb-2">
                          <EnvironmentOutlined className="text-[#E52531] mr-2" />
                          <Typography.Text className="font-bold dark:text-white text-gray-900">
                            Java Heritage Hotel
                          </Typography.Text>
                        </div>
                        <Typography.Text className="dark:text-gray-300 text-gray-700">
                          Dr Angka Street No. 71<br />
                          Purwokerto 53122<br />
                          Jawa Tengah, Indonesia
                        </Typography.Text>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                      <Typography.Title level={4} className="mb-2 dark:text-white text-gray-900">
                        Venue Information
                      </Typography.Title>
                      <Typography.Paragraph className="dark:text-gray-300 text-gray-700">
                        The 8th ICMA SURE will be held in a hybrid method at Java Heritage Hotel, a premium venue located in the heart of Purwokerto, offering excellent conference facilities and convenient access for all participants.
                      </Typography.Paragraph>
                    </div>
                    
                    <a 
                      href="https://goo.gl/maps/JvTzJFqnZZwbg9sQ8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-md bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-white self-center md:self-end"
                    >
                      <EnvironmentOutlined className="mr-2" />
                      Get Directions
                    </a>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div> */}
        
        <Footer isDarkMode={isDarkMode} />
      </div>
    </>
  );
};

export default AboutUs;
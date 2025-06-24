import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Head, Link } from '@inertiajs/react';
import { Typography } from 'antd';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Array of funny 404 messages
const errorMessages = [
    {
        text: "Oops! This page seems to have gone on a research expedition.",
        subtitle: "Don't worry, our best scientists are looking for it!"
    },
    {
        text: "404: Page not found in our database.",
        subtitle: "Even our advanced algorithms couldn't locate this one."
    },
    {
        text: "This page is currently attending another conference.",
        subtitle: "It might be networking with other web pages."
    },
    {
        text: "We've searched every corner of the internet.",
        subtitle: "This page is either missing or on a coffee break."
    },
    {
        text: "Page not found in our sustainable development plan.",
        subtitle: "But we're committed to finding better solutions!"
    }
];

const colors = {
    red: '#E52531',
    green: '#4CB050',
    blue: '#2a3b8f',
    orange: '#F0A023'
};

export default function NotFound() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [errorMessage, setErrorMessage] = useState(errorMessages[0]);
    
    // Set random error message on page load
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * errorMessages.length);
        setErrorMessage(errorMessages[randomIndex]);
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
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

    return (
        <>
            <Head title="404 - Page Not Found" />
            <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                
                {/* Beautiful gradient background */}
                <div className="relative overflow-hidden min-h-screen">
                    {/* Background patterns */}
                    <div className="absolute inset-0 bg-white dark:bg-gray-900">
                        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-gradient-to-tr from-[#E52531]/10 to-transparent"></div>
                        <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-gradient-to-bl from-[#4CB050]/10 to-transparent"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#F0A023]/5 via-[#E52531]/5 to-[#4CB050]/5"></div>
                        
                        {/* Animated geometric shapes */}
                        <svg className="absolute top-0 left-0 w-full h-full opacity-5" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0,0 L1000,0 L1000,1000 L0,1000 Z" fill="none" stroke={colors.blue} strokeWidth="2" />
                            <circle cx="500" cy="500" r="300" fill="none" stroke={colors.green} strokeWidth="2" />
                            <polygon points="500,200 800,500 500,800 200,500" fill="none" stroke={colors.red} strokeWidth="2" />
                        </svg>
                        
                        {/* Floating particles */}
                        <div className="absolute top-32 left-1/4 w-4 h-4 bg-[#4CB050]/30 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-[#E52531]/30 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute bottom-1/3 left-1/3 w-5 h-5 bg-[#F0A023]/30 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
                    </div>

                    {/* Content */}
                    <motion.div 
                        className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <div className="max-w-4xl w-full text-center">
                            
                            {/* Logo Section */}
                            <motion.div variants={itemVariants} className="mb-12">
                                <motion.img
                                    src="/images/assets/logo.png"
                                    alt="ICMA SURE Logo"
                                    className="h-20 sm:h-24 mx-auto mb-6"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                />
                                <Typography.Title level={1} className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                    <span>The 8</span>
                                    <sup className="text-lg">th</sup>
                                    <span className="bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-transparent bg-clip-text"> ICMA SURE</span>
                                </Typography.Title>
                                <div className="h-1 w-32 mx-auto rounded-full bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531]"></div>
                            </motion.div>

                            {/* 404 Error Section */}
                            <motion.div variants={itemVariants} className="mb-12">
                                {/* Animated 404 with particles */}
                                <div className="relative mb-8">
                                    <motion.div 
                                        className="inline-flex items-center justify-center w-40 h-40 bg-gradient-to-r from-[#E52531] via-[#F0A023] to-[#4CB050] rounded-full shadow-2xl mb-8"
                                        animate={{ 
                                            rotate: [0, 5, -5, 0],
                                            scale: [1, 1.05, 1]
                                        }}
                                        transition={{ 
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <span className="text-white text-5xl sm:text-6xl font-bold">404</span>
                                    </motion.div>
                                    
                                    {/* Floating particles around 404 */}
                                    <motion.div 
                                        className="absolute -top-4 -right-4 w-6 h-6 bg-[#F0A023] rounded-full"
                                        animate={{ y: [-10, 10, -10] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    ></motion.div>
                                    <motion.div 
                                        className="absolute -bottom-2 -left-6 w-4 h-4 bg-[#4CB050] rounded-full"
                                        animate={{ x: [-5, 5, -5] }}
                                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                    ></motion.div>
                                    <motion.div 
                                        className="absolute top-8 -left-8 w-3 h-3 bg-[#E52531] rounded-full"
                                        animate={{ 
                                            scale: [1, 1.2, 1],
                                            rotate: [0, 180, 360]
                                        }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    ></motion.div>
                                </div>

                                <Typography.Title level={1} className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                                    Page Not Found
                                </Typography.Title>
                                
                                <div className="max-w-2xl mx-auto mb-8">
                                    <Typography.Paragraph className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                                        {errorMessage.text}
                                    </Typography.Paragraph>
                                    <Typography.Paragraph className="text-lg text-gray-500 dark:text-gray-400">
                                        {errorMessage.subtitle}
                                    </Typography.Paragraph>
                                </div>
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div variants={itemVariants} className="mb-12">
                                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 max-w-2xl mx-auto">
                                    <Link href="/">
                                        <motion.button 
                                            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] hover:from-[#3a8f3f] hover:via-[#d4901f] hover:to-[#c91e28] text-white font-bold rounded-2xl shadow-xl transition-all duration-300 text-lg flex items-center justify-center gap-3"
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                            </svg>
                                            Return to Homepage
                                        </motion.button>
                                    </Link>

                                    <motion.button 
                                        onClick={() => window.history.back()}
                                        className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-white font-semibold rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600 transition-all duration-300 text-lg flex items-center justify-center gap-3"
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Go Back
                                    </motion.button>
                                </div>
                            </motion.div>

                            

                           

                            {/* Contact */}
                            <motion.div variants={itemVariants}>
                                <Typography.Paragraph className="text-gray-600 dark:text-gray-400 text-lg">
                                    Need help? Contact 
                                    <a 
                                        href="mailto:icmasure.lppm@unsoed.com" 
                                        className="text-transparent bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] bg-clip-text font-bold hover:underline ml-2 transition-all duration-300"
                                    >
                                        icmasure.lppm@unsoed.com
                                    </a>
                                </Typography.Paragraph>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
                
            
            </div>
        </>
    );
}
import React from 'react';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
    ClockIcon,
    ExclamationTriangleIcon,
    CalendarDaysIcon
} from '@heroicons/react/24/outline';

interface SubmissionClosedProps {
    auth?: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
}

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
            staggerChildren: 0.15,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.4, ease: "easeOut" as const }
    }
};

export default function SubmissionClosed({ auth }: SubmissionClosedProps) {
    return (
        <>
            <Head title="Submission Period Closed - ICMA SURE 2025" />
            
            <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                <Navbar />
                
                <div className="relative overflow-hidden">
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-white dark:bg-gray-900">
                        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-gradient-to-tr from-[#E52531]/10 to-transparent"></div>
                        <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-gradient-to-bl from-[#F0A023]/10 to-transparent"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-[#E52531]/5 via-[#F0A023]/5 to-[#4CB050]/5"></div>
                        
                        <svg className="absolute top-0 left-0 w-full h-full opacity-5" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor={colors.red} />
                                    <stop offset="50%" stopColor={colors.orange} />
                                    <stop offset="100%" stopColor={colors.green} />
                                </linearGradient>
                            </defs>
                            <circle cx="200" cy="200" r="150" fill="none" stroke="url(#gradient1)" strokeWidth="2" opacity="0.3" />
                            <circle cx="800" cy="300" r="100" fill="none" stroke="url(#gradient1)" strokeWidth="2" opacity="0.2" />
                            <circle cx="600" cy="700" r="120" fill="none" stroke="url(#gradient1)" strokeWidth="2" opacity="0.25" />
                        </svg>
                    </div>

                    {/* Main Content */}
                    <div className="relative z-10">
                        <motion.div 
                            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32"
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                        >
                            {/* Main Notice */}
                            <motion.div 
                                className="text-center mb-16"
                                variants={itemVariants}
                            >
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#E52531] to-[#F0A023] mb-8 shadow-xl">
                                    <ClockIcon className="w-10 h-10 text-white" />
                                </div>
                                
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                                    Submission Period{' '}
                                    <span className="bg-gradient-to-r from-[#E52531] via-[#F0A023] to-[#4CB050] text-transparent bg-clip-text">
                                        Closed
                                    </span>
                                </h1>
                                
                                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                                    Thank you for your interest in ICMA-SURE 2025. The abstract submission period has officially closed.
                                </p>

                                <div className="h-1 w-32 mx-auto rounded-full bg-gradient-to-r from-[#E52531] via-[#F0A023] to-[#4CB050]"></div>
                            </motion.div>

                            {/* Info Cards */}
                            <motion.div 
                                className="grid md:grid-cols-2 gap-8 mb-16"
                                variants={containerVariants}
                            >
                                {/* Submission Status */}
                                <motion.div
                                    variants={itemVariants}
                                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden"
                                >
                                    <div className="p-8">
                                        <div className="flex items-center mb-6">
                                            <ExclamationTriangleIcon className="h-8 w-8 text-[#E52531] mr-3" />
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Submission Status</h3>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-700">
                                                <span className="text-red-800 dark:text-red-400 font-medium">Abstract Submission</span>
                                                <span className="px-3 py-1 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-full text-sm font-semibold">
                                                    CLOSED
                                                </span>
                                            </div>
                                            
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                <p className="mb-2">
                                                    <strong>Submission Deadline:</strong> September 15, 2025
                                                </p>
                                                <p>
                                                    We have reached the maximum capacity for submissions and the deadline has passed.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Important Dates */}
                                <motion.div
                                    variants={itemVariants}
                                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden"
                                >
                                    <div className="p-8">
                                        <div className="flex items-center mb-6">
                                            <CalendarDaysIcon className="h-8 w-8 text-[#4CB050] mr-3" />
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Conference Schedule</h3>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700">
                                                <div className="text-green-800 dark:text-green-400 font-medium mb-2">
                                                    Conference Date
                                                </div>
                                                <div className="text-2xl font-bold text-green-900 dark:text-green-300">
                                                    October 7, 2025
                                                </div>
                                                <div className="text-sm text-green-700 dark:text-green-400 mt-1">
                                                    100% Online Conference
                                                </div>
                                            </div>
                                            
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                <p>
                                                    <strong>Payment Due:</strong> September 19, 2025<br />
                                                    <strong>Announcement:</strong> September 17, 2025
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Contact Information */}
                            <motion.div
                                variants={itemVariants}
                                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden"
                            >
                                <div className="p-8 text-center">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                        Need Assistance?
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                                        If you have any questions about the conference or submitted abstracts, please contact our organizing committee.
                                    </p>
                                    
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <a 
                                            href="mailto:icmasure.lppm@unsoed.ac.id"
                                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#4CB050] to-[#F0A023] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            Email Us
                                        </a>
                                        
                                        <a 
                                            href="https://wa.me/6285385323228"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.382"/>
                                            </svg>
                                            WhatsApp
                                        </a>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Thank You Message */}
                            <motion.div 
                                className="text-center mt-16"
                                variants={itemVariants}
                            >
                                <p className="text-lg text-gray-600 dark:text-gray-300">
                                    Thank you for your interest in ICMA-SURE 2025. We look forward to future conferences!
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
                
                <Footer />
            </div>
        </>
    );
}

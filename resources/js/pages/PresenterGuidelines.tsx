import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
    ClipboardDocumentCheckIcon,
    ClockIcon,
    SpeakerWaveIcon,
    UsersIcon,
    DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

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
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" as const }
    }
};

export default function PresenterGuidelines() {
    const guidelines = [
        {
            icon: ClipboardDocumentCheckIcon,
            title: "Preparation Before the Session",
            color: colors.blue,
            items: [
                "Join at the assigned room at least 15 minutes before the session starts.",
                "Prepare your presentation file in PowerPoint (PPT) format according to the template (available in the website of ICMASURE 2025)",
                "Submit your PPT file to the designated Google Drive folder no later than 6 October 2025, and please make sure to upload it to the subfolder according to your session. https://bit.ly/PresenterPPTSubmissionFolder",
                "Check the technical setup (laptop, microphone, and internet connection).",
                "Prepare a concise presentation that highlights the key points of your paper."
            ]
        },
        {
            icon: SpeakerWaveIcon,
            title: "During the Presentation",
            color: colors.green,
            items: [
                "Each presenter is allocated max. 7 minutes for the presentation and 3 minutes for discussion/Q&A.",
                "Respect the allocated time and avoid exceeding the limit.",
                "Present confidently using clear and simple language.",
                "Ensure that slides are readable, with minimal text and clear visuals."
            ]
        },
        {
            icon: UsersIcon,
            title: "Interaction with the Audience",
            color: colors.orange,
            items: [
                "Respond to questions politely and briefly during the discussion time.",
                "If unable to address all questions, you may continue the discussion informally after the session."
            ]
        },
        {
            icon: ClockIcon,
            title: "General Etiquette",
            color: colors.red,
            items: [
                "Be present throughout the session to support fellow presenters.",
                "Respect the moderator's instructions and time reminders."
            ]
        }
    ];

    return (
        <>
            <Head title="Presenter Guidelines - ICMA SURE 2025" />
            
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
                            className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32"
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                        >
                            {/* Header */}
                            <motion.div 
                                className="text-center mb-16"
                                variants={itemVariants}
                            >
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#E52531] to-[#F0A023] mb-8 shadow-xl">
                                    <SpeakerWaveIcon className="w-10 h-10 text-white" />
                                </div>
                                
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                                    Guidelines for{' '}
                                    <span className="bg-gradient-to-r from-[#E52531] via-[#F0A023] to-[#4CB050] text-transparent bg-clip-text">
                                        Presenters
                                    </span>
                                    {' '}in Parallel Sessions
                                </h1>
                                
                                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                                    As a presenter, you are responsible for delivering your paper clearly, concisely, and within the given time allocation. Please follow the guidance below:
                                </p>

                                <div className="h-1 w-32 mx-auto rounded-full bg-gradient-to-r from-[#E52531] via-[#F0A023] to-[#4CB050]"></div>
                            </motion.div>

                            {/* Guidelines Sections */}
                            <motion.div 
                                className="space-y-12 mb-16"
                                variants={containerVariants}
                            >
                                {guidelines.map((section, index) => (
                                    <motion.div
                                        key={section.title}
                                        variants={itemVariants}
                                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden"
                                    >
                                        <div className="p-8">
                                            <div className="flex items-center mb-6">
                                                <div 
                                                    className="flex items-center justify-center w-12 h-12 rounded-xl mr-4 shadow-lg"
                                                    style={{ backgroundColor: section.color }}
                                                >
                                                    <section.icon className="h-6 w-6 text-white" />
                                                </div>
                                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {index + 1}. {section.title}
                                                </h2>
                                            </div>
                                            
                                            <ul className="space-y-4">
                                                {section.items.map((item, itemIndex) => (
                                                    <li key={itemIndex} className="flex items-start">
                                                        <span 
                                                            className="inline-block w-2 h-2 rounded-full mt-2 mr-4 flex-shrink-0"
                                                            style={{ backgroundColor: section.color }}
                                                        ></span>
                                                        <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                                            {item.includes('https://bit.ly/PresenterPPTSubmissionFolder') ? (
                                                                <>
                                                                    Submit your PPT file to the designated Google Drive folder no later than 6 October 2025, and please make sure to upload it to the subfolder according to your session.
                                                                    <br />
                                                                    <span className="mt-2 inline-block">
                                                                        <span className="text-gray-700 dark:text-gray-300">Google Drive submission link: </span>
                                                                        <a 
                                                                            href="https://bit.ly/PresenterPPTSubmissionFolder"
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-[#4285F4] to-[#34A853] text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
                                                                        >
                                                                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                                                                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                                                                            </svg>
                                                                            bit.ly/PresenterPPTSubmissionFolder
                                                                        </a>
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                item
                                                            )}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Closing Section */}
                            <motion.div
                                variants={itemVariants}
                                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden mb-16"
                            >
                                <div className="p-8">
                                    <div className="flex items-center mb-6">
                                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-[#E52531] to-[#4CB050] mr-4 shadow-lg">
                                            <ClipboardDocumentCheckIcon className="h-6 w-6 text-white" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            5. Closing
                                        </h2>
                                    </div>
                                    
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-[#E52531] to-[#4CB050] mt-2 mr-4 flex-shrink-0"></span>
                                            <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                                Thank the audience and moderator at the end of your presentation.
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-[#E52531] to-[#4CB050] mt-2 mr-4 flex-shrink-0"></span>
                                            <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                                Ensure that all personal files/devices are collected after the session.
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </motion.div>

                            {/* Download Template Section */}
                            <motion.div
                                variants={itemVariants}
                                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden"
                            >
                                <div className="p-8 text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#4CB050] to-[#F0A023] mb-6 shadow-xl">
                                        <DocumentArrowDownIcon className="w-8 h-8 text-white" />
                                    </div>
                                    
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                        Download Presentation Template
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                                        Use our official presentation template to ensure consistency and professional appearance across all presentations.
                                    </p>
                                    
                                    <a 
                                        href="/download/Template_Presentasi_ICMA_SURE_2025.pptx"
                                        download="Template_Presentasi_ICMA_SURE_2025.pptx"
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#4CB050] to-[#F0A023] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                                    >
                                        <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                                        Download PPT Template
                                    </a>
                                    
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                                        File format: PowerPoint (.pptx) • File size: ~2MB
                                    </p>
                                </div>
                            </motion.div>

                            
                        </motion.div>
                    </div>
                </div>
                
                <Footer />
            </div>
        </>
    );
}

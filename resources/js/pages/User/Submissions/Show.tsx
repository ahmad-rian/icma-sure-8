import React from 'react';
import { motion } from 'framer-motion';
import { Head, Link } from '@inertiajs/react';
import { 
    ArrowLeftIcon,
    DocumentTextIcon,
    UserIcon,
    MapPinIcon,
    CreditCardIcon,
    ArrowUpTrayIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    EyeIcon,
    DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AbstractSubmission } from '@/types/abstract-submission';

interface ShowProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    submission: AbstractSubmission;
}

const getStatusConfig = (status: string) => {
    const configs = {
        pending: { 
            color: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-900/20 dark:text-amber-400',
            icon: ClockIcon,
            label: 'Pending Review'
        },
        under_review: { 
            color: 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/20 dark:text-blue-400',
            icon: EyeIcon,
            label: 'Under Review'
        },
        approved: { 
            color: 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/20 dark:text-green-400',
            icon: CheckCircleIcon,
            label: 'Approved'
        },
        rejected: { 
            color: 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/20 dark:text-red-400',
            icon: XCircleIcon,
            label: 'Rejected'
        },
        revision_required: { 
            color: 'bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-900/20 dark:text-orange-400',
            icon: ExclamationTriangleIcon,
            label: 'Revision Required'
        },
    };
    return configs[status as keyof typeof configs] || configs.pending;
};

const getPaymentStatusConfig = (payment: any) => {
    if (!payment) {
        return { 
            color: 'bg-gray-50 text-gray-700 ring-gray-600/20 dark:bg-gray-900/20 dark:text-gray-400',
            label: 'Payment Required'
        };
    }

    const configs = {
        pending: { 
            color: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20 dark:bg-yellow-900/20 dark:text-yellow-400',
            label: 'Payment Pending' 
        },
        approved: { 
            color: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-900/20 dark:text-emerald-400',
            label: 'Payment Approved' 
        },
        rejected: { 
            color: 'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-900/20 dark:text-rose-400',
            label: 'Payment Rejected' 
        },
    };
    return configs[payment.status as keyof typeof configs] || configs.pending;
};

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
    hidden: { y: 30, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1
    }
};

export default function Show({ auth, submission }: ShowProps) {
    // Ensure safe data access with fallbacks
    const contributors = submission.contributors || [];
    const keywords = Array.isArray(submission.keywords) ? submission.keywords : (submission.keywords ? submission.keywords.split(',') : []);
    const payment = submission.payment || null;
    
    const totalParticipants = 1 + contributors.length;
    const totalAmount = totalParticipants * 150000;
    
    const statusConfig = getStatusConfig(submission.status);
    const paymentConfig = getPaymentStatusConfig(payment);
    const StatusIcon = statusConfig.icon;

    return (
        <>
            <Head title={`Submission: ${submission.title}`} />
            
            <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                <Navbar />
                
                <div className="relative overflow-hidden">
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-white dark:bg-gray-900">
                        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-gradient-to-tr from-[#4CB050]/10 to-transparent"></div>
                        <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-gradient-to-bl from-[#E52531]/10 to-transparent"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-[#4CB050]/5 via-[#2a3b8f]/5 to-[#F0A023]/5"></div>
                        
                        <svg className="absolute top-0 left-0 w-full h-full opacity-5" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor={colors.green} />
                                    <stop offset="50%" stopColor={colors.orange} />
                                    <stop offset="100%" stopColor={colors.red} />
                                </linearGradient>
                            </defs>
                            <circle cx="200" cy="200" r="150" fill="none" stroke="url(#gradient1)" strokeWidth="2" opacity="0.3" />
                            <circle cx="800" cy="300" r="100" fill="none" stroke="url(#gradient1)" strokeWidth="2" opacity="0.2" />
                            <circle cx="600" cy="700" r="120" fill="none" stroke="url(#gradient1)" strokeWidth="2" opacity="0.25" />
                            <polygon points="500,100 700,300 500,500 300,300" fill="none" stroke="url(#gradient1)" strokeWidth="2" opacity="0.2" />
                        </svg>
                    </div>

                    {/* Header Section - Reduced padding */}
                    <div className="relative z-10">
                        <motion.div 
                            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20"
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                        >
                            <motion.div 
                                className="text-center mb-12"
                                variants={itemVariants}
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4CB050] via-[#F0A023] to-[#E52531] mb-6 shadow-xl">
                                    <DocumentTextIcon className="w-8 h-8 text-white" />
                                </div>
                                
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                    Abstract{' '}
                                    <span className="bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-transparent bg-clip-text">
                                        Details
                                    </span>
                                </h1>
                                
                                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed">
                                    View and manage your submission details for ICMA-SURE 2025.
                                </p>

                                <div className="h-1 w-32 mx-auto rounded-full bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531]"></div>
                            </motion.div>
                        </motion.div>

                        {/* Main Content */}
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-10">
                            {/* Navigation and Actions Bar */}
                            <motion.div 
                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0"
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <Link 
                                    href={route('user.submissions.index')}
                                    className="inline-flex items-center px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 self-start"
                                >
                                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                    Back to Submissions
                                </Link>

                                {/* Available Actions Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 self-start sm:self-auto">
                                    {/* Upload Payment Proof Button - Show for all approved submissions */}
                                    {submission.status === 'approved' && (
                                        <Link
                                            href={route('user.submissions.upload-payment', submission.id)}
                                            className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] rounded-xl hover:from-[#4CB050] hover:to-[#E52531] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                                        >
                                            <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
                                            Upload Payment Proof
                                        </Link>
                                    )}

                                   
                                </div>
                            </motion.div>

                            <motion.div 
                                className="space-y-6 sm:space-y-8"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {/* Status Card */}
                                <motion.div
                                    variants={itemVariants}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden"
                                >
                                    <div className="p-6 sm:p-8">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 space-y-4 sm:space-y-0">
                                            <div className="flex-1 min-w-0">
                                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 break-words">
                                                    {submission.title}
                                                </h2>
                                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                                                    Submitted on {new Date(submission.submitted_at || submission.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end space-y-2">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ring-1 ring-inset ${statusConfig.color}`}>
                                                    <StatusIcon className="w-4 h-4 mr-1.5" />
                                                    {statusConfig.label}
                                                </span>
                                                {payment && (
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ring-1 ring-inset ${paymentConfig.color}`}>
                                                        {paymentConfig.label}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Abstract Content */}
                                <motion.div
                                    variants={itemVariants}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden"
                                >
                                    <div className="p-6 sm:p-8">
                                        <div className="flex items-center mb-6">
                                            <DocumentTextIcon className="h-6 w-6 text-[#4CB050] mr-3" />
                                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Abstract Content</h3>
                                        </div>
                                        
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Country</label>
                                                <div className="flex items-center text-gray-700 dark:text-gray-300">
                                                    <MapPinIcon className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                                                    <span className="break-words">{submission.country?.name}</span>
                                                </div>
                                            </div>
                                            
                                            {keywords.length > 0 && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Keywords</label>
                                                    <p className="text-gray-700 dark:text-gray-300 break-words">
                                                        {keywords.join(', ')}
                                                    </p>
                                                </div>
                                            )}
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Abstract</label>
                                                <div 
                                                    className="prose prose-sm sm:prose max-w-none dark:prose-invert text-gray-700 dark:text-gray-300 break-words"
                                                    dangerouslySetInnerHTML={{ __html: submission.abstract }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Contributors */}
                                <motion.div
                                    variants={itemVariants}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden"
                                >
                                    <div className="p-6 sm:p-8">
                                        <div className="flex items-center mb-6">
                                            <UserIcon className="h-6 w-6 text-[#4CB050] mr-3" />
                                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                                Contributors ({totalParticipants} participant{totalParticipants > 1 ? 's' : ''})
                                            </h3>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            {/* Primary Author */}
                                            <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/50">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-2 sm:space-y-0">
                                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Primary Author (You)</h4>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 self-start sm:self-auto">
                                                        Author
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300">
                                                    <p className="break-words"><span className="font-medium">Name:</span> {submission.author_first_name} {submission.author_last_name}</p>
                                                    <p className="break-words"><span className="font-medium">Email:</span> {submission.author_email}</p>
                                                    {submission.author_phone_number && (
                                                        <p className="break-words"><span className="font-medium">Phone:</span> {submission.author_phone_number}</p>
                                                    )}
                                                    {submission.author_affiliation && (
                                                        <p className="break-words"><span className="font-medium">Affiliation:</span> {submission.author_affiliation}</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Other Contributors */}
                                            {contributors.length > 0 && (
                                                <div className="space-y-3">
                                                    {contributors.map((contributor, index) => (
                                                        <div key={index} className="p-4 sm:p-6 border rounded-2xl bg-gray-50/50 dark:bg-slate-700/50 border-gray-200/50 dark:border-slate-600/50">
                                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-2 sm:space-y-0">
                                                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 break-words">
                                                                    {contributor.first_name} {contributor.last_name}
                                                                </h4>
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 self-start sm:self-auto">
                                                                    Co-Author
                                                                </span>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300">
                                                                <p className="break-words"><span className="font-medium">Email:</span> {contributor.email}</p>
                                                                <p className="break-words"><span className="font-medium">Country:</span> {contributor.country?.name}</p>
                                                                {contributor.phone_number && (
                                                                    <p className="break-words"><span className="font-medium">Phone:</span> {contributor.phone_number}</p>
                                                                )}
                                                                <p className="md:col-span-2 break-words"><span className="font-medium">Affiliation:</span> {contributor.affiliation}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Payment Section */}
                                {submission.status === 'approved' && (
                                    <motion.div
                                        variants={itemVariants}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden"
                                    >
                                        <div className="p-6 sm:p-8">
                                            <div className="flex items-center mb-6">
                                                <CreditCardIcon className="h-6 w-6 text-[#4CB050] mr-3" />
                                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Payment Information</h3>
                                            </div>
                                            
                                            <div className="space-y-6">
                                                <div className="p-4 sm:p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200/50 dark:border-green-700/50">
                                                    <h4 className="font-semibold text-green-800 dark:text-green-400 mb-3">Registration Fee</h4>
                                                    <div className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                                                        <p>Fee per participant: <span className="font-medium">IDR 150,000</span></p>
                                                        <p>Total participants: <span className="font-medium">{totalParticipants}</span></p>
                                                        <p className="text-base sm:text-lg font-bold text-green-800 dark:text-green-400">Total amount: IDR {totalAmount.toLocaleString('id-ID')}</p>
                                                    </div>
                                                </div>

                                                <div className="p-4 sm:p-6 border rounded-2xl bg-gray-50/50 dark:bg-slate-700/50 border-gray-200/50 dark:border-slate-600/50">
                                                    <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Bank Details</h4>
                                                    <div className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                                                        <p><span className="font-medium">Bank Name:</span> Bank Mandiri</p>
                                                        <p><span className="font-medium">Account Number:</span> 1800044322222</p>
                                                        <p><span className="font-medium">Account Holder:</span> RPL 029 BLU Unsoed</p>
                                                    </div>
                                                </div>

                                                {payment && (
                                                    <div className="p-4 sm:p-6 border rounded-2xl bg-gray-50/50 dark:bg-slate-700/50 border-gray-200/50 dark:border-slate-600/50">
                                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-2 sm:space-y-0">
                                                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">Payment Status</h4>
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ring-1 ring-inset ${paymentConfig.color} self-start sm:self-auto`}>
                                                                {paymentConfig.label}
                                                            </span>
                                                        </div>
                                                        <div className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                                                            <p><span className="font-medium">Amount:</span> IDR {parseInt(payment.amount.toString()).toLocaleString('id-ID')}</p>
                                                            <p><span className="font-medium">Uploaded:</span> {new Date(payment.uploaded_at || payment.created_at).toLocaleDateString('id-ID')}</p>
                                                            {payment.admin_notes && (
                                                                <p className="break-words"><span className="font-medium">Notes:</span> {payment.admin_notes}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
                
                <Footer />
            </div>
        </>
    );
}
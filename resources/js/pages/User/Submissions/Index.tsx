import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Head, Link } from '@inertiajs/react';
import { 
    PlusIcon, 
    EyeIcon, 
    PencilIcon, 
    ArrowDownTrayIcon, 
    ArrowUpTrayIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    DocumentTextIcon,
    UserIcon,
    MapPinIcon,
    TagIcon,
    DocumentArrowDownIcon,
    AcademicCapIcon
} from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
// import { AbstractSubmission } from '@/types/abstract-submission';

interface AbstractSubmission {
    id: number;
    title: string;
    abstract: string;
    keywords: string;
    submission_file: string;
    status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'revision_required';
    submitted_at?: string;
    created_at: string;
    updated_at: string;
    review_comments?: string;
    letter_of_acceptance?: string;
    country?: {
        id: number;
        name: string;
    };
    contributors?: Array<{
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        affiliation: string;
        country_id: number;
        role: string;
        is_main_contact: boolean;
    }>;
    payment?: {
        id: number;
        amount: number;
        status: 'pending' | 'approved' | 'rejected';
        payment_proof?: string;
        created_at: string;
    };
    reviewer?: {
        id: number;
        name: string;
    };
}

interface IndexProps {
    auth: {
        user: any;
    };
    submissions: AbstractSubmission[];
}

const getStatusConfig = (status: string) => {
    const configs = {
        pending: { 
            color: 'bg-amber-50 text-amber-700 ring-amber-600/20',
            icon: ClockIcon,
            label: 'Pending Review',
            bgColor: 'bg-amber-500',
            gradient: 'from-amber-400 to-orange-500'
        },
        under_review: { 
            color: 'bg-blue-50 text-blue-700 ring-blue-600/20',
            icon: EyeIcon,
            label: 'Under Review',
            bgColor: 'bg-blue-500',
            gradient: 'from-blue-400 to-indigo-500'
        },
        approved: { 
            color: 'bg-green-50 text-green-700 ring-green-600/20',
            icon: CheckCircleIcon,
            label: 'Approved',
            bgColor: 'bg-green-500',
            gradient: 'from-green-400 to-emerald-500'
        },
        rejected: { 
            color: 'bg-red-50 text-red-700 ring-red-600/20',
            icon: XCircleIcon,
            label: 'Rejected',
            bgColor: 'bg-red-500',
            gradient: 'from-red-400 to-rose-500'
        },
        revision_required: { 
            color: 'bg-orange-50 text-orange-700 ring-orange-600/20',
            icon: ExclamationTriangleIcon,
            label: 'Revision Required',
            bgColor: 'bg-orange-500',
            gradient: 'from-orange-400 to-red-500'
        },
    };
    return configs[status as keyof typeof configs] || configs.pending;
};

const getPaymentStatusConfig = (payment: any) => {
    if (!payment) {
        return { 
            color: 'bg-gray-50 text-gray-700 ring-gray-600/20',
            label: 'Payment Required'
        };
    }

    const configs = {
        pending: { 
            color: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
            label: 'Payment Pending' 
        },
        approved: { 
            color: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
            label: 'Payment Approved' 
        },
        rejected: { 
            color: 'bg-rose-50 text-rose-700 ring-rose-600/20',
            label: 'Payment Rejected' 
        },
    };
    return configs[payment.status as keyof typeof configs] || configs.pending;
};

const getProgressPercentage = (submission: AbstractSubmission) => {
    if (submission.status === 'rejected') return 0;
    if (submission.status === 'pending' || submission.status === 'revision_required') return 25;
    if (submission.status === 'under_review') return 50;
    if (submission.status === 'approved' && !submission.payment) return 75;
    if (submission.status === 'approved' && submission.payment?.status === 'pending') return 90;
    if (submission.status === 'approved' && submission.payment?.status === 'approved') return 100;
    return 0;
};

const getProgressText = (submission: AbstractSubmission) => {
    if (submission.status === 'pending') return 'Waiting for review';
    if (submission.status === 'under_review') return 'Under review by committee';
    if (submission.status === 'approved' && !submission.payment) return 'Approved - Payment required';
    if (submission.status === 'approved' && submission.payment?.status === 'pending') return 'Payment submitted - Waiting for verification';
    if (submission.status === 'approved' && submission.payment?.status === 'approved') return 'Complete - LoA available';
    if (submission.status === 'rejected') return 'Submission rejected';
    if (submission.status === 'revision_required') return 'Revision required';
    return 'Status unknown';
};

const colors = {
    red: '#E52531',
    green: '#4CB050',
    blue: '#2a3b8f',
    orange: '#F0A023'
};

export default function Index({ auth, submissions }: IndexProps) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const approvedCount = submissions.filter(s => s.status === 'approved').length;
    const pendingCount = submissions.filter(s => s.status === 'pending').length;
    const underReviewCount = submissions.filter(s => s.status === 'under_review').length;
    const rejectedCount = submissions.filter(s => s.status === 'rejected').length;

    return (
        <>
            <Head title="My Submissions" />
            
            <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
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

                    {/* Header Section */}
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
                                    My Abstract{' '}
                                    <span className="bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-transparent bg-clip-text">
                                        Submissions
                                    </span>
                                </h1>
                                
                                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed">
                                    Manage and track your abstract submissions for ICMA-SURE 2025. Monitor your submission progress and access important documents.
                                </p>

                                <div className="h-1 w-32 mx-auto rounded-full bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] mb-8"></div>

                                {/* New Submission Button */}
                                <div className="mb-8">
                                    <Link
                                        href={route('user.submissions.create')}
                                        className="inline-flex items-center px-8 py-4 rounded-2xl bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-white font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <PlusIcon className="-ml-1 mr-3 h-6 w-6" />
                                        New Submission
                                    </Link>
                                </div>
                                
                                {/* Statistics */}
                                {submissions.length > 0 && (
                                    <motion.div 
                                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
                                        variants={containerVariants}
                                    >
                                        <motion.div 
                                            className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-gray-700/20"
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2a3b8f] to-[#4CB050] flex items-center justify-center">
                                                    <DocumentTextIcon className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{submissions.length}</div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Submissions</div>
                                                </div>
                                            </div>
                                        </motion.div>

                                        <motion.div 
                                            className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-gray-700/20"
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4CB050] to-[#F0A023] flex items-center justify-center">
                                                    <CheckCircleIcon className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{approvedCount}</div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">Approved</div>
                                                </div>
                                            </div>
                                        </motion.div>

                                        <motion.div 
                                            className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-gray-700/20"
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F0A023] to-[#E52531] flex items-center justify-center">
                                                    <ClockIcon className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{pendingCount}</div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
                                                </div>
                                            </div>
                                        </motion.div>

                                        <motion.div 
                                            className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-gray-700/20"
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E52531] to-[#2a3b8f] flex items-center justify-center">
                                                    <EyeIcon className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{underReviewCount}</div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">Under Review</div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </motion.div>
                        </motion.div>

                        {/* Main Content - Reduced padding */}
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-10">
                            {submissions.length === 0 ? (
                                /* Empty State */
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6 }}
                                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20"
                                >
                                    <div className="px-8 py-20">
                                        <div className="text-center max-w-md mx-auto">
                                            <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-3xl flex items-center justify-center">
                                                <DocumentTextIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                                No submissions yet
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-lg">
                                                Get started by submitting your first abstract for the ICMA-SURE 2025 conference. 
                                                Share your research and join the global conversation on sustainable development.
                                            </p>
                                            <Link
                                                href={route('user.submissions.create')}
                                                className="inline-flex items-center px-8 py-4 rounded-2xl bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-white font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1"
                                            >
                                                <PlusIcon className="-ml-1 mr-3 h-6 w-6" />
                                                Submit Your First Abstract
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                /* Submissions Grid */
                                <motion.div 
                                    className="space-y-8"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {submissions.map((submission, index) => {
                                        const statusConfig = getStatusConfig(submission.status);
                                        const paymentConfig = getPaymentStatusConfig(submission.payment);
                                        const StatusIcon = statusConfig.icon;
                                        const progressPercentage = getProgressPercentage(submission);

                                        return (
                                            <motion.div
                                                key={submission.id}
                                                variants={itemVariants}
                                                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                                                whileHover={{ scale: 1.01 }}
                                            >
                                                {/* Gradient top border */}
                                                <div className={`h-2 bg-gradient-to-r ${statusConfig.gradient}`}></div>
                                                
                                                <div className="p-8">
                                                    {/* Card Header */}
                                                    <div className="flex items-start justify-between mb-8">
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                                                                {submission.title}
                                                            </h3>
                                                            <p className="text-gray-600 dark:text-gray-300 flex items-center text-lg">
                                                                <ClockIcon className="w-5 h-5 mr-3 text-gray-400" />
                                                                Submitted on {' '}
                                                                {new Date(submission.submitted_at || submission.created_at).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col items-end space-y-3 ml-8">
                                                            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ring-2 ring-inset ${statusConfig.color}`}>
                                                                <StatusIcon className="w-4 h-4 mr-2" />
                                                                {statusConfig.label}
                                                            </div>
                                                            {submission.payment && (
                                                                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ring-2 ring-inset ${paymentConfig.color}`}>
                                                                    {paymentConfig.label}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Details Grid */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                                        <div className="flex items-start space-x-4">
                                                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center">
                                                                <MapPinIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <dt className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Country</dt>
                                                                <dd className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                                    {submission.country?.name || 'Not specified'}
                                                                </dd>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start space-x-4">
                                                            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center">
                                                                <UserIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <dt className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Contributors</dt>
                                                                <dd className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                    {submission.contributors?.length || 0} contributor(s)
                                                                </dd>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start space-x-4">
                                                            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center">
                                                                <TagIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <dt className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Keywords</dt>
                                                                <dd className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                                    {submission.keywords || 'No keywords'}
                                                                </dd>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start space-x-4">
                                                            <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center">
                                                                <EyeIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <dt className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Reviewer</dt>
                                                                <dd className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                    {submission.reviewer?.name || 'Not assigned'}
                                                                </dd>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Progress Section */}
                                                    <div className="mb-8">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <span className="text-lg font-bold text-gray-900 dark:text-white">Progress</span>
                                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                                                                {getProgressText(submission)}
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                                            <motion.div
                                                                className={`h-3 rounded-full bg-gradient-to-r ${statusConfig.gradient}`}
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${progressPercentage}%` }}
                                                                transition={{ duration: 1, delay: index * 0.1 }}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Review Comments */}
                                                    {submission.review_comments && (
                                                        <div className="mb-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded-r-xl">
                                                            <div className="flex items-start space-x-3">
                                                                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                                                                <div>
                                                                    <h4 className="text-sm font-bold text-yellow-800 dark:text-yellow-200 mb-2">Review Comments</h4>
                                                                    <p className="text-sm text-yellow-700 dark:text-yellow-300 leading-relaxed">
                                                                        {submission.review_comments}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Actions */}
                                                    <div className="flex flex-wrap items-center gap-4">
                                                        <Link
                                                            href={route('user.submissions.show', submission.id)}
                                                            className="inline-flex items-center px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                                                        >
                                                            <EyeIcon className="-ml-0.5 mr-2 h-4 w-4" />
                                                            View Details
                                                        </Link>

                                                        {submission.status === 'approved' && !submission.payment && (
                                                            <Link
                                                                href={route('user.submissions.show', submission.id)}
                                                                className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#4CB050] to-[#F0A023] rounded-xl hover:from-[#4CB050] hover:to-[#E52531] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                                                            >
                                                                <ArrowUpTrayIcon className="-ml-0.5 mr-2 h-4 w-4" />
                                                                Upload Payment
                                                            </Link>
                                                        )}

                                                        {submission.payment?.status === 'approved' && submission.letter_of_acceptance && (
                                                            <Link
                                                                href={route('user.submissions.download-loa', submission.id)}
                                                                className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#4CB050] to-[#2a3b8f] rounded-xl hover:from-[#4CB050] hover:to-[#F0A023] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                                                            >
                                                                <DocumentArrowDownIcon className="-ml-0.5 mr-2 h-4 w-4" />
                                                                Download LoA
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}
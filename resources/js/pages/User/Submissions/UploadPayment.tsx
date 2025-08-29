import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
    ArrowLeftIcon, 
    CreditCardIcon, 
    DocumentTextIcon, 
    CloudArrowUpIcon, 
    CheckCircleIcon, 
    ExclamationCircleIcon, 
    InformationCircleIcon,
    EyeIcon,
    ClockIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AbstractSubmission } from '@/types/abstract-submission';
import { motion } from 'framer-motion';

interface PageProps {
    auth: {
        user: any;
    };
}

interface UploadPaymentProps extends PageProps {
    submission: AbstractSubmission;
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

const getPaymentStatusConfig = (status: string) => {
    switch (status) {
        case 'approved':
            return {
                color: 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/20 dark:text-green-400',
                icon: CheckCircleIcon,
                label: 'Payment Approved'
            };
        case 'pending':
            return {
                color: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20 dark:bg-yellow-900/20 dark:text-yellow-400',
                icon: ClockIcon,
                label: 'Payment Pending'
            };
        case 'rejected':
            return {
                color: 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/20 dark:text-red-400',
                icon: XCircleIcon,
                label: 'Payment Rejected'
            };
        default:
            return {
                color: 'bg-gray-50 text-gray-700 ring-gray-600/20 dark:bg-gray-900/20 dark:text-gray-400',
                icon: InformationCircleIcon,
                label: 'Payment Required'
            };
    }
};

export default function UploadPayment({ auth, submission }: UploadPaymentProps) {
    const [paymentPreview, setPaymentPreview] = useState<string | null>(null);
    
    // Ensure safe data access with fallbacks
    const contributors = submission.contributors || [];
    const contributorCount = contributors.length;
    const totalParticipants = 1 + contributorCount;
    const feePerParticipant = 150000;
    const totalAmount = totalParticipants * feePerParticipant;
    
    const { data, setData, post, processing, errors } = useForm({
        payment_proof: null as File | null,
        payment_amount: totalAmount,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('payment_proof', file);
            
            // Show preview for images
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setPaymentPreview(e.target?.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                setPaymentPreview(null);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('user.submissions.upload-payment.store', submission.id));
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
    };

    const handleViewPaymentProof = () => {
        if (submission.payment?.payment_proof) {
            // Check if payment_proof is already a full URL or just a path
            let fileUrl = submission.payment.payment_proof;
            
            // If it's already a full URL, use it directly
            if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
                window.open(fileUrl, '_blank');
            } else {
                // If it's just a path, use Laravel route for secure access
                const secureUrl = route('user.submissions.view-payment-proof', submission.id);
                window.open(secureUrl, '_blank');
            }
        }
    };

    // Check if payment already exists and is approved/pending
    const hasPayment = submission.payment;
    const isPaymentApproved = hasPayment && submission.payment?.status === 'approved';
    const isPaymentPending = hasPayment && submission.payment?.status === 'pending';
    // Check if user can upload payment proof
    // User can upload if: no payment record exists, OR payment was rejected, OR payment exists but no proof uploaded yet
    const canUpload = !hasPayment || submission.payment?.status === 'rejected' || (hasPayment && !submission.payment?.payment_proof);
    const paymentStatus = submission.payment?.status || 'none';
    const statusConfig = getPaymentStatusConfig(paymentStatus);
    const StatusIcon = statusConfig.icon;

    return (
        <>
            <Head title="Upload Payment Proof" />
            
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
                                    <CloudArrowUpIcon className="w-8 h-8 text-white" />
                                </div>
                                
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                    Upload Payment{' '}
                                    <span className="bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-transparent bg-clip-text">
                                        Proof
                                    </span>
                                </h1>
                                
                                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed px-4">
                                    Upload your payment proof for abstract submission: <strong>{submission.title}</strong>
                                </p>

                                <div className="h-1 w-32 mx-auto rounded-full bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531]"></div>
                            </motion.div>
                        </motion.div>

                        {/* Main Content */}
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-10">
                            

                            <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
                                {/* Payment Information Sidebar */}
                                <motion.div 
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="lg:col-span-1 space-y-6"
                                >
                                    {/* Payment Details Card */}
                                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
                                        <div className="p-6 sm:p-8">
                                            <div className="flex items-center mb-6">
                                                <div className="w-8 h-8 bg-gradient-to-br from-[#4CB050] to-[#F0A023] rounded-xl flex items-center justify-center mr-3">
                                                    <InformationCircleIcon className="w-4 h-4 text-white" />
                                                </div>
                                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                                    Payment Information
                                                </h3>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Abstract Title</Label>
                                                    <p className="text-sm text-gray-900 dark:text-white font-medium break-words">{submission.title}</p>
                                                </div>
                                                
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Main Author</Label>
                                                    <p className="text-sm text-gray-900 dark:text-white font-medium break-words">{submission.user?.name || 'Unknown'}</p>
                                                </div>
                                                
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Contributors</Label>
                                                    <p className="text-sm text-gray-900 dark:text-white font-medium">{contributorCount} contributor(s)</p>
                                                </div>
                                                
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Participants</Label>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{totalParticipants} participants</p>
                                                </div>
                                                
                                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Registration Fee</Label>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">IDR 150,000 per participant</p>
                                                    <p className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400">
                                                        Total: {formatCurrency(totalAmount)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bank Information Card */}
                                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
                                        <div className="p-6 sm:p-8">
                                            <div className="flex items-center mb-6">
                                                <div className="w-8 h-8 bg-gradient-to-br from-[#F0A023] to-[#E52531] rounded-xl flex items-center justify-center mr-3">
                                                    <CreditCardIcon className="w-4 h-4 text-white" />
                                                </div>
                                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                                    Bank Account Details
                                                </h3>
                                            </div>
                                            
                                            <div className="space-y-3">
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Bank Name</Label>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Bank Mandiri</p>
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Number</Label>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">1800044322222</p>
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Holder</Label>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white break-words">RPL 029 BLU Unsoed</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Upload Form or Payment Status */}
                                <motion.div 
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="lg:col-span-2"
                                >
                                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
                                        <div className="p-6 sm:p-8">
                                            <div className="flex items-center mb-6">
                                                <div className="w-8 h-8 bg-gradient-to-br from-[#2a3b8f] to-[#4CB050] rounded-xl flex items-center justify-center mr-3">
                                                    {hasPayment ? (
                                                        <DocumentTextIcon className="w-4 h-4 text-white" />
                                                    ) : (
                                                        <CloudArrowUpIcon className="w-4 h-4 text-white" />
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                                        {hasPayment ? 'Payment Status' : 'Upload Payment Proof'}
                                                    </h3>
                                                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 break-words">
                                                        {hasPayment 
                                                            ? 'Your payment proof has been uploaded and is being processed.'
                                                            : 'Please upload your payment proof after making the transfer to the bank account.'
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Current Payment Status */}
                                            {hasPayment && (
                                                <div className={`mb-6 p-4 sm:p-6 rounded-2xl border-2 ring-1 ring-inset ${statusConfig.color}`}>
                                                    <div className="flex items-start space-x-3">
                                                        <StatusIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0">
                                                                Payment Status: 
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ring-1 ring-inset ml-0 sm:ml-2 self-start">
                                                                    {submission.payment?.status === 'approved' ? 'Approved' :
                                                                     submission.payment?.status === 'rejected' ? 'Rejected' : 'Pending'}
                                                                </span>
                                                            </p>
                                                            <p className="text-sm mt-1">
                                                                Amount: {formatCurrency(parseInt(submission.payment?.amount?.toString() || '0'))}
                                                            </p>
                                                            <p className="text-sm">
                                                                Uploaded: {new Date(submission.payment?.uploaded_at || submission.payment?.created_at || '').toLocaleDateString('id-ID')}
                                                            </p>
                                                            {submission.payment?.admin_notes && (
                                                                <p className="text-sm mt-2 break-words">
                                                                    <strong>Admin Notes:</strong> {submission.payment.admin_notes}
                                                                </p>
                                                            )}
                                                            {isPaymentApproved && (
                                                                <p className="text-sm mt-2 font-medium">
                                                                    Your payment has been approved! You can now download your Letter of Acceptance.
                                                                </p>
                                                            )}
                                                            {isPaymentPending && (
                                                                <p className="text-sm mt-2">
                                                                    Your payment is being reviewed. Please wait for approval.
                                                                </p>
                                                            )}
                                                            {submission.payment?.status === 'rejected' && (
                                                                <p className="text-sm mt-2">
                                                                    Your payment has been rejected. Please contact support or upload a new payment proof.
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Show uploaded file info if payment exists */}
                                            {hasPayment && submission.payment?.payment_proof && (
                                                <div className="mb-6 p-4 sm:p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/50">
                                                    <h4 className="font-medium mb-3 flex items-center text-gray-900 dark:text-white">
                                                        <DocumentTextIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                                                        Uploaded Payment Proof
                                                    </h4>
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 break-words">
                                                                File: {submission.payment.payment_proof.split('/').pop()}
                                                            </p>
                                                            <p className="text-sm text-gray-500 dark:text-gray-500">
                                                                Uploaded on {new Date(submission.payment.uploaded_at || submission.payment.created_at).toLocaleDateString('id-ID')}
                                                            </p>
                                                        </div>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={handleViewPaymentProof}
                                                            className="flex items-center gap-2 hover:bg-indigo-50 hover:border-indigo-300 dark:hover:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700 self-start sm:self-auto"
                                                        >
                                                            <EyeIcon className="h-4 w-4" />
                                                            View File
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Upload form - only show if no payment or payment was rejected */}
                                            {canUpload && (
                                                <form onSubmit={handleSubmit} className="space-y-6">
                                                    {/* Payment Proof Upload */}
                                                    <div>
                                                        <Label htmlFor="payment_proof" className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Proof *</Label>
                                                        <Input
                                                            id="payment_proof"
                                                            type="file"
                                                            accept=".pdf,.jpg,.jpeg,.png"
                                                            onChange={handleFileChange}
                                                            className={`mt-1 h-12 rounded-xl border-2 transition-all duration-200 ${errors.payment_proof ? 'border-red-500 focus:border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-[#4CB050]'}`}
                                                            required
                                                        />
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                            Accepted formats: PDF, JPG, JPEG, PNG (Max: 5MB)
                                                        </p>
                                                        {errors.payment_proof && (
                                                            <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center">
                                                                <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                                                                {errors.payment_proof}
                                                            </p>
                                                        )}
                                                        
                                                        {/* Image Preview */}
                                                        {paymentPreview && (
                                                            <div className="mt-4">
                                                                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview:</Label>
                                                                <img 
                                                                    src={paymentPreview} 
                                                                    alt="Payment proof preview" 
                                                                    className="mt-2 max-w-full h-auto max-h-64 rounded-xl border-2 border-gray-200 dark:border-gray-600"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Payment Amount */}
                                                    <div>
                                                        <Label htmlFor="payment_amount" className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Amount *</Label>
                                                        <Input
                                                            id="payment_amount"
                                                            type="number"
                                                            value={data.payment_amount}
                                                            onChange={(e) => setData('payment_amount', parseFloat(e.target.value))}
                                                            className={`mt-1 h-12 rounded-xl border-2 transition-all duration-200 ${errors.payment_amount ? 'border-red-500 focus:border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-[#4CB050]'}`}
                                                            placeholder="150000"
                                                            min="0"
                                                            step="1000"
                                                            required
                                                        />
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                            Expected amount: {formatCurrency(totalAmount)}
                                                        </p>
                                                        {errors.payment_amount && (
                                                            <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center">
                                                                <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                                                                {errors.payment_amount}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Submit Button */}
                                                    <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                                        <Link href={route('user.submissions.show', submission.id)}>
                                                            <Button type="button" variant="outline" className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
                                                                Cancel
                                                            </Button>
                                                        </Link>
                                                        <Button 
                                                            type="submit" 
                                                            disabled={processing}
                                                            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] rounded-xl hover:from-[#4CB050] hover:to-[#E52531] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                                                            {processing ? 'Uploading...' : 'Upload Payment Proof'}
                                                        </Button>
                                                    </div>
                                                </form>
                                            )}

                                            {/* Message when payment is already uploaded and pending/approved */}
                                            {!canUpload && (
                                                <div className="text-center py-8">
                                                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-[#4CB050] to-[#F0A023] rounded-full flex items-center justify-center mb-4">
                                                        <CheckCircleIcon className="h-8 w-8 text-white" />
                                                    </div>
                                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                                        Payment Proof Already Uploaded
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-400 mb-4 px-4">
                                                        {isPaymentApproved 
                                                            ? 'Your payment has been approved. You can now download your Letter of Acceptance.'
                                                            : 'Your payment proof is being reviewed by our admin team. Please wait for approval.'
                                                        }
                                                    </p>
                                                    <Link href={route('user.submissions.show', submission.id)}>
                                                        <Button className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] rounded-xl hover:from-[#4CB050] hover:to-[#E52531] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
                                                            Back to Submission
                                                        </Button>
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <Footer />
            </div>
        </>
    );
}
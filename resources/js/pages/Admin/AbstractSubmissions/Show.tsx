import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Download, Edit, FileText, User, MapPin, Calendar, FileCheck, RefreshCw, Upload, CheckCircle, XCircle, Phone } from 'lucide-react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { AbstractSubmission } from '@/types/abstract-submission';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useState } from 'react';
import React from 'react';

export default function Show({ submission }: { submission: AbstractSubmission }) {
    const [status, setStatus] = useState<'pending' | 'approved' | 'rejected' | 'under_review'>(submission.status as 'pending' | 'approved' | 'rejected' | 'under_review');
    const [reviewerNotes, setReviewerNotes] = useState(submission.reviewer_notes || '');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

    // Calculate total amount based on contributors
    const contributorCount = submission.contributors ? submission.contributors.length : 0;
    const totalParticipants = 1 + contributorCount; // Main author + contributors
    const feePerParticipant = 150000; // IDR 150,000
    const totalAmount = totalParticipants * feePerParticipant;

    const { data: paymentData, setData: setPaymentData, post: postPayment, processing: paymentProcessing, errors: paymentErrors, reset: resetPayment } = useForm({
        payment_proof: null as File | null,
        amount: totalAmount,
        paid_at: new Date().toISOString().split('T')[0],
        method: 'bank_transfer',
        admin_notes: '',
    });

    const breadcrumbs = [
        { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'Abstract Submissions', href: route('admin.abstract-submissions.index') },
        { title: submission.title, href: '#' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'under_review':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const handleStatusUpdate = () => {
        setIsProcessing(true);
        router.put(route('admin.abstract-submissions.update', submission.id), {
            status,
            reviewer_notes: reviewerNotes,
        }, {
            onSuccess: () => {
                setIsProcessing(false);
            },
            onError: () => {
                setIsProcessing(false);
            }
        });
    };

    const handlePaymentUpload = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        if (paymentData.payment_proof) {
            formData.append('payment_proof', paymentData.payment_proof);
        }
        formData.append('payment_amount', paymentData.amount.toString());
        formData.append('payment_date', paymentData.paid_at);
        formData.append('payment_method', paymentData.method);
        formData.append('notes', paymentData.admin_notes);
        formData.append('_method', 'POST');

        router.post(route('user.submissions.upload-payment.store', submission.id), formData, {
            onSuccess: () => {
                setIsUploadDialogOpen(false);
                resetPayment();
            },
            onError: (errors) => {
                console.error('Upload errors:', errors);
            }
        });
    };

    const handlePaymentStatusUpdate = (status: 'approved' | 'rejected') => {
        setIsProcessing(true);
        router.patch(route('admin.abstract-submissions.update-payment-status', submission.id), {
            status: status,
        }, {
            onSuccess: () => {
                setIsProcessing(false);
            },
            onError: () => {
                setIsProcessing(false);
            }
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                alert('Please select a valid file (PDF, JPG, JPEG, PNG)');
                return;
            }
            
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }
            
            setPaymentData('payment_proof', file);
        }
    };

    return (
        <AppSidebarLayout>
            <Head title={`Abstract Submission - ${submission.title}`} />
            
            <div className="container mx-auto py-6 space-y-6">
                {/* Breadcrumbs */}
                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbs.map((breadcrumb, index) => (
                            <React.Fragment key={index}>
                                <BreadcrumbItem>
                                    {index === breadcrumbs.length - 1 ? (
                                        <BreadcrumbPage className="line-clamp-1">{breadcrumb.title}</BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink href={breadcrumb.href}>{breadcrumb.title}</BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                            </React.Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1 mr-4">
                        <div className="flex items-center gap-2">
                            <Link href={route('admin.abstract-submissions.index')}>
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back
                                </Button>
                            </Link>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight break-words">{submission.title}</h1>
                        <p className="text-muted-foreground">Submitted by {submission.user?.name}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge className={`${getStatusColor(submission.status)} border`}>
                            {submission.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        
                        <Link href={route('admin.abstract-submissions.edit', submission.id)}>
                            <Button size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        </Link>
                        
                        <Button size="sm" variant="outline" asChild>
                            <a href={route('admin.abstract-submissions.download-pdf', submission.id)} target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4 mr-2" />
                                Download Abstract PDF
                            </a>
                        </Button>
                        
                        <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                                router.post(route('admin.abstract-submissions.regenerate-pdf', submission.id), {}, {
                                    onSuccess: () => {
                                        // Refresh the page to show updated PDF
                                        window.location.reload();
                                    }
                                });
                            }}
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Regenerate PDF
                        </Button>
                        
                        {submission.submission_file && (
                            <Button size="sm" variant="outline" asChild>
                                <a href={submission.submission_file} target="_blank" rel="noopener noreferrer">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Submission File
                                </a>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Submission Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    <span>Submission Details</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Title</h3>
                                    <p className="text-foreground break-words">{submission.title}</p>
                                </div>
                                
                                <div className="space-y-2">
                                    <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Abstract</h3>
                                    <div className="prose prose-sm max-w-none text-foreground bg-muted/30 p-4 rounded-lg">
                                        <div 
                                            className="break-words whitespace-pre-wrap overflow-wrap-anywhere word-break-break-word hyphens-auto"
                                            style={{
                                                wordWrap: 'break-word',
                                                overflowWrap: 'anywhere',
                                                wordBreak: 'break-word',
                                                hyphens: 'auto',
                                                whiteSpace: 'pre-wrap'
                                            }}
                                            dangerouslySetInnerHTML={{ __html: submission.abstract }} 
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Keywords</h3>
                                        {submission.keywords && submission.keywords.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {submission.keywords.map((keyword: string, index: number) => (
                                                    <Badge key={index} variant="secondary">
                                                        {keyword.trim()}
                                                    </Badge>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">No keywords</span>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Submitted At</h3>
                                        <div className="flex items-center gap-2 text-foreground">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span>{new Date(submission.submitted_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Author Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    <span>Author Information</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">First Name</h3>
                                        <p className="text-foreground break-words">
                                            {submission.author_first_name || submission.user?.name?.split(' ')[0] || 'Not provided'}
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Last Name</h3>
                                        <p className="text-foreground break-words">
                                            {submission.author_last_name || submission.user?.name?.split(' ').slice(1).join(' ') || 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Email</h3>
                                        <p className="text-foreground break-words">
                                            {submission.author_email || submission.user?.email || 'Not provided'}
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Phone Number</h3>
                                        <p className="text-foreground break-words">
                                            {submission.author_phone_number || submission.user?.phone_number || 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Affiliation</h3>
                                    <p className="text-foreground break-words">
                                        {submission.author_affiliation || 'Not provided'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contributors */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    <span>Contributors</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {(submission.contributors || []).map((contributor: any, index: number) => (
                                        <div key={index} className="border rounded-lg p-4 bg-muted/30">
                                            <div className="space-y-3">
                                                <div className="flex items-start justify-between">
                                                    <h4 className="font-medium text-foreground break-words">
                                                        {contributor.first_name} {contributor.last_name}
                                                    </h4>
                                                    <Badge variant={index === 0 ? "default" : "secondary"} className="text-xs flex-shrink-0 ml-2">
                                                        {index === 0 ? "Main Author" : "Co-Author"}
                                                    </Badge>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <User className="h-4 w-4 flex-shrink-0" />
                                                        <span className="break-words">{contributor.email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <MapPin className="h-4 w-4 flex-shrink-0" />
                                                        <span className="break-words">{contributor.country?.name || 'N/A'}</span>
                                                    </div>
                                                    {contributor.phone_number && (
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <Phone className="h-4 w-4 flex-shrink-0" />
                                                            <span className="break-words">{contributor.phone_number}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                                    <FileCheck className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                                    <span className="break-words">{contributor.affiliation || 'No affiliation provided'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )) || (
                                        <p className="text-muted-foreground text-center py-4">No contributors added</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileCheck className="h-5 w-5" />
                                    <span>Status Information</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-muted-foreground">Current Status</span>
                                        <Badge className={`${getStatusColor(submission.status)} border`}>
                                            {submission.status.replace('_', ' ').toUpperCase()}
                                        </Badge>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-muted-foreground">Submitted</span>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span>{new Date(submission.submitted_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    
                                    {submission.reviewed_at && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-muted-foreground">Reviewed</span>
                                            <div className="flex items-center gap-1 text-sm">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span>{new Date(submission.reviewed_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {submission.reviewer && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-muted-foreground">Reviewer</span>
                                            <div className="flex items-center gap-1 text-sm">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                <span className="break-words">{submission.reviewer.name}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                {submission.reviewer_notes && (
                                    <div className="pt-3 border-t">
                                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Reviewer Notes</h4>
                                        <div className="bg-muted/30 p-3 rounded-lg">
                                            <p className="text-sm text-foreground break-words whitespace-pre-wrap">{submission.reviewer_notes}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* File Information */}
                        {submission.submission_file && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        <span>Attached Files</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                            <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <FileText className="h-5 w-5 text-red-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm text-foreground">Abstract PDF</p>
                                                <p className="text-xs text-muted-foreground">PDF Document</p>
                                            </div>
                                            <Button size="sm" variant="outline" asChild>
                                                <a href={submission.submission_file} target="_blank" rel="noopener noreferrer">
                                                    <Download className="h-4 w-4" />
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Review Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileCheck className="h-5 w-5" />
                                    <span>Review Actions</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                                    <Select value={status} onValueChange={(value) => setStatus(value as 'pending' | 'approved' | 'rejected' | 'under_review')}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending Review</SelectItem>
                                            <SelectItem value="under_review">Under Review</SelectItem>
                                            <SelectItem value="approved">Approved</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="reviewer_notes" className="text-sm font-medium">Reviewer Notes</Label>
                                    <Textarea
                                        id="reviewer_notes"
                                        value={reviewerNotes}
                                        onChange={(e) => setReviewerNotes(e.target.value)}
                                        placeholder="Add your review notes here..."
                                        rows={4}
                                        className="resize-none"
                                    />
                                </div>
                                
                                <div className="pt-2">
                                    <Button 
                                        onClick={handleStatusUpdate}
                                        disabled={isProcessing}
                                        className="w-full"
                                    >
                                        {isProcessing ? 'Updating...' : 'Update Status'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Submitter Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    <span>Submitter Information</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="space-y-1 min-w-0 flex-1">
                                        <p className="font-medium text-foreground break-words">{submission.user?.name}</p>
                                        <p className="text-sm text-muted-foreground break-all">{submission.user?.email}</p>
                                        {submission.author_phone_number && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Phone className="h-4 w-4 flex-shrink-0" />
                                                <span className="break-words">{submission.author_phone_number}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {submission.country && (
                                    <div className="pt-3 border-t">
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                            <span className="text-foreground break-words">{submission.country.name}</span>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Payment Information */}
                        {submission.payment && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileCheck className="h-5 w-5" />
                                        <span>Payment Information</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-muted-foreground">Amount</span>
                                            <span className="font-medium break-words">Rp {submission.payment.amount?.toLocaleString('id-ID') || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-muted-foreground">Status</span>
                                            <Badge className={`${
                                                submission.payment.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
                                                submission.payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                                'bg-red-100 text-red-800 border-red-200'
                                            } border`}>
                                                {submission.payment.status.toUpperCase()}
                                            </Badge>
                                        </div>
                                        {submission.payment.created_at && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-muted-foreground">Uploaded At</span>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <span className="break-words">{new Date(submission.payment.created_at).toLocaleDateString('id-ID', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}</span>
                                                </div>
                                            </div>
                                        )}
                                        {submission.payment.status === 'approved' && submission.payment.updated_at && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-muted-foreground">Approved At</span>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <span className="break-words">{new Date(submission.payment.updated_at).toLocaleDateString('id-ID', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {submission.payment.payment_proof && (
                                        <div className="pt-3 border-t">
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-muted-foreground">Payment Proof</span>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <a href={submission.payment.payment_proof} target="_blank" rel="noopener noreferrer">
                                                            <FileText className="mr-2 h-4 w-4" />
                                                            View Proof
                                                        </a>
                                                    </Button>
                                                </div>
                                                
                                                {/* Payment Proof Preview */}
                                                <div className="bg-muted/30 p-3 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <FileText className="h-6 w-6 text-blue-600" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-sm text-foreground">Payment Proof Document</p>
                                                            <p className="text-xs text-muted-foreground">Click 'View Proof' to open in new tab</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Payment Approval Actions */}
                                                {submission.payment.status === 'pending' && (
                                                    <div className="flex gap-2 pt-3 border-t">
                                                        <Button 
                                                            onClick={() => handlePaymentStatusUpdate('approved')}
                                                            disabled={isProcessing}
                                                            className="flex-1 bg-green-600 hover:bg-green-700"
                                                            size="sm"
                                                        >
                                                            <CheckCircle className="mr-2 h-4 w-4" />
                                                            {isProcessing ? 'Processing...' : 'Approve Payment'}
                                                        </Button>
                                                        <Button 
                                                            onClick={() => handlePaymentStatusUpdate('rejected')}
                                                            disabled={isProcessing}
                                                            variant="destructive"
                                                            className="flex-1"
                                                            size="sm"
                                                        >
                                                            <XCircle className="mr-2 h-4 w-4" />
                                                            {isProcessing ? 'Processing...' : 'Reject Payment'}
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Admin Upload Payment Button */}
                                    {!submission.payment?.payment_proof && (
                                        <div className="pt-3 border-t">
                                            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" className="w-full">
                                                        <Upload className="mr-2 h-4 w-4" />
                                                        Upload Payment Proof (Admin)
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-md">
                                                    <DialogHeader>
                                                        <DialogTitle>Upload Payment Proof</DialogTitle>
                                                        <DialogDescription>
                                                            Upload payment proof on behalf of the participant. Total amount: Rp {totalAmount.toLocaleString('id-ID')} ({totalParticipants} participants × Rp 150,000)
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <form onSubmit={handlePaymentUpload} className="space-y-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="payment_proof">Payment Proof *</Label>
                                                            <Input
                                                                id="payment_proof"
                                                                type="file"
                                                                accept=".pdf,.jpg,.jpeg,.png"
                                                                onChange={handleFileChange}
                                                                required
                                                            />
                                                            {paymentErrors.payment_proof && (
                                                                <p className="text-sm text-red-600">{paymentErrors.payment_proof}</p>
                                                            )}
                                                            <p className="text-xs text-muted-foreground">
                                                                Accepted formats: PDF, JPG, JPEG, PNG (max 5MB)
                                                            </p>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="amount">Amount (IDR)</Label>
                                                                <Input
                                                                    id="amount"
                                                                    type="number"
                                                                    value={paymentData.amount}
                                                                    onChange={(e) => setPaymentData('amount', parseInt(e.target.value))}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="paid_at">Payment Date</Label>
                                                                <Input
                                                                    id="paid_at"
                                                                    type="date"
                                                                    value={paymentData.paid_at}
                                                                    onChange={(e) => setPaymentData('paid_at', e.target.value)}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="method">Payment Method</Label>
                                                            <Select value={paymentData.method} onValueChange={(value) => setPaymentData('method', value)}>
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                                                    <SelectItem value="cash">Cash</SelectItem>
                                                                    <SelectItem value="other">Other</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="admin_notes">Admin Notes (Optional)</Label>
                                                            <Textarea
                                                                id="admin_notes"
                                                                value={paymentData.admin_notes}
                                                                onChange={(e) => setPaymentData('admin_notes', e.target.value)}
                                                                placeholder="Add any notes about this payment..."
                                                                rows={3}
                                                            />
                                                        </div>

                                                        <DialogFooter>
                                                            <Button type="button" variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                                                                Cancel
                                                            </Button>
                                                            <Button type="submit" disabled={paymentProcessing}>
                                                                {paymentProcessing ? 'Uploading...' : 'Upload Payment'}
                                                            </Button>
                                                        </DialogFooter>
                                                    </form>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    )}

                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
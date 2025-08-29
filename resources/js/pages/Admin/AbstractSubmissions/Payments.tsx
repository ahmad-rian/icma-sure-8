import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Eye,
    FileText,
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
    ArrowLeft,
    Download,
    CreditCard
} from 'lucide-react';

interface SubmissionPayment {
    id: string;
    amount: number;
    payment_proof: string;
    status: 'pending' | 'approved' | 'rejected';
    uploaded_at: string;
    reviewed_at?: string;
    reviewer_notes?: string;
    submission: {
        id: string;
        title: string;
        user: {
            id: string;
            name: string;
            email: string;
        };
    };
    reviewer?: {
        id: string;
        name: string;
    };
}

interface Stats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    total_amount: number;
}

interface Props {
    payments: {
        data: SubmissionPayment[];
        links: any[];
        meta: any;
    };
    stats: Stats;
    filters: {
        status?: string;
        search?: string;
    };
}

export default function Payments({ payments, stats, filters }: Props) {
    const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [reviewDialog, setReviewDialog] = useState<{
        open: boolean;
        payment?: SubmissionPayment;
        status?: 'approved' | 'rejected';
    }>({ open: false });
    const [reviewNotes, setReviewNotes] = useState('');

    const handleSearch = (search: string) => {
        router.get(route('admin.abstract-submissions.payments'), 
            { ...filters, search }, 
            { preserveState: true, replace: true }
        );
    };

    const handleStatusFilter = (status: string) => {
        router.get(route('admin.abstract-submissions.payments'), 
            { ...filters, status: status === 'all' ? undefined : status }, 
            { preserveState: true, replace: true }
        );
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedPayments(payments.data.map(p => p.id));
        } else {
            setSelectedPayments([]);
        }
    };

    const handleSelectPayment = (paymentId: string, checked: boolean) => {
        if (checked) {
            setSelectedPayments(prev => [...prev, paymentId]);
        } else {
            setSelectedPayments(prev => prev.filter(id => id !== paymentId));
        }
    };

    const handleBulkApprove = async () => {
        if (selectedPayments.length === 0) {
            return;
        }

        setIsProcessing(true);
        try {
            router.post(route('admin.abstract-submissions.bulk-approve-payments'), {
                payment_ids: selectedPayments
            });
            setSelectedPayments([]);
        } catch (error) {
            console.error('Gagal menyetujui payments:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReviewPayment = (payment: SubmissionPayment, status: 'approved' | 'rejected') => {
        setReviewDialog({ open: true, payment, status });
        setReviewNotes(payment.reviewer_notes || '');
    };

    const handleSubmitReview = async () => {
        if (!reviewDialog.payment || !reviewDialog.status) return;

        setIsProcessing(true);
        try {
            router.patch(route('admin.abstract-submissions.update-payment-status', reviewDialog.payment.submission.id), {
                status: reviewDialog.status,
                reviewer_notes: reviewNotes
            });
            setReviewDialog({ open: false });
            setReviewNotes('');
        } catch (error) {
            console.error('Gagal mengupdate payment status:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800'
        };
        
        return (
            <Badge className={variants[status as keyof typeof variants]}>
                {status === 'pending' ? 'Menunggu' : status === 'approved' ? 'Disetujui' : 'Ditolak'}
            </Badge>
        );
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'Abstract Submissions', href: route('admin.abstract-submissions.index') },
        { title: 'Payments', href: route('admin.abstract-submissions.payments') },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Payment Management" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href={route('admin.abstract-submissions.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Submissions
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Payment Management</h1>
                            <p className="text-muted-foreground">
                                Review dan kelola pembayaran abstract submissions
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-5">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Menunggu Review</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ditolak</CardTitle>
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-bold text-primary">
                                {formatCurrency(stats.total_amount)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Actions */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Input
                                    placeholder="Cari berdasarkan nama, email, atau judul abstract..."
                                    value={filters.search || ''}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="w-80"
                                />
                                <Select value={filters.status || 'all'} onValueChange={handleStatusFilter}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Status</SelectItem>
                                        <SelectItem value="pending">Menunggu</SelectItem>
                                        <SelectItem value="approved">Disetujui</SelectItem>
                                        <SelectItem value="rejected">Ditolak</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            {selectedPayments.length > 0 && (
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-muted-foreground">
                                        {selectedPayments.length} dipilih
                                    </span>
                                    <Button 
                                        onClick={handleBulkApprove}
                                        disabled={isProcessing}
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Setujui Semua
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={selectedPayments.length === payments.data.length && payments.data.length > 0}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead>Abstract & Submitter</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Upload Date</TableHead>
                                    <TableHead>Reviewer</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.data.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedPayments.includes(payment.id)}
                                                onCheckedChange={(checked) => 
                                                    handleSelectPayment(payment.id, checked as boolean)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{payment.submission.title}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {payment.submission.user.name} ({payment.submission.user.email})
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">
                                                {formatCurrency(payment.amount)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(payment.status)}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(payment.uploaded_at).toLocaleDateString('id-ID')}
                                        </TableCell>
                                        <TableCell>
                                            {payment.reviewer?.name || '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <a href={payment.payment_proof} target="_blank" rel="noopener noreferrer">
                                                        <Eye className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                                {payment.status === 'pending' && (
                                                    <>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm"
                                                            className="text-green-600 hover:text-green-700"
                                                            onClick={() => handleReviewPayment(payment, 'approved')}
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700"
                                                            onClick={() => handleReviewPayment(payment, 'rejected')}
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Review Dialog */}
            <Dialog open={reviewDialog.open} onOpenChange={(open) => setReviewDialog({ open })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {reviewDialog.status === 'approved' ? 'Setujui' : 'Tolak'} Pembayaran
                        </DialogTitle>
                        <DialogDescription>
                            {reviewDialog.payment && (
                                <>
                                    Abstract: <strong>{reviewDialog.payment.submission.title}</strong><br />
                                    Submitter: <strong>{reviewDialog.payment.submission.user.name}</strong><br />
                                    Amount: <strong>{formatCurrency(reviewDialog.payment.amount)}</strong>
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="review-notes">Catatan Review (Opsional)</Label>
                            <Textarea
                                id="review-notes"
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                placeholder="Berikan catatan untuk submitter..."
                                rows={3}
                            />
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                            <Button 
                                variant="outline" 
                                onClick={() => setReviewDialog({ open: false })}
                            >
                                Batal
                            </Button>
                            <Button 
                                onClick={handleSubmitReview}
                                disabled={isProcessing}
                                className={reviewDialog.status === 'approved' ? 'bg-green-600 hover:bg-green-700' : ''}
                                variant={reviewDialog.status === 'rejected' ? 'destructive' : 'default'}
                            >
                                {isProcessing ? 'Menyimpan...' : 
                                    reviewDialog.status === 'approved' ? 'Setujui Pembayaran' : 'Tolak Pembayaran'
                                }
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AppSidebarLayout>
    );
}
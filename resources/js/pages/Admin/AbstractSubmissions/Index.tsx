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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
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
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, FileText, Users, Clock, CheckCircle, XCircle, Plus, Search, Edit, Trash2, MapPin, Download, MoreHorizontal, ChevronLeft, ChevronRight, FileSpreadsheet } from 'lucide-react';
import { AbstractSubmission } from '@/types/abstract-submission';

interface Stats {
    total: number;
    pending: number;
    pending_abstract: number;
    pending_payment: number;
    approved: number;
    approved_abstract: number;
    approved_payment: number;
    rejected: number;
    rejected_abstract: number;
    rejected_payment: number;
}

interface Props {
    submissions: {
        data: AbstractSubmission[];
        links: any[];
        meta: any;
    };
    stats: Stats;
    filters: {
        status?: string;
        search?: string;
    };
}

export default function Index({ submissions, stats, filters }: Props) {
    const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // Function to truncate text
    const truncateText = (text: string, maxLength: number = 60) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'Abstract Submissions', href: route('admin.abstract-submissions.index') },
    ];

    const handleSearch = (search: string) => {
        router.get(route('admin.abstract-submissions.index'), 
            { ...filters, search }, 
            { preserveState: true, replace: true }
        );
    };

    const handleStatusFilter = (status: string) => {
        router.get(route('admin.abstract-submissions.index'), 
            { ...filters, status: status === 'all' ? undefined : status }, 
            { preserveState: true, replace: true }
        );
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedSubmissions(submissions.data.map(s => s.id));
        } else {
            setSelectedSubmissions([]);
        }
    };

    const handleSelectSubmission = (submissionId: string, checked: boolean) => {
        if (checked) {
            setSelectedSubmissions(prev => [...prev, submissionId]);
        } else {
            setSelectedSubmissions(prev => prev.filter(id => id !== submissionId));
        }
    };

    const handleBulkAction = async (action: 'approve' | 'reject' | 'download' | 'export-excel') => {
        if (selectedSubmissions.length === 0) {
            return;
        }

        if (action === 'export-excel') {
            setIsProcessing(true);
            try {
                // Create form for file download
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = route('admin.abstract-submissions.export-excel');
                form.style.display = 'none';
                
                // Add CSRF token - get fresh token from meta tag
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                if (!csrfToken) {
                    throw new Error('CSRF token tidak ditemukan. Silakan refresh halaman.');
                }
                
                const csrfInput = document.createElement('input');
                csrfInput.type = 'hidden';
                csrfInput.name = '_token';
                csrfInput.value = csrfToken;
                form.appendChild(csrfInput);
                
                // Add submission IDs
                selectedSubmissions.forEach(id => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = 'submission_ids[]';
                    input.value = id;
                    form.appendChild(input);
                });
                
                document.body.appendChild(form);
                form.submit();
                document.body.removeChild(form);
                
                // Clear selection after export
                setTimeout(() => {
                    setSelectedSubmissions([]);
                    setIsProcessing(false);
                }, 1000);
                
            } catch (error) {
                console.error('Gagal export Excel:', error);
                const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat export Excel. Silakan coba lagi.';
                alert(errorMessage);
                setIsProcessing(false);
            }
            return;
        }

        if (action === 'download') {
            setIsProcessing(true);
            try {
                for (const submissionId of selectedSubmissions) {
                    const submission = submissions.data.find(s => s.id === submissionId);
                    if (submission?.abstract_pdf) {
                        window.open(
                            route('admin.abstract-submissions.download-pdf', submissionId),
                            '_blank'
                        );
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                }
            } catch (error) {
                console.error('Gagal mendownload PDF:', error);
            } finally {
                setIsProcessing(false);
            }
            return;
        }        // For bulk approve, only allow submissions with pending status and payment
        if (action === 'approve') {
            const eligibleSubmissions = selectedSubmissions.filter(submissionId => {
                const submission = submissions.data.find(s => s.id === submissionId);
                return submission?.status === 'pending' && submission?.payment;
            });
            
            if (eligibleSubmissions.length === 0) {
                alert('Tidak ada submission yang memenuhi kriteria untuk bulk approve. Hanya submission dengan status pending dan memiliki payment yang dapat di-approve secara bulk.');
                return;
            }
            
            if (eligibleSubmissions.length !== selectedSubmissions.length) {
                const proceed = confirm(
                    `Hanya ${eligibleSubmissions.length} dari ${selectedSubmissions.length} submission yang memenuhi kriteria (status pending + ada payment).\n\n` +
                    `✅ Email invoice akan dikirim otomatis ke ${eligibleSubmissions.length} peserta\n` +
                    `📧 Email berisi detail pembayaran dan instruksi upload bukti bayar\n\n` +
                    `Lanjutkan approve untuk submission yang memenuhi kriteria?`
                );
                if (!proceed) return;
            }
            
            setSelectedSubmissions(eligibleSubmissions);
        }

        let notes = null;
        if (action === 'reject') {
            notes = prompt('Masukkan catatan penolakan (opsional):');
        }

        setIsProcessing(true);
        try {
            const routeName = action === 'approve' 
                ? 'admin.abstract-submissions.bulk-approve'
                : 'admin.abstract-submissions.bulk-reject';
            
            const submissionIds = action === 'approve' 
                ? selectedSubmissions.filter(submissionId => {
                    const submission = submissions.data.find(s => s.id === submissionId);
                    return submission?.status === 'pending' && submission?.payment;
                  })
                : selectedSubmissions;
            
            const data: any = { submission_ids: submissionIds };
            if (notes) {
                data.reviewer_notes = notes;
            }

            router.post(route(routeName), data);
            setSelectedSubmissions([]);
        } catch (error) {
            console.error(`Gagal ${action === 'approve' ? 'menyetujui' : 'menolak'} submissions:`, error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async (submissionId: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus submission ini?')) {
            router.delete(route('admin.abstract-submissions.destroy', submissionId));
        }
    };

    const handleIndividualAction = async (submissionId: string, action: 'approve' | 'reject' | 'approve-abstract' | 'approve-payment') => {
        const submission = submissions.data.find(s => s.id === submissionId);
        if (!submission) return;

        if (action === 'approve-abstract') {
            if (submission.status !== 'pending') {
                alert('Hanya submission dengan status pending yang dapat disetujui.');
                return;
            }
            
            const confirmed = confirm(
                `Setujui abstract "${submission.title}"?\n\n` +
                `✅ Abstract akan disetujui dan payment invoice akan dikirim\n` +
                `📧 Email berisi link payment invoice ke peserta`
            );
            if (!confirmed) return;
        }

        if (action === 'approve-payment') {
            if (submission.status !== 'approved' || !submission.payment || submission.payment.status !== 'pending') {
                alert('Hanya payment dengan status pending dari abstract yang sudah disetujui yang dapat disetujui.');
                return;
            }
            
            const confirmed = confirm(
                `Setujui pembayaran untuk "${submission.title}"?\n\n` +
                `✅ Payment akan disetujui dan Letter of Acceptance akan dikirim\n` +
                `📧 Email LoA akan dikirim ke peserta`
            );
            if (!confirmed) return;
        }

        if (action === 'approve') {
            if (submission.status !== 'pending') {
                alert('Hanya submission dengan status pending yang dapat disetujui.');
                return;
            }
            if (!submission.payment) {
                alert('Submission harus memiliki data payment untuk dapat disetujui.');
                return;
            }
            
            const confirmed = confirm(
                `Setujui submission "${submission.title}"?\n\n` +
                `✅ Email invoice akan dikirim otomatis ke peserta\n` +
                `📧 Email berisi detail pembayaran dan instruksi upload bukti bayar`
            );
            if (!confirmed) return;
        }

        let notes = null;
        if (action === 'reject') {
            notes = prompt('Masukkan catatan penolakan (opsional):');
        }

        setIsProcessing(true);
        try {
            let routeName: string;
            let data: any = { submission_ids: [submissionId] };
            
            if (action === 'approve-abstract') {
                // Untuk approve abstract, kita buat endpoint khusus atau gunakan yang ada dengan parameter
                routeName = 'admin.abstract-submissions.approve-abstract';
            } else if (action === 'approve-payment') {
                // Untuk approve payment, gunakan endpoint payment approval
                routeName = 'admin.abstract-submissions.approve-payment';
            } else {
                routeName = action === 'approve' 
                    ? 'admin.abstract-submissions.bulk-approve'
                    : 'admin.abstract-submissions.bulk-reject';
            }
            
            if (notes) {
                data.reviewer_notes = notes;
            }

            router.post(route(routeName), data);
        } catch (error) {
            console.error(`Gagal ${action.includes('approve') ? 'menyetujui' : 'menolak'} submission:`, error);
        } finally {
            setIsProcessing(false);
        }
    };

    const getStatusBadge = (submission: AbstractSubmission) => {
        const status = submission.status;
        const payment = submission.payment;
        
        // Untuk approved submissions
        if (status === 'approved') {
            if (payment) {
                if (payment.status === 'approved') {
                    return (
                        <div className="space-y-1">
                            <Badge className="bg-green-100 text-green-800 border-green-200 font-medium">
                                ✅ Abstract Approved
                            </Badge>
                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-medium">
                                💚 Payment Approved
                            </Badge>
                        </div>
                    );
                } else if (payment.status === 'pending') {
                    return (
                        <div className="space-y-1">
                            <Badge className="bg-green-100 text-green-800 border-green-200 font-medium">
                                ✅ Abstract Approved
                            </Badge>
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 font-medium">
                                💰 Payment Pending
                            </Badge>
                        </div>
                    );
                } else {
                    return (
                        <div className="space-y-1">
                            <Badge className="bg-green-100 text-green-800 border-green-200 font-medium">
                                ✅ Abstract Approved
                            </Badge>
                            <Badge className="bg-red-100 text-red-800 border-red-200 font-medium">
                                💸 Payment Rejected
                            </Badge>
                        </div>
                    );
                }
            } else {
                return (
                    <Badge className="bg-green-100 text-green-800 border-green-200 font-medium">
                        ✅ Abstract Approved
                    </Badge>
                );
            }
        }
        
        // Untuk pending submissions
        if (status === 'pending') {
            return (
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 font-medium">
                    🟡 Pending Abstract
                </Badge>
            );
        }
        
        // Untuk rejected submissions
        if (status === 'rejected') {
            return (
                <Badge className="bg-red-100 text-red-800 border-red-200 font-medium">
                    ❌ Abstract Rejected
                </Badge>
            );
        }
        
        // Default fallback
        return (
            <Badge className="bg-gray-100 text-gray-800 border-gray-200 font-medium">
                {status}
            </Badge>
        );
    };

    const getCountryName = (submission: AbstractSubmission) => {
        if (submission.country?.name) {
            return submission.country.name;
        }
        
        const primaryContact = submission.contributors?.find(c => c.is_primary_contact);
        if (primaryContact?.country?.name) {
            return primaryContact.country.name;
        }
        
        if (submission.user?.profile?.country?.name) {
            return submission.user.profile.country.name;
        }
        
        if (submission.contributors && submission.contributors.length > 0 && submission.contributors[0].country?.name) {
            return submission.contributors[0].country.name;
        }
        
        return 'N/A';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Abstract Submissions" />
            
            <div className="container py-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Abstract Submissions</h1>
                        <div className="text-gray-600 mt-1">Kelola dan review semua submission abstract</div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild>
                            <Link href={route('admin.abstract-submissions.create')}>
                                <Plus className="mr-2 h-4 w-4" /> Add New Submission
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-6">
                    <Card className="border-l-4 border-l-blue-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Total Submissions</CardTitle>
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FileText className="h-4 w-4 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                            <div className="text-xs text-gray-600 mt-1">Total semua submission</div>
                        </CardContent>
                    </Card>
                    
                    <Card className="border-l-4 border-l-yellow-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Pending Abstract</CardTitle>
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Clock className="h-4 w-4 text-yellow-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.pending_abstract || stats.pending}</div>
                            <div className="text-xs text-gray-600 mt-1">🟡 Menunggu review abstract</div>
                        </CardContent>
                    </Card>
                    
                    <Card className="border-l-4 border-l-orange-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Pending Payment</CardTitle>
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <Clock className="h-4 w-4 text-orange-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{stats.pending_payment || 0}</div>
                            <div className="text-xs text-gray-600 mt-1">💰 Menunggu payment</div>
                        </CardContent>
                    </Card>
                    
                    <Card className="border-l-4 border-l-green-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Approved Abstract</CardTitle>
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.approved_abstract || stats.approved}</div>
                            <div className="text-xs text-gray-600 mt-1">✅ Abstract disetujui</div>
                        </CardContent>
                    </Card>
                    
                    <Card className="border-l-4 border-l-emerald-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Approved Payment</CardTitle>
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <CheckCircle className="h-4 w-4 text-emerald-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-600">{stats.approved_payment || 0}</div>
                            <div className="text-xs text-gray-600 mt-1">💚 Payment disetujui</div>
                        </CardContent>
                    </Card>
                    
                    <Card className="border-l-4 border-l-red-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Rejected</CardTitle>
                            <div className="p-2 bg-red-100 rounded-lg">
                                <XCircle className="h-4 w-4 text-red-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                            <div className="text-xs text-gray-600 mt-1">❌ Ditolak</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-semibold">Submissions List</CardTitle>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Cari berdasarkan judul, author, atau email..."
                                    value={filters.search || ''}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-10 h-10"
                                />
                            </div>
                            <Select value={filters.status || 'all'} onValueChange={handleStatusFilter}>
                                <SelectTrigger className="w-[220px] h-10">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">🟡 Pending (All)</SelectItem>
                                    <SelectItem value="pending-abstract">🟡 Pending Abstract</SelectItem>
                                    <SelectItem value="pending-payment">💰 Pending Payment</SelectItem>
                                    <SelectItem value="approved">✅ Approved (All)</SelectItem>
                                    <SelectItem value="approved-abstract">✅ Approved Abstract</SelectItem>
                                    <SelectItem value="approved-payment">💚 Approved Payment</SelectItem>
                                    <SelectItem value="rejected">❌ Rejected (All)</SelectItem>
                                    <SelectItem value="rejected-abstract">❌ Rejected Abstract</SelectItem>
                                    <SelectItem value="rejected-payment">💸 Rejected Payment</SelectItem>
                                </SelectContent>
                            </Select>
                            {selectedSubmissions.length > 0 && (
                                <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg border">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 font-medium">
                                            {selectedSubmissions.length} terpilih
                                        </span>
                                        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                            📧 Email otomatis saat approve
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                         {(() => {
                                             const eligibleForApprove = selectedSubmissions.filter(submissionId => {
                                                 const submission = submissions.data.find(s => s.id === submissionId);
                                                 return submission?.status === 'pending' && submission?.payment;
                                             }).length;
                                             
                                             return eligibleForApprove > 0 && (
                                                 <Button 
                                                     onClick={() => {
                                                         const confirmed = confirm(
                                                             `Anda akan menyetujui ${eligibleForApprove} submission.\n\n` +
                                                             `✅ Email invoice akan dikirim otomatis ke setiap peserta\n` +
                                                             `📧 Email berisi detail pembayaran dan instruksi upload bukti bayar\n\n` +
                                                             `Lanjutkan proses bulk approve?`
                                                         );
                                                         if (confirmed) {
                                                             handleBulkAction('approve');
                                                         }
                                                     }}
                                                     disabled={isProcessing}
                                                     size="sm"
                                                     className="bg-green-600 hover:bg-green-700 h-8"
                                                     title={`${eligibleForApprove} submission memenuhi kriteria untuk bulk approve (status pending + ada payment)`}
                                                 >
                                                     <CheckCircle className="mr-1 h-3 w-3" />
                                                     Setujui ({eligibleForApprove})
                                                 </Button>
                                             );
                                         })()}
                                         <Button 
                                             onClick={() => handleBulkAction('reject')}
                                             disabled={isProcessing}
                                             size="sm"
                                             variant="destructive"
                                             className="h-8"
                                         >
                                             <XCircle className="mr-1 h-3 w-3" />
                                             Tolak
                                         </Button>
                                         <Button 
                                             onClick={() => handleBulkAction('download')}
                                             disabled={isProcessing}
                                             size="sm"
                                             variant="outline"
                                             className="h-8"
                                         >
                                             <Download className="mr-1 h-3 w-3" />
                                             Download PDF
                                         </Button>
                                         <Button 
                                             onClick={() => handleBulkAction('export-excel')}
                                             disabled={isProcessing}
                                             size="sm"
                                             variant="outline"
                                             className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                                         >
                                             <FileSpreadsheet className="mr-1 h-3 w-3" />
                                             Export Excel
                                         </Button>
                                     </div>
                                 </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50">
                                        <TableHead className="w-12">
                                            <Checkbox
                                                checked={selectedSubmissions.length === submissions.data.length && submissions.data.length > 0}
                                                onCheckedChange={handleSelectAll}
                                            />
                                        </TableHead>
                                        <TableHead className="min-w-[300px]">Title</TableHead>
                                        <TableHead className="min-w-[200px]">Author</TableHead>
                                        <TableHead className="min-w-[120px]">Country</TableHead>
                                        <TableHead className="min-w-[100px]">Status</TableHead>
                                        <TableHead className="min-w-[100px] text-center">Contributors</TableHead>
                                        <TableHead className="min-w-[100px]">Submitted</TableHead>
                                        <TableHead className="min-w-[120px] text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {submissions.data.length > 0 ? (
                                        submissions.data.map((submission) => (
                                            <TableRow key={submission.id} className="hover:bg-gray-50">
                                                <TableCell className="py-4">
                                                    <Checkbox
                                                        checked={selectedSubmissions.includes(submission.id)}
                                                        onCheckedChange={(checked) => 
                                                            handleSelectSubmission(submission.id, checked as boolean)
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="font-semibold text-gray-900 mb-1 leading-tight" title={submission.title}>
                                                        {truncateText(submission.title, 80)}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="space-y-1">
                                                        <div className="font-medium text-gray-900">
                                                            {submission.user?.name || 'N/A'}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {submission.user?.email || 'N/A'}
                                                        </div>
                                                        {submission.payment && (
                                                            <div className="flex items-center gap-1">
                                                                <div className={`w-2 h-2 rounded-full ${
                                                                    submission.payment.status === 'approved' ? 'bg-emerald-500' :
                                                                    submission.payment.status === 'pending' ? 'bg-yellow-500' :
                                                                    'bg-red-500'
                                                                }`} />
                                                                <span className={`text-xs font-medium ${
                                                                    submission.payment.status === 'approved' ? 'text-emerald-600' :
                                                                    submission.payment.status === 'pending' ? 'text-yellow-600' :
                                                                    'text-red-600'
                                                                }`}>
                                                                    {submission.payment.status === 'approved' ? '💚 Payment Approved' :
                                                                     submission.payment.status === 'pending' ? '💰 Payment Pending' :
                                                                     '💸 Payment Rejected'}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {getCountryName(submission)}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="space-y-1">
                                                        {getStatusBadge(submission)}
                                                        {submission.status === 'pending' && submission.payment && (
                                                            <div className="text-xs text-green-600 font-medium">
                                                                ✓ Eligible for bulk approve
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full">
                                                            <Users className="h-3 w-3 text-gray-600" />
                                                            <span className="text-sm font-medium text-gray-700">
                                                                {submission.contributors?.length || 0}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <span className="text-sm text-gray-600">
                                                        {formatDate(submission.submitted_at)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="py-4 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <DropdownMenuItem asChild>
                                                                <Link 
                                                                    href={route('admin.abstract-submissions.show', submission.id)}
                                                                    className="flex items-center w-full cursor-pointer"
                                                                >
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View Details
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link 
                                                                    href={route('admin.abstract-submissions.edit', submission.id)}
                                                                    className="flex items-center w-full cursor-pointer"
                                                                >
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            {submission.abstract_pdf && (
                                                                <DropdownMenuItem
                                                                    className="flex items-center cursor-pointer"
                                                                    onSelect={() => {
                                                                        window.open(
                                                                            route('admin.abstract-submissions.download-pdf', submission.id),
                                                                            '_blank'
                                                                        );
                                                                    }}
                                                                >
                                                                    <Download className="mr-2 h-4 w-4" />
                                                                    Download PDF
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuSeparator />
                                            {submission.status === 'pending' && !submission.payment && (
                                                <DropdownMenuItem
                                                    className="flex items-center cursor-pointer text-blue-600 focus:text-blue-600"
                                                    onSelect={() => handleIndividualAction(submission.id, 'approve-abstract')}
                                                    disabled={isProcessing}
                                                >
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    Approve Abstract
                                                </DropdownMenuItem>
                                            )}
                                            {submission.status === 'approved' && submission.payment && submission.payment.status === 'pending' && (
                                                <DropdownMenuItem
                                                    className="flex items-center cursor-pointer text-green-600 focus:text-green-600"
                                                    onSelect={() => handleIndividualAction(submission.id, 'approve-payment')}
                                                    disabled={isProcessing}
                                                >
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    Approve Payment
                                                </DropdownMenuItem>
                                            )}
                                            {submission.status === 'pending' && (
                                                <DropdownMenuItem
                                                    className="flex items-center cursor-pointer text-red-600 focus:text-red-600"
                                                    onSelect={() => handleIndividualAction(submission.id, 'reject')}
                                                    disabled={isProcessing}
                                                >
                                                    <XCircle className="mr-2 h-4 w-4" />
                                                    Reject
                                                </DropdownMenuItem>
                                            )}
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="flex items-center cursor-pointer text-red-600 focus:text-red-600"
                                                                onSelect={() => handleDelete(submission.id)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} className="py-12 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <FileText className="h-12 w-12 text-gray-300" />
                                                    <div className="text-gray-500 font-medium">Tidak ada submission ditemukan</div>
                                                    <div className="text-sm text-gray-400">Coba ubah filter pencarian Anda</div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {submissions.data.length > 0 && (
                    <Card>
                        <CardContent className="py-4">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Menampilkan <span className="font-medium">{submissions.meta?.from || 1}</span> sampai{' '}
                                    <span className="font-medium">{submissions.meta?.to || submissions.data.length}</span> dari{' '}
                                    <span className="font-medium">{submissions.meta?.total || submissions.data.length}</span> hasil
                                </div>
                                
                                {/* Pagination Controls */}
                                {submissions.links && submissions.links.length > 3 && (
                                    <div className="flex items-center space-x-2">
                                        {/* Previous Button */}
                                        {submissions.links[0].url ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => router.get(submissions.links[0].url, filters, { preserveState: true })}
                                                className="flex items-center gap-1"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                                Previous
                                            </Button>
                                        ) : (
                                            <Button variant="outline" size="sm" disabled className="flex items-center gap-1">
                                                <ChevronLeft className="h-4 w-4" />
                                                Previous
                                            </Button>
                                        )}
                                        
                                        {/* Page Numbers */}
                                        <div className="flex items-center space-x-1">
                                            {submissions.links.slice(1, -1).map((link, index) => {
                                                const isActive = link.active;
                                                const pageNumber = link.label;
                                                
                                                if (link.label.includes('...')) {
                                                    return (
                                                        <span key={index} className="px-2 py-1 text-gray-500">
                                                            ...
                                                        </span>
                                                    );
                                                }
                                                
                                                return (
                                                    <Button
                                                        key={index}
                                                        variant={isActive ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => {
                                                            if (link.url && !isActive) {
                                                                router.get(link.url, filters, { preserveState: true });
                                                            }
                                                        }}
                                                        className={`min-w-[40px] ${
                                                            isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                                                        }`}
                                                        disabled={!link.url || isActive}
                                                    >
                                                        {pageNumber}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                        
                                        {/* Next Button */}
                                        {submissions.links[submissions.links.length - 1].url ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => router.get(submissions.links[submissions.links.length - 1].url, filters, { preserveState: true })}
                                                className="flex items-center gap-1"
                                            >
                                                Next
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <Button variant="outline" size="sm" disabled className="flex items-center gap-1">
                                                Next
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppSidebarLayout>
    );
}
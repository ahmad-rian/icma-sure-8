import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ArrowLeft, Plus, Trash2, Upload, FileText, Download, RefreshCw, Calendar, User, FileCheck, Phone } from 'lucide-react';
import { AbstractSubmission, Country, User as UserType } from '@/types/abstract-submission';
import TinyMCEEditor from '@/components/ui/tinymce-editor';

interface Props {
    submission: AbstractSubmission;
    countries: Country[];
    users: UserType[];
}

interface SubmissionFormData {
    title: string;
    abstract: string;
    keywords: string;
    user_id: string;
    country_id: string;
    author_phone_number: string;
    pdf_file: File | null;
    contributors: {
        id?: string;
        first_name: string;
        last_name: string;
        email: string;
        phone_number: string;
        affiliation: string;
        country_id: string;
    }[];
    [key: string]: any;
}

export default function Edit({ submission, countries, users }: Props) {
    const breadcrumbs = [
        { label: 'Dashboard', href: route('admin.dashboard') },
        { label: 'Abstract Submissions', href: route('admin.abstract-submissions.index') },
        { label: submission.title, href: route('admin.abstract-submissions.show', submission.id) },
        { label: 'Edit', href: '#' }
    ];

    const { data, setData, patch, processing, errors } = useForm<SubmissionFormData>({
        title: submission.title,
        abstract: submission.abstract,
        keywords: submission.keywords.join(', '),
        user_id: submission.user?.id.toString() || '',
        country_id: submission.country?.id.toString() || '',
        author_phone_number: submission.author_phone_number || '',
        pdf_file: null,
        contributors: submission.contributors?.map(c => ({
            id: c.id?.toString() || '',
            first_name: c.first_name,
            last_name: c.last_name,
            email: c.email,
            phone_number: c.phone_number || '',
            affiliation: c.affiliation,
            country_id: c.country_id.toString()
        })) || []
    });

    const [contributors, setContributors] = useState<SubmissionFormData['contributors']>(
        submission.contributors?.map(c => ({
            id: c.id?.toString() || '',
            first_name: c.first_name,
            last_name: c.last_name,
            email: c.email,
            phone_number: c.phone_number || '',
            affiliation: c.affiliation,
            country_id: c.country_id.toString()
        })) || []
    );

    useEffect(() => {
        setData('contributors', contributors);
    }, [contributors]);

    const addContributor = () => {
        setContributors([...contributors, {
            first_name: '',
            last_name: '',
            email: '',
            phone_number: '',
            affiliation: '',
            country_id: ''
        }]);
    };

    const removeContributor = (index: number) => {
        const newContributors = contributors.filter((_, i) => i !== index);
        setContributors(newContributors);
    };

    const updateContributor = (index: number, field: 'first_name' | 'last_name' | 'email' | 'phone_number' | 'affiliation' | 'country_id', value: string) => {
        const newContributors = [...contributors];
        newContributors[index][field] = value;
        setContributors(newContributors);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('admin.abstract-submissions.update', submission.id));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('pdf_file', file);
    };

    return (
        <AppSidebarLayout>
            <Head title={`Edit: ${submission.title}`} />
            
            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* Breadcrumbs */}
                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbs.map((breadcrumb, index) => (
                            <React.Fragment key={index}>
                                <BreadcrumbItem>
                                    {index === breadcrumbs.length - 1 ? (
                                        <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink href={breadcrumb.href}>
                                            {breadcrumb.label}
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                            </React.Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Edit Abstract Submission</h1>
                        <p className="text-muted-foreground mt-2">
                            Update submission details and content
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
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
                        
                        <Link href={route('admin.abstract-submissions.show', submission.id)}>
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Details
                            </Button>
                        </Link>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="user_id" className="text-sm font-medium">Primary Author</Label>
                                    <Select value={data.user_id} onValueChange={(value) => setData('user_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select primary author" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users.map((user) => (
                                                <SelectItem key={user.id} value={user.id.toString()}>
                                                    {user.name} ({user.email})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.user_id && <p className="text-sm text-destructive">{errors.user_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="country_id" className="text-sm font-medium">Country</Label>
                                    <Select value={data.country_id} onValueChange={(value) => setData('country_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {countries.map((country) => (
                                                <SelectItem key={country.id} value={country.id.toString()}>
                                                    {country.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.country_id && <p className="text-sm text-destructive">{errors.country_id}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="author_phone_number" className="text-sm font-medium flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    Author WhatsApp Number
                                </Label>
                                <Input
                                    id="author_phone_number"
                                    type="tel"
                                    value={data.author_phone_number}
                                    onChange={(e) => setData('author_phone_number', e.target.value)}
                                    placeholder="Enter author WhatsApp number (e.g., +62812345678)"
                                    className="w-full"
                                />
                                {errors.author_phone_number && <p className="text-sm text-destructive">{errors.author_phone_number}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Enter abstract title"
                                    className="w-full"
                                />
                                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="keywords" className="text-sm font-medium">Keywords</Label>
                                <Input
                                    id="keywords"
                                    value={data.keywords}
                                    onChange={(e) => setData('keywords', e.target.value)}
                                    placeholder="Enter keywords (separated by commas)"
                                    className="w-full"
                                />
                                {errors.keywords && <p className="text-sm text-destructive">{errors.keywords}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Abstract Content */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Abstract Content</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="abstract" className="text-sm font-medium">Abstract</Label>
                                <TinyMCEEditor
                                    value={data.abstract}
                                    onChange={(content: string) => setData('abstract', content)}
                                    placeholder="Enter your abstract content here..."
                                />
                                {errors.abstract && <p className="text-sm text-destructive">{errors.abstract}</p>}
                            </div>
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
                                <div className="bg-muted/30 p-4 rounded-lg">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-muted-foreground">Amount</span>
                                                <span className="font-medium">Rp {submission.payment.amount?.toLocaleString('id-ID') || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-muted-foreground">Status</span>
                                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    submission.payment.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    submission.payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {submission.payment.status.toUpperCase()}
                                                </div>
                                            </div>
                                            {submission.payment.uploaded_at && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-muted-foreground">Uploaded At</span>
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <span>{new Date(submission.payment.uploaded_at).toLocaleDateString('id-ID', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="space-y-3">
                                             {submission.payment.payment_proof && (
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
                                             )}
                                         </div>
                                     </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Contributors */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Contributors</CardTitle>
                                <Button type="button" onClick={addContributor} size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Contributor
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {contributors.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>No contributors added yet.</p>
                                    <p className="text-sm">Click "Add Contributor" to add co-authors.</p>
                                </div>
                            ) : (
                                contributors.map((contributor, index) => (
                                    <Card key={index} className="border-muted">
                                        <CardHeader className="pb-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium text-sm">Contributor {index + 1}</h4>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeContributor(index)}
                                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">First Name</Label>
                                                    <Input
                                                        value={contributor.first_name}
                                                        onChange={(e) => updateContributor(index, 'first_name', e.target.value)}
                                                        placeholder="Enter first name"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">Last Name</Label>
                                                    <Input
                                                        value={contributor.last_name}
                                                        onChange={(e) => updateContributor(index, 'last_name', e.target.value)}
                                                        placeholder="Enter last name"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">Email</Label>
                                                    <Input
                                                        type="email"
                                                        value={contributor.email}
                                                        onChange={(e) => updateContributor(index, 'email', e.target.value)}
                                                        placeholder="Enter email address"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium flex items-center gap-2">
                                                        <Phone className="h-4 w-4" />
                                                        WhatsApp Number
                                                    </Label>
                                                    <Input
                                                        type="tel"
                                                        value={contributor.phone_number}
                                                        onChange={(e) => updateContributor(index, 'phone_number', e.target.value)}
                                                        placeholder="Enter WhatsApp number (e.g., +62812345678)"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">Affiliation</Label>
                                                    <Input
                                                        value={contributor.affiliation}
                                                        onChange={(e) => updateContributor(index, 'affiliation', e.target.value)}
                                                        placeholder="Enter affiliation"
                                                    />
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label className="text-sm font-medium">Country</Label>
                                                    <Select 
                                                        value={contributor.country_id} 
                                                        onValueChange={(value) => updateContributor(index, 'country_id', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select country" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {countries.map((country) => (
                                                                <SelectItem key={country.id} value={country.id.toString()}>
                                                                    {country.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Form Actions */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                        <Link href={route('admin.abstract-submissions.show', submission.id)}>
                            <Button type="button" variant="outline" className="min-w-[120px]">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 min-w-[140px]">
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppSidebarLayout>
    );
}
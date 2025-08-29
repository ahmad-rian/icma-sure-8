import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Trash2, FileText } from 'lucide-react';
import TinyMCEEditor from '@/components/ui/tinymce-editor';
import { Country, User } from '@/types/abstract-submission';

interface Props {
    countries: Country[];
    users: User[];
}

interface SubmissionFormData {
    title: string;
    abstract: string;
    keywords: string;
    user_id: string;
    country_id: string;
    contributors: {
        first_name: string;
        last_name: string;
        email: string;
        affiliation: string;
        country_id: string;
    }[];
    [key: string]: any;
}

export default function Create({ countries, users }: Props) {
    const { data, setData, post, processing, errors } = useForm<SubmissionFormData>({
        title: '',
        abstract: '',
        keywords: '',
        user_id: '',
        country_id: '',
        contributors: []
    });



    const breadcrumbs = [
        { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'Abstract Submissions', href: route('admin.abstract-submissions.index') },
        { title: 'Create New Submission', href: '#' },
    ];

    const addContributor = () => {
        const newContributors = [...data.contributors, {
            first_name: '',
            last_name: '',
            email: '',
            affiliation: '',
            country_id: ''
        }];
        setData('contributors', newContributors);
    };

    const removeContributor = (index: number) => {
        const newContributors = data.contributors.filter((_, i) => i !== index);
        setData('contributors', newContributors);
    };

    const updateContributor = (index: number, field: 'first_name' | 'last_name' | 'email' | 'affiliation' | 'country_id', value: string) => {
        const newContributors = [...data.contributors];
        newContributors[index][field] = value;
        setData('contributors', newContributors);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.abstract-submissions.store'));
    };



    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Abstract Submission" />
            
            <div className="container py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <Link href={route('admin.abstract-submissions.index')}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Tambah Abstract Submission</h1>
                            <p className="text-muted-foreground">
                                Buat abstract submission baru
                            </p>
                        </div>
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
                                    <Label htmlFor="user_id">Author *</Label>
                                    <Select value={data.user_id} onValueChange={(value) => setData('user_id', value)}>
                                        <SelectTrigger id="user_id">
                                            <SelectValue placeholder="Select author" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users.map((user) => (
                                                <SelectItem key={user.id} value={user.id.toString()}>
                                                    {user.name} ({user.email})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.user_id && <p className="text-sm text-red-600">{errors.user_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="country_id">Country *</Label>
                                    <Select value={data.country_id} onValueChange={(value) => setData('country_id', value)}>
                                        <SelectTrigger id="country_id">
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
                                    {errors.country_id && <p className="text-sm text-red-600">{errors.country_id}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Enter submission title"
                                    className="w-full"
                                />
                                {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="keywords">Keywords</Label>
                                <Input
                                    id="keywords"
                                    value={data.keywords}
                                    onChange={(e) => setData('keywords', e.target.value)}
                                    placeholder="Enter keywords (comma separated)"
                                    className="w-full"
                                />
                                {errors.keywords && <p className="text-sm text-red-600">{errors.keywords}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Abstract Content</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Abstract *</Label>
                                <TinyMCEEditor
                                value={data.abstract}
                                onChange={(value: string) => setData('abstract', value)}
                                placeholder="Enter your abstract content here..."
                            />
                                {errors.abstract && <p className="text-sm text-red-600">{errors.abstract}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>PDF Generation</Label>
                                <div className="border border-muted-foreground/25 rounded-lg p-4 bg-muted/30">
                                    <div className="flex items-center space-x-3">
                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">PDF will be automatically generated</p>
                                            <p className="text-xs text-muted-foreground">
                                                A PDF version of your abstract will be created automatically after submission
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contributors */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Contributors</CardTitle>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addContributor}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Contributor
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.contributors.map((contributor, index) => (
                                <div key={index} className="border rounded-lg p-4 space-y-4 bg-muted/30">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium text-sm">Contributor {index + 1}</h4>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeContributor(index)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`contributor-${index}-first-name`} className="text-sm">First Name</Label>
                                            <Input
                                                id={`contributor-${index}-first-name`}
                                                value={contributor.first_name}
                                                onChange={(e) => updateContributor(index, 'first_name', e.target.value)}
                                                placeholder="First name"
                                                className="h-9"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`contributor-${index}-last-name`} className="text-sm">Last Name</Label>
                                            <Input
                                                id={`contributor-${index}-last-name`}
                                                value={contributor.last_name}
                                                onChange={(e) => updateContributor(index, 'last_name', e.target.value)}
                                                placeholder="Last name"
                                                className="h-9"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`contributor-${index}-email`} className="text-sm">Email</Label>
                                            <Input
                                                id={`contributor-${index}-email`}
                                                type="email"
                                                value={contributor.email}
                                                onChange={(e) => updateContributor(index, 'email', e.target.value)}
                                                placeholder="Contributor email"
                                                className="h-9"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`contributor-${index}-affiliation`} className="text-sm">Affiliation</Label>
                                            <Input
                                                id={`contributor-${index}-affiliation`}
                                                value={contributor.affiliation}
                                                onChange={(e) => updateContributor(index, 'affiliation', e.target.value)}
                                                placeholder="Institution/Organization"
                                                className="h-9"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`contributor-${index}-country`} className="text-sm">Country</Label>
                                            <Select 
                                                value={contributor.country_id} 
                                                onValueChange={(value) => updateContributor(index, 'country_id', value)}
                                            >
                                                <SelectTrigger id={`contributor-${index}-country`} className="h-9">
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
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4 pt-6">
                        <Link href={route('admin.abstract-submissions.index')}>
                            <Button 
                                type="button" 
                                variant="outline"
                                className="min-w-[100px]"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Batal
                            </Button>
                        </Link>
                        <Button 
                            type="submit" 
                            disabled={processing}
                            className="min-w-[140px]"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppSidebarLayout>
    );
}
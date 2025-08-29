import React, { useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
    ArrowLeft, 
    Edit, 
    Trash2, 
    Globe, 
    Phone, 
    Calendar,
    Users,
    FileText,
    MapPin
} from 'lucide-react';
import { toast } from 'sonner';

interface Country {
    id: string;
    name: string;
    code: string;
    iso_code: string;
    phone_code: string;
    created_at: string;
    updated_at: string;
    // Relations count (if available)
    user_profiles_count?: number;
    abstract_submissions_count?: number;
    submission_contributors_count?: number;
}

interface Props {
    country: Country;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Show({ country, flash }: Props) {
    // Show flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleDelete = () => {
        router.delete(route('admin.countries.destroy', country.id));
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'Countries', href: route('admin.countries.index') },
        { title: country.name, href: route('admin.countries.show', country.id) },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`${country.name} - Country Details`} />

            <div className="container py-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold flex items-center space-x-3">
                            <Globe className="h-7 w-7 text-blue-600" />
                            <span>{country.name}</span>
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Country details and information
                        </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" asChild>
                            <Link href={route('admin.countries.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Countries
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={route('admin.countries.edit', country.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Country</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete "{country.name}"? This action cannot be undone and will affect all related records.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Globe className="h-5 w-5" />
                                    <span>Basic Information</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-muted-foreground">Country Name</label>
                                        <p className="text-lg font-semibold">{country.name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-muted-foreground">Country Code</label>
                                        <div className="flex items-center space-x-2">
                                            <Badge variant="outline" className="text-sm">
                                                {country.code}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-muted-foreground">ISO Code</label>
                                        <div className="flex items-center space-x-2">
                                            <Badge variant="secondary" className="text-sm">
                                                {country.iso_code}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-muted-foreground">Phone Code</label>
                                        <div className="flex items-center space-x-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-mono">+{country.phone_code}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Usage Statistics */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Users className="h-5 w-5" />
                                    <span>Usage Statistics</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-blue-600">
                                            {country.user_profiles_count || 0}
                                        </p>
                                        <p className="text-sm text-muted-foreground">User Profiles</p>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                                        <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-green-600">
                                            {country.abstract_submissions_count || 0}
                                        </p>
                                        <p className="text-sm text-muted-foreground">Abstract Submissions</p>
                                    </div>
                                    <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                                        <MapPin className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-purple-600">
                                            {country.submission_contributors_count || 0}
                                        </p>
                                        <p className="text-sm text-muted-foreground">Contributors</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Timestamps */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Calendar className="h-5 w-5" />
                                    <span>Record Information</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Created</label>
                                    <p className="text-sm mt-1">{new Date(country.created_at).toLocaleString()}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                                    <p className="text-sm mt-1">{new Date(country.updated_at).toLocaleString()}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <Link href={route('admin.countries.edit', country.id)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Country
                                    </Link>
                                </Button>
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <Link href={route('admin.countries.index')}>
                                        <Globe className="mr-2 h-4 w-4" />
                                        All Countries
                                    </Link>
                                </Button>
                                {/* Add more quick actions as needed */}
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <Link href={route('admin.user-profiles.index', { country: country.id })}>
                                        <Users className="mr-2 h-4 w-4" />
                                        View Users from {country.name}
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Display Format */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Display Format</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Full Display</label>
                                        <p className="font-mono text-sm bg-muted p-2 rounded mt-1">
                                            {country.name} ({country.code})
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Phone Format</label>
                                        <p className="font-mono text-sm bg-muted p-2 rounded mt-1">
                                            +{country.phone_code} XXX XXX XXXX
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, Edit, Trash2, User, Mail, Globe, Building, Phone } from 'lucide-react';
import type { UserProfile } from '@/types';

interface Props {
    userProfile: UserProfile;
}

export default function Show({ userProfile }: Props) {
    const handleDelete = () => {
        router.delete(route('admin.user-profiles.destroy', userProfile.id));
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'User Profiles', href: route('admin.user-profiles.index') },
        { title: `${userProfile.first_name} ${userProfile.last_name}`, href: '#' },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`${userProfile.first_name} ${userProfile.last_name}`} />
            
            <div className="container py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">User Profile Details</h1>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={route('admin.user-profiles.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={route('admin.user-profiles.edit', userProfile.id)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                            </Link>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the user profile
                                        for {userProfile.first_name} {userProfile.last_name}.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        Delete Profile
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">First Name</label>
                                    <p className="text-sm font-medium">{userProfile.first_name}</p>
                                </div>
                                
                                {userProfile.middle_name && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Middle Name</label>
                                        <p className="text-sm font-medium">{userProfile.middle_name}</p>
                                    </div>
                                )}
                                
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                                    <p className="text-sm font-medium">{userProfile.last_name}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm font-medium">
                                            {userProfile.user?.email || '-'}
                                        </p>
                                        {userProfile.user?.email_verified_at && (
                                            <Badge variant="secondary" className="text-xs">Verified</Badge>
                                        )}
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm font-medium">{userProfile.phone || '-'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Country</label>
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm font-medium">{userProfile.country?.name || '-'}</p>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Institution</label>
                                    <div className="flex items-center gap-2">
                                        <Building className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm font-medium">{userProfile.institution || '-'}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Department</label>
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm font-medium">{userProfile.department || '-'}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppSidebarLayout>
    );
}
import React, { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import type { UserProfile, User as UserType, Country } from '@/types';

interface Props {
    userProfile: UserProfile;
    users: UserType[];
    countries: Country[];
}

export default function Edit({ userProfile, users, countries }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        user_id: userProfile.user_id,
        first_name: userProfile.first_name,
        middle_name: userProfile.middle_name || '',
        last_name: userProfile.last_name,
        country_id: userProfile.country_id,
        institution: userProfile.institution || '',
        department: userProfile.department || '',
        phone: userProfile.phone || '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.user-profiles.update', userProfile.id));
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'User Profiles', href: route('admin.user-profiles.index') },
        { title: `${userProfile.first_name} ${userProfile.last_name}`, href: route('admin.user-profiles.show', userProfile.id) },
        { title: 'Edit', href: '#' },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${userProfile.first_name} ${userProfile.last_name}`} />
            
            <div className="container py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Edit User Profile</h1>
                    <Button variant="outline" asChild>
                        <Link href={route('admin.user-profiles.index')}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
                        </Link>
                    </Button>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="user_id">
                                        User <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={data.user_id}
                                        onValueChange={(value) => setData('user_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a user" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users.map((user) => (
                                                <SelectItem key={user.id} value={user.id}>
                                                    {user.email}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.user_id && (
                                        <p className="text-red-500 text-sm">{errors.user_id}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="first_name">
                                            First Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="first_name"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            required
                                        />
                                        {errors.first_name && (
                                            <p className="text-red-500 text-sm">{errors.first_name}</p>
                                        )}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="middle_name">Middle Name</Label>
                                        <Input
                                            id="middle_name"
                                            value={data.middle_name}
                                            onChange={(e) => setData('middle_name', e.target.value)}
                                        />
                                        {errors.middle_name && (
                                            <p className="text-red-500 text-sm">{errors.middle_name}</p>
                                        )}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="last_name">
                                            Last Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="last_name"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            required
                                        />
                                        {errors.last_name && (
                                            <p className="text-red-500 text-sm">{errors.last_name}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="country_id">
                                        Country <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={data.country_id}
                                        onValueChange={(value) => setData('country_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {countries.map((country) => (
                                                <SelectItem key={country.id} value={country.id}>
                                                    {country.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.country_id && (
                                        <p className="text-red-500 text-sm">{errors.country_id}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="institution">Institution</Label>
                                        <Input
                                            id="institution"
                                            value={data.institution}
                                            onChange={(e) => setData('institution', e.target.value)}
                                        />
                                        {errors.institution && (
                                            <p className="text-red-500 text-sm">{errors.institution}</p>
                                        )}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="department">Department</Label>
                                        <Input
                                            id="department"
                                            value={data.department}
                                            onChange={(e) => setData('department', e.target.value)}
                                        />
                                        {errors.department && (
                                            <p className="text-red-500 text-sm">{errors.department}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-sm">{errors.phone}</p>
                                    )}
                                </div>
                            </div>
                            
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Update User Profile'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppSidebarLayout>
    );
}
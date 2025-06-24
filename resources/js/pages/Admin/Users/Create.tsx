import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, User, Mail, Lock, Shield, Crown } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        is_allowed: false,
        role: 'user',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('users.store'));
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'User Management', href: route('users.index') },
        { title: 'Create User', href: route('users.create') },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />

            <div className="container py-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={route('users.index')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Users
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">Create New User</h1>
                        <p className="text-muted-foreground">
                            Add a new user to the system
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>User Information</CardTitle>
                        <CardDescription>
                            Fill in the details for the new user account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Field */}
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    <User className="inline mr-2 h-4 w-4" />
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Enter full name"
                                    className={errors.name ? 'border-destructive' : ''}
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email">
                                    <Mail className="inline mr-2 h-4 w-4" />
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Enter email address"
                                    className={errors.email ? 'border-destructive' : ''}
                                />
                                {errors.email && (
                                    <p className="text-sm text-destructive">{errors.email}</p>
                                )}
                            </div>

                            {/* Role Field */}
                            <div className="space-y-2">
                                <Label htmlFor="role">
                                    <Crown className="inline mr-2 h-4 w-4" />
                                    User Role
                                </Label>
                                <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                    <SelectTrigger className={errors.role ? 'border-destructive' : ''}>
                                        <SelectValue placeholder="Select user role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.role && (
                                    <p className="text-sm text-destructive">{errors.role}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    <Lock className="inline mr-2 h-4 w-4" />
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Enter password"
                                    className={errors.password ? 'border-destructive' : ''}
                                />
                                {errors.password && (
                                    <p className="text-sm text-destructive">{errors.password}</p>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">
                                    <Lock className="inline mr-2 h-4 w-4" />
                                    Confirm Password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Confirm password"
                                    className={errors.password_confirmation ? 'border-destructive' : ''}
                                />
                                {errors.password_confirmation && (
                                    <p className="text-sm text-destructive">{errors.password_confirmation}</p>
                                )}
                            </div>

                            {/* Access Permission */}
                            <div className="flex items-center space-x-4 p-4 border rounded-lg">
                                <Shield className="h-5 w-5 text-muted-foreground" />
                                <div className="flex-1">
                                    <Label htmlFor="is_allowed" className="text-base font-medium">
                                        Allow System Access
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Grant this user access to the system dashboard and features
                                    </p>
                                </div>
                                <Switch
                                    id="is_allowed"
                                    checked={data.is_allowed}
                                    onCheckedChange={(checked) => setData('is_allowed', checked)}
                                />
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex items-center gap-4 pt-4">
                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'Creating...' : 'Create User'}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href={route('users.index')}>
                                        Cancel
                                    </Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppSidebarLayout>
    );
}
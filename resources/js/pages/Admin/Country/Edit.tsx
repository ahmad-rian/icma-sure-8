import React, { FormEventHandler, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Edit as EditIcon, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface Country {
    id: string;
    name: string;
    code: string;
    iso_code: string;
    phone_code: string;
    created_at: string;
    updated_at: string;
}

interface FormData {
    name: string;
    code: string;
    iso_code: string;
    phone_code: string;
    [key: string]: any;
}

interface Props {
    country: Country;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Edit({ country, flash }: Props) {
    const { data, setData, patch, processing, errors } = useForm<FormData>({
        name: country.name,
        code: country.code,
        iso_code: country.iso_code,
        phone_code: country.phone_code,
    });

    // Show flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('admin.countries.update', country.id));
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'Countries', href: route('admin.countries.index') },
        { title: country.name, href: route('admin.countries.show', country.id) },
        { title: 'Edit', href: route('admin.countries.edit', country.id) },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${country.name}`} />

            <div className="container py-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold">Edit Country</h1>
                        <p className="text-sm text-muted-foreground">
                            Update information for {country.name}
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={route('admin.countries.show', country.id)}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Details
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <EditIcon className="h-5 w-5" />
                                    <span>Country Information</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Country Name */}
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Country Name *</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="e.g., Indonesia"
                                                className={errors.name ? 'border-red-500' : ''}
                                                required
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-600">{errors.name}</p>
                                            )}
                                        </div>

                                        {/* Country Code */}
                                        <div className="space-y-2">
                                            <Label htmlFor="code">Country Code *</Label>
                                            <Input
                                                id="code"
                                                type="text"
                                                value={data.code}
                                                onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                                placeholder="e.g., ID"
                                                maxLength={3}
                                                className={errors.code ? 'border-red-500' : ''}
                                                required
                                            />
                                            {errors.code && (
                                                <p className="text-sm text-red-600">{errors.code}</p>
                                            )}
                                            <p className="text-xs text-muted-foreground">
                                                2-3 character country code
                                            </p>
                                        </div>

                                        {/* ISO Code */}
                                        <div className="space-y-2">
                                            <Label htmlFor="iso_code">ISO Code *</Label>
                                            <Input
                                                id="iso_code"
                                                type="text"
                                                value={data.iso_code}
                                                onChange={(e) => setData('iso_code', e.target.value.toUpperCase())}
                                                placeholder="e.g., IDN"
                                                maxLength={3}
                                                className={errors.iso_code ? 'border-red-500' : ''}
                                                required
                                            />
                                            {errors.iso_code && (
                                                <p className="text-sm text-red-600">{errors.iso_code}</p>
                                            )}
                                            <p className="text-xs text-muted-foreground">
                                                3-character ISO 3166-1 alpha-3 code
                                            </p>
                                        </div>

                                        {/* Phone Code */}
                                        <div className="space-y-2">
                                            <Label htmlFor="phone_code">Phone Code *</Label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">+</span>
                                                <Input
                                                    id="phone_code"
                                                    type="text"
                                                    value={data.phone_code}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/\D/g, '');
                                                        setData('phone_code', value);
                                                    }}
                                                    placeholder="e.g., 62"
                                                    className={`pl-8 ${errors.phone_code ? 'border-red-500' : ''}`}
                                                    required
                                                />
                                            </div>
                                            {errors.phone_code && (
                                                <p className="text-sm text-red-600">{errors.phone_code}</p>
                                            )}
                                            <p className="text-xs text-muted-foreground">
                                                International dialing code (numbers only)
                                            </p>
                                        </div>
                                    </div>

                                    {/* Form Actions */}
                                    <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                                        <Button type="button" variant="outline" asChild>
                                            <Link href={route('admin.countries.show', country.id)}>
                                                Cancel
                                            </Link>
                                        </Button>
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Updating...' : 'Update Country'}
                                        </Button>
                                    </div>
                                </form>
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
                                    <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                                    <p className="text-sm mt-1">{new Date(country.created_at).toLocaleString()}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                                    <p className="text-sm mt-1">{new Date(country.updated_at).toLocaleString()}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Guidelines */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="space-y-2">
                                    <h3 className="font-medium text-sm">Guidelines:</h3>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Country name should be the official name in English</li>
                                        <li>• Country code is typically 2-3 characters (e.g., US, UK, ID)</li>
                                        <li>• ISO code follows ISO 3166-1 alpha-3 standard (e.g., USA, GBR, IDN)</li>
                                        <li>• Phone code is the international dialing prefix without the + sign</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Live Preview */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Live Preview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Full Display</label>
                                        <p className="font-mono text-sm bg-muted p-2 rounded mt-1">
                                            {data.name || 'Country Name'} ({data.code || 'CODE'})
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Phone Format</label>
                                        <p className="font-mono text-sm bg-muted p-2 rounded mt-1">
                                            +{data.phone_code || '0'} XXX XXX XXXX
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">ISO Code</label>
                                        <p className="font-mono text-sm bg-muted p-2 rounded mt-1">
                                            {data.iso_code || 'ISO'}
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
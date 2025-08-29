import React, { FormEventHandler, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface FormData {
    name: string;
    code: string;
    iso_code: string;
    phone_code: string;
    [key: string]: any;
}

interface Props {
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Create({ flash }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        name: '',
        code: '',
        iso_code: '',
        phone_code: '',
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
        post(route('admin.countries.store'), {
            onSuccess: () => reset(),
        });
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'Countries', href: route('admin.countries.index') },
        { title: 'Create Country', href: route('admin.countries.create') },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Country" />

            <div className="container py-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold">Create Country</h1>
                        <p className="text-sm text-muted-foreground">Add a new country to the system</p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={route('admin.countries.index')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Countries
                        </Link>
                    </Button>
                </div>

                <div className="max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Plus className="h-5 w-5" />
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
                                        <Link href={route('admin.countries.index')}>
                                            Cancel
                                        </Link>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Creating...' : 'Create Country'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Help Card */}
                    <Card className="mt-6">
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
                </div>
            </div>
        </AppSidebarLayout>
    );
}
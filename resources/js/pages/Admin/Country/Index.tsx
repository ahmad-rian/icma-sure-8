import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
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
    Plus, 
    Search, 
    Eye, 
    Edit, 
    Trash2, 
    Globe
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
}

interface PaginatedCountries {
    data: Country[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    countries: PaginatedCountries;
    search?: string;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Index({ countries, search = '', flash }: Props) {
    const [searchTerm, setSearchTerm] = useState(search);
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

    // Show flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Handle search with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm !== search) {
                router.get(route('admin.countries.index'), { search: searchTerm }, {
                    preserveState: true,
                    replace: true,
                });
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, search]);

    const handleDelete = (id: string) => {
        router.delete(route('admin.countries.destroy', id));
    };

    const handleBulkDelete = () => {
        if (selectedCountries.length === 0) return;
        
        router.post(route('admin.countries.bulk-delete'), {
            ids: selectedCountries
        }, {
            onSuccess: () => {
                setSelectedCountries([]);
            }
        });
    };

    const handleSelectCountry = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedCountries([...selectedCountries, id]);
        } else {
            setSelectedCountries(selectedCountries.filter(countryId => countryId !== id));
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedCountries(countries.data.map(country => country.id));
        } else {
            setSelectedCountries([]);
        }
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'Countries', href: route('admin.countries.index') },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Countries" />

            <div className="container py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Countries</h1>
                    <Button asChild>
                        <Link href={route('admin.countries.create')}>
                            <Plus className="mr-2 h-4 w-4" /> Add New Country
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Countries Management</CardTitle>
                        <div className="flex items-center justify-between space-x-2">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search countries..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                            {selectedCountries.length > 0 && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete Selected ({selectedCountries.length})
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Countries</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete {selectedCountries.length} selected countries? This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700">
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">
                                        <Checkbox
                                            checked={selectedCountries.length === countries.data.length && countries.data.length > 0}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead>Country</TableHead>
                                    <TableHead>Code</TableHead>
                                    <TableHead>ISO Code</TableHead>
                                    <TableHead>Phone Code</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {countries.data.length > 0 ? (
                                    countries.data.map((country) => (
                                        <TableRow key={country.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedCountries.includes(country.id)}
                                                    onCheckedChange={(checked) => handleSelectCountry(country.id, checked as boolean)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <Globe className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{country.name}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{country.code}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{country.iso_code}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm text-gray-600">+{country.phone_code}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(country.created_at).toLocaleDateString()}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={route('admin.countries.show', country.id)}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={route('admin.countries.edit', country.id)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="destructive" size="sm">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete Country</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure you want to delete "{country.name}"? This action cannot be undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDelete(country.id)} className="bg-red-600 hover:bg-red-700">
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            {searchTerm ? (
                                                <div className="text-center">
                                                    <p className="text-gray-500">No countries found matching "{searchTerm}"</p>
                                                    <Button 
                                                        variant="link" 
                                                        onClick={() => setSearchTerm('')}
                                                        className="mt-2"
                                                    >
                                                        Clear search
                                                    </Button>
                                                </div>
                                            ) : (
                                                'No countries found. Add a new country to get started.'
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {countries.links && countries.links.length > 3 && (
                            <div className="flex items-center justify-between px-2 py-4">
                                <div className="text-sm text-gray-500">
                                    Showing {countries.from || 0} to {countries.to || 0} of {countries.total} results
                                </div>
                                <div className="flex space-x-1">
                                    {countries.links.map((link, index) => {
                                        if (link.url === null) {
                                            return (
                                                <Button key={index} variant="ghost" size="sm" disabled>
                                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                </Button>
                                            );
                                        }

                                        return (
                                            <Button
                                                key={index}
                                                variant={link.active ? "default" : "ghost"}
                                                size="sm"
                                                asChild
                                            >
                                                <Link href={link.url} preserveState>
                                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                </Link>
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppSidebarLayout>
    );
}
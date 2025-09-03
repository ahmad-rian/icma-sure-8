import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
    MoreHorizontal, 
    Eye, 
    Edit, 
    Trash2, 
    Users, 
    UserCheck, 
    UserX, 
    Shield,
    Filter,
    Crown,
    AlertCircle,
    AlertTriangle
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    is_allowed: boolean;
    role: 'admin' | 'user';
    google_id: string | null;
    avatar: string | null;
    created_at: string;
    updated_at: string;
}

interface Stats {
    total: number;
    allowed: number;
    blocked: number;
    verified: number;
    admins: number;
}

interface Props {
    users: {
        data: User[];
        links: any[];
        meta: any;
    };
    filters: {
        search?: string;
        status?: string;
        role?: string;
    };
    stats: Stats;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Index({ users, filters, stats, flash = {} }: Props) {
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [roleFilter, setRoleFilter] = useState(filters.role || 'all');
    const [isLoading, setIsLoading] = useState(false);
    
    // Helper function to clean empty parameters
    const getCleanParams = (additionalParams: Record<string, any> = {}) => {
        const params: Record<string, any> = { ...additionalParams };
        
        if (searchTerm && searchTerm.trim()) {
            params.search = searchTerm;
        }
        if (statusFilter && statusFilter !== 'all') {
            params.status = statusFilter;
        }
        if (roleFilter && roleFilter !== 'all') {
            params.role = roleFilter;
        }
        
        return params;
    };
    
    // State for delete dialogs
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [bulkAction, setBulkAction] = useState<'allow' | 'block' | 'delete' | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        router.get(route('admin.users.index'), getCleanParams({ page: 1 }), { 
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false)
        });
    };

    const handleFilterChange = (type: string, value: string) => {
        if (type === 'status') {
            setStatusFilter(value);
        } else if (type === 'role') {
            setRoleFilter(value);
        }
        
        setIsLoading(true);
        
        // Create temporary values for clean params calculation
        const tempSearchTerm = searchTerm;
        const tempStatusFilter = type === 'status' ? value : statusFilter;
        const tempRoleFilter = type === 'role' ? value : roleFilter;
        
        const params: Record<string, any> = { page: 1 };
        
        if (tempSearchTerm && tempSearchTerm.trim()) {
            params.search = tempSearchTerm;
        }
        if (tempStatusFilter && tempStatusFilter !== 'all') {
            params.status = tempStatusFilter;
        }
        if (tempRoleFilter && tempRoleFilter !== 'all') {
            params.role = tempRoleFilter;
        }
        
        router.get(route('admin.users.index'), params, { 
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false)
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setRoleFilter('all');
        setIsLoading(true);
        router.get(route('admin.users.index'), getCleanParams(), {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false)
        });
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedUsers(users?.data?.map(user => user.id.toString()) || []);
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (userId: string, checked: boolean) => {
        if (checked) {
            setSelectedUsers([...selectedUsers, userId]);
        } else {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        }
    };

    const handleBulkAction = (action: 'allow' | 'block' | 'delete') => {
        if (selectedUsers.length === 0) {
            alert("Please select at least one user to perform bulk actions.");
            return;
        }

        setBulkAction(action);
        
        if (action === 'delete') {
            setBulkDeleteDialogOpen(true);
        } else {
            // For allow/block actions, show native confirm for now
            const confirmMessage = {
                allow: `Allow access for ${selectedUsers.length} user(s)?`,
                block: `Block access for ${selectedUsers.length} user(s)?`,
            };

            if (confirm(confirmMessage[action])) {
                router.post(route('admin.users.bulk-action'), {
                    action,
                    user_ids: selectedUsers
                }, {
                    onSuccess: () => {
                        setSelectedUsers([]);
                    }
                });
            }
        }
    };

    const confirmBulkDelete = () => {
        router.post(route('admin.users.bulk-action'), {
            action: 'delete',
            user_ids: selectedUsers
        }, {
            onSuccess: () => {
                setSelectedUsers([]);
                setBulkDeleteDialogOpen(false);
                setBulkAction(null);
            }
        });
    };

    const toggleUserAccess = (user: User) => {
        const action = user.is_allowed ? 'block' : 'allow';
        if (confirm(`${action === 'allow' ? 'Allow' : 'Block'} access for ${user.name}?`)) {
            router.post(route('admin.users.toggle-access', user.id));
        }
    };

    const openDeleteDialog = (user: User) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            router.delete(route('admin.users.destroy', userToDelete.id), {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setUserToDelete(null);
                }
            });
        }
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'User Management', href: route('admin.users.index') },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />

            <div className="container py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold">User Management</h1>
                        <p className="text-muted-foreground">
                            Manage users, permissions, and access control
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.users.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add User
                        </Link>
                    </Button>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}

                {flash?.error && (
                    <Alert className="mb-6 bg-red-50 text-red-800 border-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{flash.error}</AlertDescription>
                    </Alert>
                )}

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-5 mb-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Admins</CardTitle>
                            <Crown className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">{stats.admins}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Allowed</CardTitle>
                            <UserCheck className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.allowed}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Blocked</CardTitle>
                            <UserX className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.blocked}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Verified</CardTitle>
                            <Shield className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.verified}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Search */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        placeholder="Search users by name or email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Select value={statusFilter} onValueChange={(value) => handleFilterChange('status', value)}>
                                <SelectTrigger className="w-48">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="allowed">Allowed Only</SelectItem>
                                    <SelectItem value="blocked">Blocked Only</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={roleFilter} onValueChange={(value) => handleFilterChange('role', value)}>
                                <SelectTrigger className="w-48">
                                    <Crown className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Filter by role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="admin">Admin Only</SelectItem>
                                    <SelectItem value="user">User Only</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Searching...' : 'Search'}
                            </Button>
                            {(searchTerm || statusFilter !== 'all' || roleFilter !== 'all') && (
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={clearFilters}
                                    disabled={isLoading}
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </form>
                    </CardContent>
                </Card>

                {/* Bulk Actions */}
                {selectedUsers.length > 0 && (
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600">
                                    {selectedUsers.length} user(s) selected
                                </span>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleBulkAction('allow')}
                                    >
                                        <UserCheck className="mr-2 h-4 w-4" />
                                        Allow Access
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleBulkAction('block')}
                                    >
                                        <UserX className="mr-2 h-4 w-4" />
                                        Block Access
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleBulkAction('delete')}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Users</CardTitle>
                        <CardDescription>
                            Manage user accounts and permissions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">
                                        <Checkbox
                                            checked={selectedUsers.length === (users?.data?.length || 0) && (users?.data?.length || 0) > 0}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead className="w-[100px]">Avatar</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Verified</TableHead>
                                    <TableHead>Login Method</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users?.data?.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedUsers.includes(user.id.toString())}
                                                onCheckedChange={(checked) => handleSelectUser(user.id.toString(), checked as boolean)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {user.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    alt={user.name}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-500 text-sm font-medium">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={user.role === 'admin' ? "default" : "secondary"}>
                                                {user.role === 'admin' && <Crown className="mr-1 h-3 w-3" />}
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={user.is_allowed ? "default" : "destructive"}
                                                className="cursor-pointer"
                                                onClick={() => toggleUserAccess(user)}
                                            >
                                                {user.is_allowed ? "Allowed" : "Blocked"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.email_verified_at ? "secondary" : "outline"}>
                                                {user.email_verified_at ? "Verified" : "Unverified"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {user.google_id ? "Google" : "Email"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end space-x-2">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={route('admin.users.show', user.id)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={route('admin.users.edit', user.id)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button 
                                                    variant="destructive" 
                                                    size="sm" 
                                                    onClick={() => openDeleteDialog(user)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                
                                {(!users?.data || users.data.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={10} className="h-24 text-center">
                                            No users found matching your criteria.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {users?.links && users.links.length > 3 && (
                    <Card className="mt-6">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                {/* Results Info */}
                                <div className="text-sm text-gray-600">
                                    Showing {users?.meta?.from || 1} to {users?.meta?.to || users?.data?.length || 0} of {users?.meta?.total || users?.data?.length || 0} results
                                </div>

                                {/* Pagination Controls */}
                                <div className="flex items-center space-x-2">
                                    {/* Previous Button */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={!users?.links?.find(link => link.label === '&laquo; Previous')?.url || isLoading}
                                        onClick={() => {
                                            const prevLink = users?.links?.find(link => link.label === '&laquo; Previous');
                                            if (prevLink?.url) {
                                                setIsLoading(true);
                                                // Extract page number from URL
                                                const url = new URL(prevLink.url);
                                                const page = url.searchParams.get('page') || '1';
                                                
                                                router.get(route('admin.users.index'), getCleanParams({ page }), { 
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                    onFinish: () => setIsLoading(false)
                                                });
                                            }
                                        }}
                                    >
                                        {isLoading ? 'Loading...' : 'Previous'}
                                    </Button>

                                    {/* Page Numbers */}
                                    {users?.links
                                        ?.filter(link => link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;')
                                        ?.map((link, index) => {
                                            if (link.label === '...') {
                                                return (
                                                    <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                                                        ...
                                                    </span>
                                                );
                                            }

                                            return (
                                                <Button
                                                    key={index}
                                                    variant={link.active ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => {
                                                        if (link.url && !link.active) {
                                                            setIsLoading(true);
                                                            // Extract page number from URL
                                                            const url = new URL(link.url);
                                                            const page = url.searchParams.get('page') || '1';
                                                            
                                                            router.get(route('admin.users.index'), getCleanParams({ page }), { 
                                                                preserveState: true,
                                                                preserveScroll: true,
                                                                onFinish: () => setIsLoading(false)
                                                            });
                                                        }
                                                    }}
                                                    disabled={!link.url || link.active || isLoading}
                                                >
                                                    {link.label}
                                                </Button>
                                            );
                                        })
                                    }

                                    {/* Next Button */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={!users?.links?.find(link => link.label === 'Next &raquo;')?.url || isLoading}
                                        onClick={() => {
                                            const nextLink = users?.links?.find(link => link.label === 'Next &raquo;');
                                            if (nextLink?.url) {
                                                setIsLoading(true);
                                                // Extract page number from URL
                                                const url = new URL(nextLink.url);
                                                const page = url.searchParams.get('page') || '1';
                                                
                                                router.get(route('admin.users.index'), getCleanParams({ page }), { 
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                    onFinish: () => setIsLoading(false)
                                                });
                                            }
                                        }}
                                    >
                                        {isLoading ? 'Loading...' : 'Next'}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Single User Delete Dialog */}
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                Delete User
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete <strong>{userToDelete?.name}</strong>? 
                                This action cannot be undone and will permanently remove the user account 
                                and all associated data.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDelete}
                                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Bulk Delete Dialog */}
                <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                Delete Multiple Users
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete <strong>{selectedUsers.length} user(s)</strong>? 
                                This action cannot be undone and will permanently remove all selected user accounts 
                                and their associated data.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setBulkAction(null)}>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmBulkDelete}
                                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete {selectedUsers.length} User(s)
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppSidebarLayout>
    );
}
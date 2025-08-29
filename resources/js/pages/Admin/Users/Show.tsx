import { Head, Link, router } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
    ArrowLeft, 
    Edit, 
    Trash2, 
    Mail, 
    Calendar, 
    Shield, 
    Crown,
    Eye,
    EyeOff,
    UserCheck,
    UserX,
    Globe,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle
} from 'lucide-react';

interface User {
    id: string; // ULID
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

interface LoginHistory {
    ip_address: string;
    user_agent: string;
    login_at: string;
}

interface Props {
    user: User;
    loginHistory: LoginHistory[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Show({ user, loginHistory = [], flash = {} }: Props) {
    const toggleUserAccess = () => {
        const action = user.is_allowed ? 'block' : 'allow';
        if (confirm(`${action === 'allow' ? 'Allow' : 'Block'} access for ${user.name}?`)) {
            router.post(route('admin.users.toggle-access', user.id));
        }
    };

    const deleteUser = () => {
        if (confirm(`Delete user ${user.name}? This action cannot be undone.`)) {
            router.delete(route('admin.users.destroy', user.id));
        }
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'User Management', href: route('admin.users.index') },
        { title: user.name, href: route('admin.users.show', user.id) },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`User Details - ${user.name}`} />

            <div className="container py-6">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={route('admin.users.index')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Users
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">User Details</h1>
                        <p className="text-muted-foreground">
                            View and manage user information
                        </p>
                    </div>
                </div>

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

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>
                                    Basic user account details
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="h-16 w-16 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-500 text-xl font-medium">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-lg font-semibold">{user.name}</h3>
                                        <p className="text-muted-foreground flex items-center">
                                            <Mail className="mr-2 h-4 w-4" />
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Role</label>
                                        <div className="mt-1">
                                            <Badge variant={user.role === 'admin' ? "default" : "secondary"} className="text-sm">
                                                {user.role === 'admin' && <Crown className="mr-1 h-3 w-3" />}
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Access Status</label>
                                        <div className="mt-1">
                                            <Badge variant={user.is_allowed ? "default" : "destructive"} className="text-sm">
                                                {user.is_allowed ? (
                                                    <>
                                                        <CheckCircle className="mr-1 h-3 w-3" />
                                                        Allowed
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="mr-1 h-3 w-3" />
                                                        Blocked
                                                    </>
                                                )}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Email Verification</label>
                                        <div className="mt-1">
                                            <Badge variant={user.email_verified_at ? "secondary" : "outline"} className="text-sm">
                                                {user.email_verified_at ? (
                                                    <>
                                                        <Shield className="mr-1 h-3 w-3" />
                                                        Verified
                                                    </>
                                                ) : (
                                                    <>
                                                        <Clock className="mr-1 h-3 w-3" />
                                                        Unverified
                                                    </>
                                                )}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Login Method</label>
                                        <div className="mt-1">
                                            <Badge variant="outline" className="text-sm">
                                                {user.google_id ? (
                                                    <>
                                                        <Globe className="mr-1 h-3 w-3" />
                                                        Google OAuth
                                                    </>
                                                ) : (
                                                    <>
                                                        <Mail className="mr-1 h-3 w-3" />
                                                        Email & Password
                                                    </>
                                                )}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Created At</label>
                                        <p className="mt-1 flex items-center text-sm">
                                            <Calendar className="mr-2 h-4 w-4" />
                                            {new Date(user.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                                        <p className="mt-1 flex items-center text-sm">
                                            <Calendar className="mr-2 h-4 w-4" />
                                            {new Date(user.updated_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {user.email_verified_at && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Email Verified At</label>
                                        <p className="mt-1 flex items-center text-sm">
                                            <Shield className="mr-2 h-4 w-4" />
                                            {new Date(user.email_verified_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {loginHistory.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Login History</CardTitle>
                                    <CardDescription>
                                        Recent login activities
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {loginHistory.map((login, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div>
                                                    <p className="text-sm font-medium">{login.ip_address}</p>
                                                    <p className="text-xs text-muted-foreground">{login.user_agent}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(login.login_at).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>
                                    Manage this user account
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button className="w-full" asChild>
                                    <Link href={route('admin.users.edit', user.id)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit User
                                    </Link>
                                </Button>

                                <Button 
                                    variant={user.is_allowed ? "outline" : "default"} 
                                    className="w-full"
                                    onClick={toggleUserAccess}
                                >
                                    {user.is_allowed ? (
                                        <>
                                            <UserX className="mr-2 h-4 w-4" />
                                            Block Access
                                        </>
                                    ) : (
                                        <>
                                            <UserCheck className="mr-2 h-4 w-4" />
                                            Allow Access
                                        </>
                                    )}
                                </Button>

                                <Button 
                                    variant="destructive" 
                                    className="w-full"
                                    onClick={deleteUser}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete User
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Account Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">User ID</span>
                                    <span className="text-sm font-medium">#{user.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Account Type</span>
                                    <span className="text-sm font-medium">{user.role}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Status</span>
                                    <span className={`text-sm font-medium ${user.is_allowed ? 'text-green-600' : 'text-red-600'}`}>
                                        {user.is_allowed ? 'Active' : 'Blocked'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Verified</span>
                                    <span className={`text-sm font-medium ${user.email_verified_at ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {user.email_verified_at ? 'Yes' : 'No'}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
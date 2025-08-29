import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Search, Eye, Edit, Trash2, User } from 'lucide-react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { UserProfile, User as UserType, Country } from '@/types';
import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';

// Define type for user profile data
interface UserProfileData {
  id: string;
  user_id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  country_id: string;
  institution?: string;
  department?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
  country?: {
    id: string;
    name: string;
  };
  full_name?: string;
}

// Define props
interface PageProps {
  userProfiles: {
    data: UserProfileData[];
    links: any[];
    meta: any;
  };
  search?: string;
  flash?: {
    success?: string;
  };
}

export default function Index(props: PageProps) {
  // Destructure userProfiles, handle flash separately
  const { userProfiles, search: initialSearch, flash } = props;
  const [search, setSearch] = useState(initialSearch || '');
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const { url } = usePage();

  // Show flash messages
  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
  }, [flash]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search !== initialSearch) {
        router.get(url, { search }, {
          preserveState: true,
          replace: true,
        });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, initialSearch, url]);

  const handleDelete = (id: string) => {
    router.delete(route('admin.user-profiles.destroy', id));
  };

  const handleBulkDelete = () => {
    if (selectedProfiles.length === 0) return;
    
    router.post(route('admin.user-profiles.bulk-delete'), {
      ids: selectedProfiles
    }, {
      onSuccess: () => {
        setSelectedProfiles([]);
      }
    });
  };

  const handleSelectProfile = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedProfiles([...selectedProfiles, id]);
    } else {
      setSelectedProfiles(selectedProfiles.filter(profileId => profileId !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProfiles(userProfiles.data.map(profile => profile.id));
    } else {
      setSelectedProfiles([]);
    }
  };

  const breadcrumbs = [
    { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'User Profiles', href: route('admin.user-profiles.index') },
  ];

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="User Profiles" />

      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">User Profiles</h1>
          <Button asChild>
            <Link href={route('admin.user-profiles.create')}>
              <Plus className="mr-2 h-4 w-4" /> Add New Profile
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Profiles</CardTitle>
            <div className="flex items-center justify-between space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search profiles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              {selectedProfiles.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Selected ({selectedProfiles.length})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete User Profiles</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {selectedProfiles.length} selected user profile(s)? This action cannot be undone.
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
                      checked={selectedProfiles.length === userProfiles.data.length && userProfiles.data.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userProfiles.data.length > 0 ? (
                  userProfiles.data.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedProfiles.includes(profile.id)}
                          onCheckedChange={(checked) => handleSelectProfile(profile.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {profile.first_name} {profile.middle_name ? profile.middle_name + ' ' : ''}{profile.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{profile.department || '-'}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{profile.user?.email || '-'}</div>
                          {profile.user?.role && (
                            <Badge variant="outline" className="text-xs">
                              {profile.user.role}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{profile.country?.name || '-'}</TableCell>
                      <TableCell>{profile.institution || '-'}</TableCell>
                      <TableCell>{profile.phone || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={route('admin.user-profiles.show', profile.id)}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={route('admin.user-profiles.edit', profile.id)}>
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
                                <AlertDialogTitle>Delete User Profile</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the profile for {profile.first_name} {profile.last_name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(profile.id)} className="bg-red-600 hover:bg-red-700">
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
                      {search ? (
                        <div className="text-center">
                          <p className="text-gray-500">No profiles found matching "{search}"</p>
                          <Button 
                            variant="link" 
                            onClick={() => setSearch('')}
                            className="mt-2"
                          >
                            Clear search
                          </Button>
                        </div>
                      ) : (
                        'No user profiles found. Add a new profile to get started.'
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {userProfiles.links && userProfiles.links.length > 3 && (
              <div className="flex items-center justify-between px-2 py-4">
                <div className="text-sm text-gray-500">
                  Showing {userProfiles.meta.from || 0} to {userProfiles.meta.to || 0} of {userProfiles.meta.total} results
                </div>
                <div className="flex space-x-1">
                  {userProfiles.links.map((link, index) => {
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
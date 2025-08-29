import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';

// Define type for committee data
interface Committee {
  id: number;
  name: string;
  position: string;
  title: string | null;
  image: string | null;
}

// Define props with optional flash message
interface PageProps {
  committees: Committee[];
  flash?: {
    success?: string;
  };
}

export default function Index(props: PageProps) {
  // Destructure only committees, handle flash separately
  const { committees } = props;
  
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this member?')) {
      router.delete(route('admin.organizing-committees.destroy', id));
    }
  };

  const breadcrumbs = [
    { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'Organizing Committee', href: route('admin.organizing-committees.index') },
  ];

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="Organizing Committee" />

      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Organizing Committee</h1>
          <Button asChild>
            <Link href={route('admin.organizing-committees.create')}>
              <Plus className="mr-2 h-4 w-4" /> Add New Member
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Committee Members</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {committees.length > 0 ? (
                  committees.map((committee) => (
                    <TableRow key={committee.id}>
                      <TableCell>
                        {committee.image ? (
                          <img
                            src={`/storage/${committee.image}`}
                            alt={committee.name}
                            className="h-12 w-12 object-cover rounded-full"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-500 text-xs">No image</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{committee.name}</TableCell>
                      <TableCell>{committee.position}</TableCell>
                      <TableCell>{committee.title || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={route('admin.organizing-committees.show', committee.id)}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={route('admin.organizing-committees.edit', committee.id)}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(committee.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No committee members found. Add a new member to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppSidebarLayout>
  );
}
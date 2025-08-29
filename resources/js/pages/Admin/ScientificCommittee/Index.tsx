import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Edit, ExternalLink, Eye, Mail, Plus, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Committee {
  id: number;
  name: string;
  position: string;
  scopus_link: string | null;
  email: string | null;
  image: string | null;
}

interface Props {
  committees: Committee[];
  flash?: {
    success?: string;
  };
}

export default function Index({ committees, flash = {} }: Props) {
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this member?')) {
      router.delete(route('admin.scientific-committees.destroy', id));
    }
  };

  const breadcrumbs = [
    { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'Scientific Committee', href: route('admin.scientific-committees.index') },
  ];

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="Scientific Committee" />
      
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Scientific Committee</h1>
          <Button asChild>
            <Link href={route('admin.scientific-committees.create')}>
              <Plus className="mr-2 h-4 w-4" /> Add New Member
            </Link>
          </Button>
        </div>
        
        {flash?.success && (
          <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{flash.success}</AlertDescription>
          </Alert>
        )}
        
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
                  <TableHead>Scopus</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {committees.map((committee) => (
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
                    <TableCell>
                      {committee.scopus_link ? (
                        <a href={committee.scopus_link} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-800">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Scopus
                        </a>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {committee.email ? (
                        <a href={`mailto:${committee.email}`} className="flex items-center text-blue-600 hover:text-blue-800">
                          <Mail className="h-4 w-4 mr-1" />
                          {committee.email}
                        </a>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={route('admin.scientific-committees.show', committee.id)}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={route('admin.scientific-committees.edit', committee.id)}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(committee.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {committees.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No scientific committee members found. Add a new member to get started.
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
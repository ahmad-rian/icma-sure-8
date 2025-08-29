import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit } from 'lucide-react';

interface Committee {
  id: number;
  name: string;
  position: string;
  title: string | null;
  image: string | null;
}

interface Props {
  committee: Committee;
}

export default function Show({ committee }: Props) {
  const breadcrumbs = [
    { title: 'Dashboard', href: route('admin.dashboard') },
    { title: 'Organizing Committee', href: route('admin.organizing-committees.index') },
    { title: committee.name, href: route('admin.organizing-committees.show', committee.id) },
  ];

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title={`${committee.name} - Committee Member`} />
      
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Committee Member Details</h1>
          <div className="flex space-x-2">
            <Button variant="outline" asChild>
              <Link href={route('admin.organizing-committees.index')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
              </Link>
            </Button>
            <Button asChild>
              <Link href={route('admin.organizing-committees.edit', committee.id)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Link>
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{committee.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                {committee.image ? (
                  <img
                    src={`/storage/${committee.image}`}
                    alt={committee.name}
                    className="w-full h-auto rounded-lg shadow"
                  />
                ) : (
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
              </div>
              
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-blue-600">{committee.position}</h3>
                  {committee.title && (
                    <p className="text-gray-600">{committee.title}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-500">Member Information</h4>
                  <div className="grid grid-cols-2 gap-2 border-t pt-2">
                    <div className="text-sm font-medium">ID:</div>
                    <div className="text-sm text-gray-600">{committee.id}</div>
                    
                    <div className="text-sm font-medium">Name:</div>
                    <div className="text-sm text-gray-600">{committee.name}</div>
                    
                    <div className="text-sm font-medium">Position:</div>
                    <div className="text-sm text-gray-600">{committee.position}</div>
                    
                    <div className="text-sm font-medium">Title:</div>
                    <div className="text-sm text-gray-600">{committee.title || '-'}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppSidebarLayout>
  );
}
import React, { FormEventHandler, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

interface Committee {
  id: number;
  name: string;
  position: string;
  scopus_link: string | null;
  email: string | null;
  image: string | null;
}

interface Props {
  committee: Committee;
}

export default function Edit({ committee }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    _method: 'PUT',
    name: committee.name,
    position: committee.position,
    scopus_link: committee.scopus_link || '',
    email: committee.email || '',
    image: null as File | null,
  });
  
  const [preview, setPreview] = useState<string | null>(
    committee.image ? `/storage/${committee.image}` : null
  );

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('admin.scientific-committees.update', committee.id));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setData('image', file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const breadcrumbs = [
    { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'Scientific Committee', href: route('admin.scientific-committees.index') },
        { title: 'Edit Member', href: route('admin.scientific-committees.edit', committee.id) },
  ];

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Scientific Committee Member" />
      
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Edit Scientific Committee Member</h1>
          <Button variant="outline" asChild>
            <Link href={route('admin.scientific-committees.index')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
            </Link>
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Member Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="position">
                    Position <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="position"
                    value={data.position}
                    onChange={(e) => setData('position', e.target.value)}
                    required
                  />
                  {errors.position && (
                    <p className="text-red-500 text-sm">{errors.position}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="scopus_link">Scopus Link</Label>
                  <Input
                    id="scopus_link"
                    type="url"
                    value={data.scopus_link}
                    onChange={(e) => setData('scopus_link', e.target.value)}
                    placeholder="https://www.scopus.com/authid/..."
                  />
                  {errors.scopus_link && (
                    <p className="text-red-500 text-sm">{errors.scopus_link}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="example@domain.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="image">Profile Image</Label>
                  <Input
                    id="image"
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-gray-500">
                    Upload a new image to replace the current one.
                  </p>
                  {errors.image && (
                    <p className="text-red-500 text-sm">{errors.image}</p>
                  )}
                  
                  {preview && (
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-1">Current Image:</p>
                      <div className="w-32 h-32 overflow-hidden rounded-lg border">
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <Button type="submit" disabled={processing}>
                {processing ? 'Updating...' : 'Update Committee Member'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppSidebarLayout>
  );
}
import React, { FormEventHandler, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    position: '',
    title: '',
    image: null as File | null,
  });
  
  const [preview, setPreview] = useState<string | null>(null);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('admin.organizing-committees.store'));
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
    } else {
      setPreview(null);
    }
  };

  const breadcrumbs = [
    { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'Organizing Committee', href: route('admin.organizing-committees.index') },
        { title: 'Add New Member', href: route('admin.organizing-committees.create') },
  ];

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="Add Committee Member" />
      
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Add Committee Member</h1>
          <Button variant="outline" asChild>
            <Link href={route('admin.organizing-committees.index')}>
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
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title}</p>
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
                    Upload an image (JPG, PNG, GIF). It will be automatically converted to WebP format.
                  </p>
                  {errors.image && (
                    <p className="text-red-500 text-sm">{errors.image}</p>
                  )}
                  
                  {preview && (
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-1">Preview:</p>
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
                {processing ? 'Saving...' : 'Save Committee Member'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppSidebarLayout>
  );
}
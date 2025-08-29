import React, { FormEventHandler, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft } from 'lucide-react';

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    content: '',
    author: '',
    excerpt: '',
    published: false,
    published_at: '',
    image: null as File | null,
  });
  
  const [preview, setPreview] = useState<string | null>(null);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('admin.articles.store'));
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
        { title: 'Articles', href: route('admin.articles.index') },
        { title: 'Create New Article', href: route('admin.articles.create') },
  ];

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Article" />
      
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Create New Article</h1>
          <Button variant="outline" asChild>
            <Link href={route('admin.articles.index')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Articles
            </Link>
          </Button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Article Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-2">
                    <Label htmlFor="title">
                      Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={data.title}
                      onChange={(e) => setData('title', e.target.value)}
                      required
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm">{errors.title}</p>
                    )}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="content">
                      Content <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="content"
                      value={data.content}
                      onChange={(e) => setData('content', e.target.value)}
                      rows={12}
                      required
                    />
                    {errors.content && (
                      <p className="text-red-500 text-sm">{errors.content}</p>
                    )}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={data.excerpt}
                      onChange={(e) => setData('excerpt', e.target.value)}
                      rows={3}
                      placeholder="Leave blank to generate automatically from content"
                    />
                    {errors.excerpt && (
                      <p className="text-red-500 text-sm">{errors.excerpt}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Publication Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={data.author}
                      onChange={(e) => setData('author', e.target.value)}
                      placeholder="Author name"
                    />
                    {errors.author && (
                      <p className="text-red-500 text-sm">{errors.author}</p>
                    )}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="image">Featured Image</Label>
                    <Input
                      id="image"
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="cursor-pointer"
                    />
                    {errors.image && (
                      <p className="text-red-500 text-sm">{errors.image}</p>
                    )}
                    
                    {preview && (
                      <div className="mt-2">
                        <p className="text-sm font-medium mb-1">Preview:</p>
                        <div className="w-full h-40 overflow-hidden rounded-lg border">
                          <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="published"
                      checked={data.published}
                      onCheckedChange={(checked) => setData('published', checked)}
                    />
                    <Label htmlFor="published">Publish article</Label>
                  </div>
                  
                  {data.published && (
                    <div className="grid gap-2">
                      <Label htmlFor="published_at">Publication Date</Label>
                      <Input
                        id="published_at"
                        type="date"
                        value={data.published_at}
                        onChange={(e) => setData('published_at', e.target.value)}
                      />
                      <p className="text-xs text-gray-500">
                        Leave blank to use current date
                      </p>
                      {errors.published_at && (
                        <p className="text-red-500 text-sm">{errors.published_at}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <Button type="submit" className="w-full" disabled={processing}>
                  {processing ? 'Saving...' : 'Save Article'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AppSidebarLayout>
  );
}
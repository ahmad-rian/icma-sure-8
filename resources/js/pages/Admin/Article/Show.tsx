import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Calendar, Edit, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  author: string | null;
  image: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Props {
  article: Article;
}

export default function Show({ article }: Props) {
  const breadcrumbs = [
    { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'Articles', href: route('admin.articles.index') },
        { title: article.title, href: route('admin.articles.show', article.id) },
  ];

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title={article.title} />
      
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Article Details</h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={route('admin.articles.index')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Articles
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href={route('admin.articles.edit', article.id)}>
                <Edit className="mr-2 h-4 w-4" /> Edit Article
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="overflow-hidden">
              <CardHeader className="bg-slate-50 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{article.title}</CardTitle>
                    <CardDescription className="mt-2">
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        {article.author && (
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {article.author}
                          </div>
                        )}
                        {article.published_at && (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {format(new Date(article.published_at), 'MMM dd, yyyy')}
                          </div>
                        )}
                      </div>
                    </CardDescription>
                  </div>
                  <Badge className={article.published ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}>
                    {article.published ? "Published" : "Draft"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {article.image && (
                  <div className="mb-6 rounded-lg overflow-hidden shadow-md">
                    <img
                      src={`/storage/${article.image}`}
                      alt={article.title}
                      className="w-full h-auto"
                    />
                  </div>
                )}
                
                {article.excerpt && (
                  <div className="mb-6 bg-slate-50 border-l-4 border-slate-300 p-4 rounded-r-lg">
                    <p className="italic text-slate-700">{article.excerpt}</p>
                  </div>
                )}
                
                <div className="prose prose-slate max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: article.content }} />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-lg">Article Information</CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="space-y-5">
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-1">Slug</h3>
                    <p className="text-sm bg-slate-50 p-2 rounded border font-mono break-all">{article.slug}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-1">Status</h3>
                    <Badge className={article.published 
                      ? "bg-green-100 text-green-800 hover:bg-green-200" 
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"}>
                      {article.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  
                  {article.published_at && (
                    <div>
                      <h3 className="text-sm font-medium text-slate-500 mb-1">Published Date</h3>
                      <p className="text-sm">{format(new Date(article.published_at), 'MMMM dd, yyyy')}</p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-1">Created At</h3>
                    <p className="text-sm">{format(new Date(article.created_at), 'MMMM dd, yyyy')}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-1">Last Updated</h3>
                    <p className="text-sm">{format(new Date(article.updated_at), 'MMMM dd, yyyy')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            
          </div>
        </div>
      </div>
    </AppSidebarLayout>
  );
}
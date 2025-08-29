import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Edit, Eye, FileText, Plus, Search, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

interface Article {
  id: number;
  title: string;
  author: string | null;
  published: boolean;
  published_at: string | null;
  image: string | null;
  slug: string;
  excerpt?: string | null;
  created_at: string;
  updated_at: string;
}

interface PaginatedArticles {
  data: Article[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
}

interface Props {
  articles: PaginatedArticles;
  search?: string;
  flash?: {
    success?: string;
    error?: string;
  };
}

export default function Index({ articles, search = '', flash = {} }: Props) {
  const { props } = usePage();
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState(search);
  const [isDeleting, setIsDeleting] = useState(false);

  // Show flash messages
  useEffect(() => {
    if (flash?.success) {
      // You can implement toast notification here if available
      console.log('Success:', flash.success);
    }
    if (flash?.error) {
      console.log('Error:', flash.error);
    }
  }, [flash]);

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this article?')) {
      router.delete(route('admin.articles.destroy', id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedArticles.length === 0) return;
    
    setIsDeleting(true);
    router.post(route('admin.articles.bulk-delete'), {
      ids: selectedArticles
    }, {
      onFinish: () => {
        setIsDeleting(false);
        setSelectedArticles([]);
      }
    });
  };

  const handleSelectArticle = (articleId: number, checked: boolean) => {
    if (checked) {
      setSelectedArticles(prev => [...prev, articleId]);
    } else {
      setSelectedArticles(prev => prev.filter(id => id !== articleId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedArticles(articles.data.map(article => article.id));
    } else {
      setSelectedArticles([]);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(route('admin.articles.index'), { search: searchTerm }, {
      preserveState: true,
      replace: true
    });
  };

  const isAllSelected = articles.data.length > 0 && selectedArticles.length === articles.data.length;
  const isIndeterminate = selectedArticles.length > 0 && selectedArticles.length < articles.data.length;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric' 
    });
  };

  const breadcrumbs = [
    { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'Articles', href: route('admin.articles.index') },
  ];

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="Articles" />
      
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Articles</h1>
          <div className="flex gap-2">
            {selectedArticles.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isDeleting}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Selected ({selectedArticles.length})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete {selectedArticles.length} article(s).
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete Articles
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button asChild>
              <Link href={route('admin.articles.create')}>
                <Plus className="mr-2 h-4 w-4" /> Add New Article
              </Link>
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search articles by title, author, or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">
                Search
              </Button>
              {search && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    router.get(route('admin.articles.index'));
                  }}
                >
                  Clear
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
        
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
        
        <Card>
          <CardHeader>
            <CardTitle>All Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all articles"
                      className={isIndeterminate ? "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" : ""}
                    />
                  </TableHead>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Published Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.data.length > 0 ? (
                  articles.data.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedArticles.includes(article.id)}
                          onCheckedChange={(checked) => handleSelectArticle(article.id, checked as boolean)}
                          aria-label={`Select article ${article.title}`}
                        />
                      </TableCell>
                      <TableCell>
                        {article.image ? (
                          <img 
                            src={`/storage/${article.image}`} 
                            alt={article.title} 
                            className="h-12 w-16 object-cover rounded"
                          />
                        ) : (
                          <div className="h-12 w-16 bg-gray-200 rounded flex items-center justify-center">
                            <FileText className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="truncate max-w-md" title={article.title}>
                          {article.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 truncate">
                          Slug: {article.slug}
                        </div>
                      </TableCell>
                      <TableCell>{article.author || '-'}</TableCell>
                      <TableCell>
                        {article.published ? (
                          <Badge className="bg-green-500">Published</Badge>
                        ) : (
                          <Badge variant="outline">Draft</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {article.published_at ? (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "justify-start text-left font-normal",
                                  !article.published_at && "text-muted-foreground"
                                )}
                              >
                                {formatDate(article.published_at)}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={article.published_at ? new Date(article.published_at) : undefined}
                                initialFocus
                                disabled
                              />
                            </PopoverContent>
                          </Popover>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={route('admin.articles.show', article.id)}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={route('admin.articles.edit', article.id)}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(article.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      {search ? (
                        <div className="text-center">
                          <p className="text-muted-foreground">No articles found matching "{search}".</p>
                          <Button
                            variant="link"
                            onClick={() => {
                              setSearchTerm('');
                              router.get(route('admin.articles.index'));
                            }}
                            className="mt-2"
                          >
                            Clear search to see all articles
                          </Button>
                        </div>
                      ) : (
                        'No articles found. Add a new article to get started.'
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        {articles.data.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {articles.from} to {articles.to} of {articles.total} articles
            </div>
            <div className="flex items-center space-x-2">
              {articles.links.map((link, index) => {
                if (link.url === null) {
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      disabled
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  );
                }
                
                return (
                  <Button
                    key={index}
                    variant={link.active ? "default" : "outline"}
                    size="sm"
                    onClick={() => router.get(link.url!, { search })}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppSidebarLayout>
  );
}
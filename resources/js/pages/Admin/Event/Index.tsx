import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Calendar, Edit, Eye, MapPin, Plus, Search, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface Event {
  id: number;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  image: string | null;
  is_featured: boolean;
  is_active: boolean;
}

interface Props {
  events: {
    data: Event[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  search: string;
  flash?: {
    success?: string;
    error?: string;
  };
}

export default function Index({ events, search, flash = {} }: Props) {
  const [selectedEvents, setSelectedEvents] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState(search || '');

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      router.delete(route('admin.events.destroy', id));
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(route('admin.events.index'), { search: searchTerm }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleSelectEvent = (eventId: number) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEvents.length === events.data.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(events.data.map(event => event.id));
    }
  };

  const handleBulkDelete = () => {
    router.post(route('admin.events.bulk-delete'), {
      ids: selectedEvents
    }, {
      onSuccess: () => {
        setSelectedEvents([]);
      }
    });
  };

  const isAllSelected = events.data.length > 0 && selectedEvents.length === events.data.length;
  const isIndeterminate = selectedEvents.length > 0 && selectedEvents.length < events.data.length;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '-';
    try {
      return format(new Date(`2000-01-01T${timeString}`), 'h:mm a');
    } catch (e) {
      return timeString;
    }
  };

  const breadcrumbs = [
    { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'Events', href: route('admin.events.index') },
  ];

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="Events" />
      
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Events</h1>
          <Button asChild>
            <Link href={route('admin.events.create')}>
              <Plus className="mr-2 h-4 w-4" /> Add New Event
            </Link>
          </Button>
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
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>
          
          {selectedEvents.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected ({selectedEvents.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete {selectedEvents.length} event(s). This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700">
                    Delete Events
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Events</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all events"
                      {...(isIndeterminate && { 'data-state': 'indeterminate' })}
                    />
                  </TableHead>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.data.length > 0 ? (
                  events.data.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedEvents.includes(event.id)}
                          onCheckedChange={() => handleSelectEvent(event.id)}
                          aria-label={`Select ${event.title}`}
                        />
                      </TableCell>
                      <TableCell>
                        {event.image ? (
                          <img 
                            src={`/storage/${event.image}`} 
                            alt={event.title} 
                            className="h-12 w-16 object-cover rounded"
                          />
                        ) : (
                          <div className="h-12 w-16 bg-gray-200 rounded flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="truncate max-w-md" title={event.title}>
                          {event.title}
                        </div>
                        {event.is_featured && (
                          <Badge className="mt-1 bg-amber-100 text-amber-800 hover:bg-amber-200">Featured</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{formatDate(event.start_date)}</span>
                          {event.start_time && (
                            <span className="text-xs text-gray-500">{formatTime(event.start_time)}</span>
                          )}
                          {event.end_date && event.end_date !== event.start_date && (
                            <span className="text-xs text-gray-500 mt-1">
                              Until {formatDate(event.end_date)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {event.location ? (
                          <div className="flex items-center">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <MapPin 
                                    className={cn(
                                      "h-4 w-4 mr-1", 
                                      event.latitude && event.longitude 
                                        ? "text-red-500" 
                                        : "text-gray-500"
                                    )} 
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  {event.latitude && event.longitude 
                                    ? `Has map coordinates: ${event.latitude}, ${event.longitude}` 
                                    : "No map coordinates available"}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <span className="truncate max-w-xs">{event.location}</span>
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {event.is_active ? (
                          <Badge className="bg-green-500">Active</Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={route('admin.events.show', event.id)}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={route('admin.events.edit', event.id)}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(event.id)}>
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
                        <div className="flex flex-col items-center space-y-2">
                          <p>No events found for "{search}"</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              setSearchTerm('');
                              router.get(route('admin.events.index'));
                            }}
                          >
                            Clear search
                          </Button>
                        </div>
                      ) : (
                        'No events found. Add a new event to get started.'
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          
          {events.data.length > 0 && (
            <div className="px-6 py-4 border-t">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {events.from} to {events.to} of {events.total} events
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.get(route('admin.events.index'), { 
                      search: searchTerm, 
                      page: events.current_page - 1 
                    })}
                    disabled={events.current_page <= 1}
                  >
                    Previous
                  </Button>
                  
                  <span className="text-sm text-gray-500">
                    Page {events.current_page} of {events.last_page}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.get(route('admin.events.index'), { 
                      search: searchTerm, 
                      page: events.current_page + 1 
                    })}
                    disabled={events.current_page >= events.last_page}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </AppSidebarLayout>
  );
}
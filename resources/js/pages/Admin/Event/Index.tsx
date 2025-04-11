import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Calendar, Edit, Eye, MapPin, Plus, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  events: Event[];
  flash?: {
    success?: string;
  };
}

export default function Index({ events, flash = {} }: Props) {
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      router.delete(route('events.destroy', id));
    }
  };

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
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Events', href: route('events.index') },
  ];

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="Events" />
      
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Events</h1>
          <Button asChild>
            <Link href={route('events.create')}>
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
        
        <Card>
          <CardHeader>
            <CardTitle>All Events</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.length > 0 ? (
                  events.map((event) => (
                    <TableRow key={event.id}>
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
                            <Link href={route('events.show', event.id)}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={route('events.edit', event.id)}>
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
                    <TableCell colSpan={6} className="h-24 text-center">
                      No events found. Add a new event to get started.
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
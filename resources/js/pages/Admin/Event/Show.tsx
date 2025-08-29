import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Calendar, Clock, Edit, MapPin, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import LocationMap from '@/components/LocationMap';

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
  created_at: string;
  updated_at: string;
}

interface Props {
  event: Event;
}

export default function Show({ event }: Props) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return format(new Date(dateString), 'MMMM dd, yyyy');
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return null;
    try {
      return format(new Date(`2000-01-01T${timeString}`), 'h:mm a');
    } catch (e) {
      return timeString;
    }
  };

  const breadcrumbs = [
    { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'Events', href: route('admin.events.index') },
        { title: event.title, href: route('admin.events.show', event.id) },
  ];

  const hasCoordinates = Boolean(event.latitude && event.longitude);

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title={event.title} />
      
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Event Details</h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={route('admin.events.index')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href={route('admin.events.edit', event.id)}>
                <Edit className="mr-2 h-4 w-4" /> Edit Event
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="bg-slate-50 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{event.title}</CardTitle>
                    <CardDescription className="mt-2">
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(event.start_date)}
                          {event.end_date && event.end_date !== event.start_date && (
                            <span> - {formatDate(event.end_date)}</span>
                          )}
                        </div>
                        
                        {(event.start_time || event.end_time) && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatTime(event.start_time)}
                            {event.end_time && (
                              <span> - {formatTime(event.end_time)}</span>
                            )}
                          </div>
                        )}
                        
                        {event.location && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {event.location}
                          </div>
                        )}
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    {event.is_featured && (
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                        <Star className="h-3 w-3 mr-1" /> Featured
                      </Badge>
                    )}
                    <Badge className={event.is_active
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"}>
                      {event.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {event.image && (
                  <div className="mb-6 rounded-lg overflow-hidden shadow-md">
                    <img
                      src={`/storage/${event.image}`}
                      alt={event.title}
                      className="w-full h-auto"
                    />
                  </div>
                )}
                
                {event.description ? (
                  <div className="prose prose-slate max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: event.description }} />
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No description provided for this event.</p>
                )}
              </CardContent>
            </Card>
            
            {/* Map Component - Only show if coordinates are available */}
            {hasCoordinates && (
              <LocationMap
                location={event.location}
                latitude={event.latitude}
                longitude={event.longitude}
                readOnly={true}
              />
            )}
          </div>
          
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-lg">Event Information</CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="space-y-5">
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-1">Event Status</h3>
                    <Badge className={event.is_active 
                      ? "bg-green-100 text-green-800 hover:bg-green-200" 
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"}>
                      {event.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  
                  {event.is_featured && (
                    <div>
                      <h3 className="text-sm font-medium text-slate-500 mb-1">Featured Status</h3>
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                        <Star className="h-3 w-3 mr-1" /> Featured Event
                      </Badge>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-1">Date</h3>
                    <p className="text-sm">
                      {formatDate(event.start_date)}
                      {event.end_date && event.end_date !== event.start_date && (
                        <span> - {formatDate(event.end_date)}</span>
                      )}
                    </p>
                  </div>
                  
                  {(event.start_time || event.end_time) && (
                    <div>
                      <h3 className="text-sm font-medium text-slate-500 mb-1">Time</h3>
                      <p className="text-sm">
                        {formatTime(event.start_time)}
                        {event.end_time && (
                          <span> - {formatTime(event.end_time)}</span>
                        )}
                      </p>
                    </div>
                  )}
                  
                  {event.location && (
                    <div>
                      <h3 className="text-sm font-medium text-slate-500 mb-1">Location</h3>
                      <p className="text-sm">{event.location}</p>
                    </div>
                  )}
                  
                  {hasCoordinates && (
                    <div>
                      <h3 className="text-sm font-medium text-slate-500 mb-1">Coordinates</h3>
                      <p className="text-sm">
                        Lat: {event.latitude}, Lng: {event.longitude}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-1">Created At</h3>
                    <p className="text-sm">{format(new Date(event.created_at), 'MMMM dd, yyyy')}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-1">Last Updated</h3>
                    <p className="text-sm">{format(new Date(event.updated_at), 'MMMM dd, yyyy')}</p>
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
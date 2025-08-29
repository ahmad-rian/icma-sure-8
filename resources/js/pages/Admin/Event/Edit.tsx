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
}

interface Props {
  event: Event;
}

export default function Edit({ event }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    _method: 'PUT',
    title: event.title,
    description: event.description || '',
    start_date: format(new Date(event.start_date), 'yyyy-MM-dd'),
    end_date: event.end_date ? format(new Date(event.end_date), 'yyyy-MM-dd') : '',
    start_time: event.start_time || '',
    end_time: event.end_time || '',
    location: event.location || '',
    latitude: event.latitude,
    longitude: event.longitude,
    is_featured: event.is_featured,
    is_active: event.is_active,
    image: null as File | null,
  });
  
  const [preview, setPreview] = useState<string | null>(
    event.image ? `/storage/${event.image}` : null
  );

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('admin.events.update', event.id));
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
  
  const handleLocationChange = (location: string) => {
    setData('location', location);
  };
  
  const handleCoordinatesChange = (lat: number | string, lng: number | string) => {
    setData('latitude', lat);
    setData('longitude', lng);
  };

  const breadcrumbs = [
    { title: 'Dashboard', href: route('admin.dashboard') },
        { title: 'Events', href: route('admin.events.index') },
        { title: 'Edit Event', href: route('admin.events.edit', event.id) },
  ];

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Event" />
      
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Edit Event</h1>
          <Button variant="outline" asChild>
            <Link href={route('admin.events.index')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
            </Link>
          </Button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
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
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                      rows={8}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm">{errors.description}</p>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="start_date">
                        Start Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={data.start_date}
                        onChange={(e) => setData('start_date', e.target.value)}
                        required
                      />
                      {errors.start_date && (
                        <p className="text-red-500 text-sm">{errors.start_date}</p>
                      )}
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="end_date">End Date</Label>
                      <Input
                        id="end_date"
                        type="date"
                        value={data.end_date}
                        onChange={(e) => setData('end_date', e.target.value)}
                      />
                      {errors.end_date && (
                        <p className="text-red-500 text-sm">{errors.end_date}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="start_time">Start Time</Label>
                      <Input
                        id="start_time"
                        type="time"
                        value={data.start_time}
                        onChange={(e) => setData('start_time', e.target.value)}
                      />
                      {errors.start_time && (
                        <p className="text-red-500 text-sm">{errors.start_time}</p>
                      )}
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="end_time">End Time</Label>
                      <Input
                        id="end_time"
                        type="time"
                        value={data.end_time}
                        onChange={(e) => setData('end_time', e.target.value)}
                      />
                      {errors.end_time && (
                        <p className="text-red-500 text-sm">{errors.end_time}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={data.location}
                      onChange={(e) => setData('location', e.target.value)}
                      placeholder="Event location or venue"
                    />
                    {errors.location && (
                      <p className="text-red-500 text-sm">{errors.location}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Map Component */}
              <LocationMap
                location={data.location}
                latitude={data.latitude}
                longitude={data.longitude}
                onLocationChange={handleLocationChange}
                onCoordinatesChange={handleCoordinatesChange}
              />
            </div>
            
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Event Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-2">
                    <Label htmlFor="image">Event Image</Label>
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
                        <p className="text-sm font-medium mb-1">Current Image:</p>
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
                      id="is_featured"
                      checked={data.is_featured}
                      onCheckedChange={(checked) => setData('is_featured', checked)}
                    />
                    <Label htmlFor="is_featured">Featured Event</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={data.is_active}
                      onCheckedChange={(checked) => setData('is_active', checked)}
                    />
                    <Label htmlFor="is_active">Active Event</Label>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <Button type="submit" className="w-full" disabled={processing}>
                  {processing ? 'Updating...' : 'Update Event'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AppSidebarLayout>
  );
}
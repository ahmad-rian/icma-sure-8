<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Buglinjo\LaravelWebp\Facades\Webp;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Event::query();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
            });
        }

        $events = $query->orderBy('created_at', 'desc')
                       ->paginate(10)
                       ->withQueryString();

        return Inertia::render('Admin/Event/Index', [
            'events' => $events,
            'search' => $request->get('search', '')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Event/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'location' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $event = new Event();
        $event->title = $validated['title'];
        $event->description = $validated['description'] ?? null;
        $event->start_date = $validated['start_date'];
        $event->end_date = $validated['end_date'] ?? null;
        $event->start_time = $validated['start_time'] ?? null;
        $event->end_time = $validated['end_time'] ?? null;
        $event->location = $validated['location'] ?? null;

        // Add map coordinates
        $event->latitude = $validated['latitude'] ?? null;
        $event->longitude = $validated['longitude'] ?? null;

        // If we have a location but no coordinates, try to geocode it
        if ($event->location && (!$event->latitude || !$event->longitude)) {
            $this->geocodeLocation($event);
        }

        $event->is_featured = $validated['is_featured'] ?? false;
        $event->is_active = $validated['is_active'] ?? true;

        // Handle image upload with WebP conversion
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $filename = Str::slug($request->title) . '-' . time();

            // Define the WebP destination path
            $webpFilename = $filename . '.webp';
            $webpPath = 'images/events/' . $webpFilename;
            $webpFullPath = storage_path('app/public/' . $webpPath);

            // Ensure directory exists
            $directory = dirname($webpFullPath);
            if (!File::exists($directory)) {
                File::makeDirectory($directory, 0755, true);
            }

            // Convert to WebP using the package - passing the UploadedFile object directly
            Webp::make($image)
                ->quality(90) // You can adjust quality as needed (0-100)
                ->save($webpFullPath);

            // Save the WebP path to database
            $event->image = $webpPath;
        }

        $event->save();

        return redirect()->route('events.index')
            ->with('success', 'Event created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event)
    {
        return Inertia::render('Admin/Event/Show', [
            'event' => $event
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Event $event)
    {
        return Inertia::render('Admin/Event/Edit', [
            'event' => $event
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'location' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $event->title = $validated['title'];
        $event->description = $validated['description'] ?? null;
        $event->start_date = $validated['start_date'];
        $event->end_date = $validated['end_date'] ?? null;
        $event->start_time = $validated['start_time'] ?? null;
        $event->end_time = $validated['end_time'] ?? null;

        // Update location info
        $locationChanged = $event->location !== ($validated['location'] ?? null);
        $event->location = $validated['location'] ?? null;

        // Add map coordinates
        $event->latitude = $validated['latitude'] ?? null;
        $event->longitude = $validated['longitude'] ?? null;

        // If location changed and we don't have manual coordinates, try to geocode it
        if ($locationChanged && $event->location && (!$event->latitude || !$event->longitude)) {
            $this->geocodeLocation($event);
        }

        $event->is_featured = $validated['is_featured'] ?? false;
        $event->is_active = $validated['is_active'] ?? true;

        // Handle image upload with WebP conversion
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($event->image && Storage::exists('public/' . $event->image)) {
                Storage::delete('public/' . $event->image);
            }

            $image = $request->file('image');
            $filename = Str::slug($request->title) . '-' . time();

            // Define the WebP destination path
            $webpFilename = $filename . '.webp';
            $webpPath = 'images/events/' . $webpFilename;
            $webpFullPath = storage_path('app/public/' . $webpPath);

            // Ensure directory exists
            $directory = dirname($webpFullPath);
            if (!File::exists($directory)) {
                File::makeDirectory($directory, 0755, true);
            }

            // Convert to WebP using the package - passing the UploadedFile object directly
            Webp::make($image)
                ->quality(90) // You can adjust quality as needed (0-100)
                ->save($webpFullPath);

            // Save the WebP path to database
            $event->image = $webpPath;
        }

        $event->save();

        return redirect()->route('events.index')
            ->with('success', 'Event updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        try {
            // Delete image from storage
            if ($event->image && Storage::exists('public/' . $event->image)) {
                Storage::delete('public/' . $event->image);
            }

            $event->delete();

            return redirect()->route('events.index')
                ->with('success', 'Event deleted successfully!');
        } catch (\Exception $e) {
            return redirect()->route('events.index')
                ->with('error', 'Failed to delete event. Please try again.');
        }
    }

    /**
     * Delete multiple events at once.
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:events,id'
        ]);

        try {
            $events = Event::whereIn('id', $request->ids)->get();
            
            // Delete associated images
            foreach ($events as $event) {
                if ($event->image && Storage::exists('public/' . $event->image)) {
                    Storage::delete('public/' . $event->image);
                }
            }
            
            // Delete events
            Event::whereIn('id', $request->ids)->delete();
            
            $count = count($request->ids);
            return redirect()->route('events.index')
                ->with('success', "Successfully deleted {$count} event(s).");
        } catch (\Exception $e) {
            return redirect()->route('events.index')
                ->with('error', 'Failed to delete events. Please try again.');
        }
    }

    /**
     * Attempt to get coordinates for a location using Nominatim (OpenStreetMap)
     * This is a free geocoding API with usage restrictions (please check terms)
     */
    private function geocodeLocation(Event $event)
    {
        if (empty($event->location)) {
            return;
        }

        try {
            // Use OpenStreetMap's Nominatim service for geocoding (free, no API key required)
            $response = Http::withHeaders([
                'User-Agent' => 'YourAppName/1.0', // Required by Nominatim API
            ])->get('https://nominatim.openstreetmap.org/search', [
                'q' => $event->location,
                'format' => 'json',
                'limit' => 1,
            ]);

            if ($response->successful() && !empty($response->json())) {
                $data = $response->json()[0];
                $event->latitude = $data['lat'];
                $event->longitude = $data['lon'];
            }
        } catch (\Exception $e) {
            // Log error but don't stop the process
            Log::error('Geocoding error: ' . $e->getMessage());
        }
    }
}

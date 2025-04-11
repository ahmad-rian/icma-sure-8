<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ScientificCommittee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Buglinjo\LaravelWebp\Facades\Webp;
use Illuminate\Support\Facades\File;

class ScientificCommitteeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $committees = ScientificCommittee::all();

        return Inertia::render('Admin/ScientificCommittee/Index', [
            'committees' => $committees
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/ScientificCommittee/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'scopus_link' => 'nullable|string|url|max:255',
            'email' => 'nullable|string|email|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $committee = new ScientificCommittee();
        $committee->name = $validated['name'];
        $committee->position = $validated['position'];
        $committee->scopus_link = $validated['scopus_link'] ?? null;
        $committee->email = $validated['email'] ?? null;

        // Handle image upload with WebP conversion
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $filename = Str::slug($request->name) . '-' . time();

            // Define the WebP destination path
            $webpFilename = $filename . '.webp';
            $webpPath = 'images/scientific-committees/' . $webpFilename;
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
            $committee->image = $webpPath;
        }

        $committee->save();

        return redirect()->route('scientific-committees.index')
            ->with('success', 'Scientific committee member added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(ScientificCommittee $scientificCommittee)
    {
        return Inertia::render('Admin/ScientificCommittee/Show', [
            'committee' => $scientificCommittee
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ScientificCommittee $scientificCommittee)
    {
        return Inertia::render('Admin/ScientificCommittee/Edit', [
            'committee' => $scientificCommittee
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ScientificCommittee $scientificCommittee)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'scopus_link' => 'nullable|string|url|max:255',
            'email' => 'nullable|string|email|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $scientificCommittee->name = $validated['name'];
        $scientificCommittee->position = $validated['position'];
        $scientificCommittee->scopus_link = $validated['scopus_link'] ?? null;
        $scientificCommittee->email = $validated['email'] ?? null;

        // Handle image upload with WebP conversion
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($scientificCommittee->image && Storage::exists('public/' . $scientificCommittee->image)) {
                Storage::delete('public/' . $scientificCommittee->image);
            }

            $image = $request->file('image');
            $filename = Str::slug($request->name) . '-' . time();

            // Define the WebP destination path
            $webpFilename = $filename . '.webp';
            $webpPath = 'images/scientific-committees/' . $webpFilename;
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
            $scientificCommittee->image = $webpPath;
        }

        $scientificCommittee->save();

        return redirect()->route('scientific-committees.index')
            ->with('success', 'Scientific committee member updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ScientificCommittee $scientificCommittee)
    {
        // Delete image from storage
        if ($scientificCommittee->image && Storage::exists('public/' . $scientificCommittee->image)) {
            Storage::delete('public/' . $scientificCommittee->image);
        }

        $scientificCommittee->delete();

        return redirect()->route('scientific-committees.index')
            ->with('success', 'Scientific committee member deleted successfully!');
    }
}

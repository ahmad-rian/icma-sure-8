<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\OrganizingCommittee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Buglinjo\LaravelWebp\Facades\Webp;
use Illuminate\Support\Facades\File;

class OrganizingCommitteeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $committees = OrganizingCommittee::all();

        return Inertia::render('Admin/OrganizingCommittee/Index', [
            'committees' => $committees
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/OrganizingCommittee/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'title' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $committee = new OrganizingCommittee();
        $committee->name = $validated['name'];
        $committee->position = $validated['position'];
        $committee->title = $validated['title'] ?? null;

        // Handle image upload with WebP conversion
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $filename = Str::slug($request->name) . '-' . time();

            // Define the WebP destination path
            $webpFilename = $filename . '.webp';
            $webpPath = 'images/committees/' . $webpFilename;
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

            // No need to delete temporary file as we're not creating one anymore

            // Save the WebP path to database
            $committee->image = $webpPath;
        }

        $committee->save();

        return redirect()->route('organizing-committees.index')
            ->with('success', 'Committee member added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(OrganizingCommittee $organizingCommittee)
    {
        return Inertia::render('Admin/OrganizingCommittee/Show', [
            'committee' => $organizingCommittee
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(OrganizingCommittee $organizingCommittee)
    {
        return Inertia::render('Admin/OrganizingCommittee/Edit', [
            'committee' => $organizingCommittee
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, OrganizingCommittee $organizingCommittee)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'title' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $organizingCommittee->name = $validated['name'];
        $organizingCommittee->position = $validated['position'];
        $organizingCommittee->title = $validated['title'] ?? null;

        // Handle image upload with WebP conversion
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($organizingCommittee->image && Storage::exists('public/' . $organizingCommittee->image)) {
                Storage::delete('public/' . $organizingCommittee->image);
            }

            $image = $request->file('image');
            $filename = Str::slug($request->name) . '-' . time();

            // Define the WebP destination path
            $webpFilename = $filename . '.webp';
            $webpPath = 'images/committees/' . $webpFilename;
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
            $organizingCommittee->image = $webpPath;
        }

        $organizingCommittee->save();

        return redirect()->route('organizing-committees.index')
            ->with('success', 'Committee member updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(OrganizingCommittee $organizingCommittee)
    {
        // Delete image from storage
        if ($organizingCommittee->image && Storage::exists('public/' . $organizingCommittee->image)) {
            Storage::delete('public/' . $organizingCommittee->image);
        }

        $organizingCommittee->delete();

        return redirect()->route('organizing-committees.index')
            ->with('success', 'Committee member deleted successfully!');
    }
}

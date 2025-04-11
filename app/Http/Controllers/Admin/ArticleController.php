<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Buglinjo\LaravelWebp\Facades\Webp;
use Illuminate\Support\Facades\File;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $articles = Article::all();

        return Inertia::render('Admin/Article/Index', [
            'articles' => $articles
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Article/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'author' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'excerpt' => 'nullable|string',
            'published' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        $article = new Article();
        $article->title = $validated['title'];
        $article->content = $validated['content'];
        $article->author = $validated['author'] ?? null;
        $article->slug = Str::slug($validated['title']) . '-' . Str::random(8);
        $article->excerpt = $validated['excerpt'] ?? Str::limit(strip_tags($validated['content']), 150);
        $article->published = $validated['published'] ?? false;
        $article->published_at = $validated['published'] ? ($validated['published_at'] ?? now()) : null;

        // Handle image upload with WebP conversion
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $filename = Str::slug($request->title) . '-' . time();

            // Define the WebP destination path
            $webpFilename = $filename . '.webp';
            $webpPath = 'images/articles/' . $webpFilename;
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
            $article->image = $webpPath;
        }

        $article->save();

        return redirect()->route('articles.index')
            ->with('success', 'Article created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Article $article)
    {
        return Inertia::render('Admin/Article/Show', [
            'article' => $article
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Article $article)
    {
        return Inertia::render('Admin/Article/Edit', [
            'article' => $article
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Article $article)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'author' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'excerpt' => 'nullable|string',
            'published' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        $article->title = $validated['title'];
        $article->content = $validated['content'];
        $article->author = $validated['author'] ?? null;
        $article->excerpt = $validated['excerpt'] ?? Str::limit(strip_tags($validated['content']), 150);
        $article->published = $validated['published'] ?? false;
        $article->published_at = $validated['published'] ? ($validated['published_at'] ?? now()) : null;

        // Handle image upload with WebP conversion
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($article->image && Storage::exists('public/' . $article->image)) {
                Storage::delete('public/' . $article->image);
            }

            $image = $request->file('image');
            $filename = Str::slug($request->title) . '-' . time();

            // Define the WebP destination path
            $webpFilename = $filename . '.webp';
            $webpPath = 'images/articles/' . $webpFilename;
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
            $article->image = $webpPath;
        }

        $article->save();

        return redirect()->route('articles.index')
            ->with('success', 'Article updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Article $article)
    {
        // Delete image if exists
        if ($article->image && Storage::exists('public/' . $article->image)) {
            Storage::delete('public/' . $article->image);
        }

        $article->delete();

        return redirect()->route('articles.index')
            ->with('success', 'Article deleted successfully!');
    }
}

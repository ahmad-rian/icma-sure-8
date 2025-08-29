<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Country;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CountryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get('search');
        
        $countries = Country::query()
            ->when($search, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Country/Index', [
            'countries' => $countries,
            'search' => $search,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Country/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:countries,name',
            'code' => 'required|string|max:3|unique:countries,code',
            'iso_code' => 'required|string|max:3|unique:countries,iso_code',
            'phone_code' => 'required|string|max:10|unique:countries,phone_code',
        ]);

        Country::create($validated);

        return redirect()->route('admin.countries.index')
            ->with('success', 'Country created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Country $country)
    {
        // Load counts for statistics
        $country->loadCount([
            'userProfiles',
            'abstractSubmissions', 
            'submissionContributors'
        ]);

        return Inertia::render('Admin/Country/Show', [
            'country' => $country
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Country $country)
    {
        return Inertia::render('Admin/Country/Edit', [
            'country' => $country
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Country $country)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:countries,name,' . $country->id,
            'code' => 'required|string|max:3|unique:countries,code,' . $country->id,
            'iso_code' => 'required|string|max:3|unique:countries,iso_code,' . $country->id,
            'phone_code' => 'required|string|max:10|unique:countries,phone_code,' . $country->id,
        ]);

        $country->update($validated);

        return redirect()->route('admin.countries.show', $country)
            ->with('success', 'Country updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Country $country)
    {
        try {
            $country->delete();
            return redirect()->route('admin.countries.index')
                ->with('success', 'Country deleted successfully!');
        } catch (\Exception $e) {
            return redirect()->route('admin.countries.index')
                ->with('error', 'Cannot delete country. It may be referenced by other records.');
        }
    }

    /**
     * Bulk delete countries
     */
    public function bulkDelete(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:countries,id'
        ]);

        try {
            Country::whereIn('id', $validated['ids'])->delete();
            return redirect()->route('admin.countries.index')
                ->with('success', count($validated['ids']) . ' countries deleted successfully!');
        } catch (\Exception $e) {
            return redirect()->route('admin.countries.index')
                ->with('error', 'Cannot delete some countries. They may be referenced by other records.');
        }
    }
}
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Tenant;

class WorkspaceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $tenants = Tenant::where('user_id', $request->user()->id)->get();

        return Inertia::render('Dashboard', [
            'tenants' => $tenants
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('RegisterOrganization');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'subdomain' => 'required|string|alpha_dash|max:50|unique:domains,domain',
        ]);
        $domainName = $validated['subdomain'] . '.localhost';

        if (Tenant::where('id', $validated['subdomain'])->exists()) {
            return back()->withErrors(['subdomain' => 'This workspace URL is already taken.']);
        }

        $tenant = Tenant::create([
            'id' => $validated['subdomain'],
            'company_name' => $validated['company_name'],
            'user_id' => $request->user()->id,
        ]);
        
        $tenant->domains()->create(['domain' => $domainName]);

        $tenant->run(function () use ($request) {
            \Illuminate\Support\Facades\DB::table('users')->insert([
                'name' => $request->user()->name,
                'email' => $request->user()->email,
                'password' => $request->user()->password, 
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });

        return Inertia::location('http://' . $domainName . ':8000/login');
    }
    

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

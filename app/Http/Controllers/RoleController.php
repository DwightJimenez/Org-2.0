<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Tenant/Admin/Roles', [
            'tenantId' => tenant('id'),
            'roles' => Role::with('permissions')->get(),
            'allPermissions' => Permission::all()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function updatePermissions(Role $role, Request $request)
    {
        $request->validate([
            'permission' => 'required|string|exists:permissions,name',
            'assigned' => 'required|boolean'
        ]);

        if ($role->name === 'Admin') {
            abort(403, 'System Admin permissions cannot be modified.');
        }

        if ($request->assigned) {
            $role->givePermissionTo($request->permission);
        } else {
            $role->revokePermissionTo($request->permission);
        }

        return back();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50|unique:roles,name'
        ], [
            'name.unique' => 'A role with this name already exists.'
        ]);

        Role::create(['name' => $request->name]);

        return back()->with('success', 'Custom role created successfully.');
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

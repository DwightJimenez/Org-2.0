<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class DirectoryController extends Controller
{
    public function index(Request $request)
    {
        $users = User::with('roles')->orderBy('name')->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->first()->name ?? 'Member',
                'joined' => $user->created_at->format('M d, Y'),
            ];
        });

        return Inertia::render('Tenant/Admin/Directory', [
            'tenantName' => tenant('company_name') ?? tenant('id'),
            'users' => $users,
            'availableRoles' => Role::pluck('name'),
            'currentUserId' => $request->user()->id,
            'canManageRoles' => $request->user()->can('manage_roles'),
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|string|exists:roles,name'
        ]);

        if (!$request->user()->hasRole('Admin') && !$request->user()->can('manage_roles')) {
            abort(403, 'You do not have permission to manage roles.');
        }
        if ($user->hasRole('Admin')) {
            return back()->withErrors(['role' => 'Admin roles cannot be modified.']);
        }

        if ($user->id === $request->user()->id) {
            return back()->withErrors(['role' => 'You cannot change your own role.']);
        }

        $user->syncRoles([$request->role]);

        return back()->with('success', 'Role updated successfully.');
    }

    /**
     * Invite a new member: create the account with a random password,
     * assign the role, then email a link so they can set their own password.
     */
    public function invite(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'role' => 'required|string|exists:roles,name',
        ]);

        $user = DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make(Str::random(40)),
            ]);

            $user->assignRole($data['role']);

            return $user;
        });

        // Sends the standard "set your password" email.
        $status = Password::sendResetLink(['email' => $user->email]);

        if ($status !== Password::RESET_LINK_SENT) {
            return back()->with('error', "{$user->name} was added, but the invitation email could not be sent.");
        }

        return back()->with('success', "Invitation sent to {$user->email}.");
    }

    /**
     * Revoke a member's access by removing them from the organization.
     */
    public function destroy(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            return back()->with('error', 'You cannot revoke your own access.');
        }

        // Don't allow removing the last Admin.
        if ($user->hasRole('Admin') && User::role('Admin')->count() <= 1) {
            return back()->with('error', 'You cannot remove the last Admin.');
        }

        $name = $user->name;

        DB::transaction(function () use ($user) {
            $user->syncRoles([]);
            $user->tokens()?->delete(); // Sanctum tokens, if you use them
            $user->delete();
        });

        return back()->with('success', "{$name}'s access has been revoked.");
    }
}

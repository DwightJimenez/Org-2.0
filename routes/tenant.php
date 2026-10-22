<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\DirectoryController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\IngestionController;
use App\Http\Controllers\KnowledgeQueryController;

Route::middleware([
    'web',
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
])->group(function () {

    Route::get('/', function () {
        return Inertia::render('Tenant/TenantWelcome', [
            'tenantName' => tenant('company_name') ?? tenant('id'),
            'canLogin' => true,
            'canRegister' => true,
        ]);
    })->name('tenant.welcome');


    Route::middleware('guest')->group(function () {
        Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('tenant.login');
        Route::post('login', [AuthenticatedSessionController::class, 'store']);

        Route::get('register', [RegisteredUserController::class, 'create'])->name('tenant.register');
        Route::post('register', [RegisteredUserController::class, 'store']);
    });


    Route::middleware(['auth', 'verified'])->group(function () {

        // Logout
        Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('tenant.logout');

        // Dashboards & Workspaces
        Route::get('/dashboard', function () {
            return Inertia::render('Tenant/TenantDashboard', [
                'tenantId' => tenant('id'),
                'tenantName' => tenant('company_name') ?? tenant('id')
            ]);
        })->name('tenant.dashboard');

        Route::get('/workspace', function () {
            return Inertia::render('Tenant/AdminWorkspace', [
                'tenantId' => tenant('id'),
            ]);
        })->name('workspace');

        // Settings
        Route::prefix('settings')->name('settings.')->group(function () {
            Route::get('/layout', function () {
                return Inertia::render('Tenant/TenantDashboardBuilder', [
                    'tenantName' => tenant('company_name') ?? tenant('id')
                ]);
            })->name('layout');

            Route::get('/appearance', function () {
                return Inertia::render('Tenant/Settings/Appearance', [
                    'tenantName' => tenant('company_name') ?? tenant('id')
                ]);
            })->name('appearance');
        });

        // Admin Management
        Route::prefix('admin')->group(function () {
            Route::get('/directory', [DirectoryController::class, 'index'])->name('directory');
            Route::put('/directory/{user}/role', [DirectoryController::class, 'updateRole'])->name('directory.role.update');
            Route::post('/directory/invite', [DirectoryController::class, 'invite'])->name('directory.invite');
            Route::delete('/directory/{user}', [DirectoryController::class, 'destroy'])->name('directory.destroy');


            Route::get('/roles', [RoleController::class, 'index'])->name('admin.roles');
            Route::post('/roles', [RoleController::class, 'store'])->name('admin.roles.store');
            Route::put('/roles/{role}/permissions', [RoleController::class, 'updatePermissions'])->name('admin.roles.permissions.update');

            Route::post('/admin/ingest', [IngestionController::class, 'store'])->name('document.ingest');

            Route::post('/knowledge/query', [KnowledgeQueryController::class, 'ask'])->name('knowledge.query');
            Route::get('/knowledge/status', [KnowledgeQueryController::class, 'checkStatus'])->name('knowledge.status');
        });
    });
});

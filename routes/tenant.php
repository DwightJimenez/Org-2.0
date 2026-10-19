<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;

/*
|--------------------------------------------------------------------------
| Tenant Routes
|--------------------------------------------------------------------------
|
| Here you can register the tenant routes for your application.
| These routes are loaded by the TenantRouteServiceProvider.
|
| Feel free to customize them however you want. Good luck!
|
*/

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
    });

    Route::middleware('guest')->group(function () {
        Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
        Route::post('login', [AuthenticatedSessionController::class, 'store']);
        
        Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
        Route::post('register', [RegisteredUserController::class, 'store']);
    });

    // Logout Route
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout')
        ->middleware('auth');


    Route::get('/dashboard', function () {
        return Inertia::render('Tenant/TenantDashboard', [
            'tenantId' => tenant('id'),
            'tenantName' => tenant('company_name') ?? tenant('id')
        ]);
    })->middleware(['auth', 'verified'])->name('dashboard');
});

<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LegacyController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QuoteController;
use Illuminate\Support\Facades\Route;

// Public pages.
Route::controller(HomeController::class)->group(function () {
    Route::get('/', 'landing')->name('home');
    Route::get('/library', 'index')->name('library');
    Route::get('/museum', 'museum')->name('museum');
});

Route::get('/legacy', [LegacyController::class, 'index'])->name('legacy');

// Authentication.
Route::middleware('guest')->group(function () {
    Route::get('/signup', [AuthController::class, 'showSignup'])->name('signup');
    Route::post('/signup', [AuthController::class, 'register'])
        ->middleware('throttle:5,1')
        ->name('signup.store');

    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:5,1')
        ->name('login.store');
});

Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth')
    ->name('logout');

// Profiles.
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile');
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])
        ->name('profile.avatar');

    // Quote interactions and management.
    Route::post('/quotes/{quote}/like', [LikeController::class, 'toggle'])
        ->name('quotes.like');
    Route::post('/quotes/{quote}/favorite', [FavoriteController::class, 'toggle'])
        ->name('quotes.favorite');
    Route::post('/quotes', [QuoteController::class, 'store'])->name('quotes.store');
    Route::patch('/quotes/{quote}', [QuoteController::class, 'update'])
        ->name('quotes.update');
    Route::delete('/quotes/{quote}', [QuoteController::class, 'destroy'])
        ->name('quotes.destroy');

    // Admin and owner pages. Owners pass the admin middleware by design.
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('dashboard');

        Route::middleware('role:owner')->group(function () {
            Route::post('/admins', [AdminController::class, 'storeAdmin'])
                ->name('admins.store');
            Route::patch('/admins/{user}/revoke', [AdminController::class, 'revokeAdmin'])
                ->name('admins.revoke');
        });
    });

    // Only admins and owners can manage the eternal legacy hall.
    Route::middleware('role:admin')->prefix('legacy')->name('legacy.')->group(function () {
        Route::post('/', [LegacyController::class, 'store'])->name('store');
        Route::patch('/{legacyQuote}', [LegacyController::class, 'update'])
            ->name('update');
        Route::delete('/{legacyQuote}', [LegacyController::class, 'destroy'])
            ->name('destroy');
    });
});

// Public author pages.
Route::get('/authors/{user}', [ProfileController::class, 'show'])->name('authors.show');

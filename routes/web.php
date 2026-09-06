<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\BusinessPillarController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\FollowUpController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\OpportunityController;
use App\Http\Controllers\OutreachController;
use App\Http\Controllers\PerformanceController;
use App\Http\Controllers\PipelineController;
use App\Http\Controllers\TargetAccountController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    // master data
    Route::resource('users', UserController::class);
    Route::resource('accounts', AccountController::class);
    Route::resource('contacts', ContactController::class);
    Route::resource('business-pillars', BusinessPillarController::class);
    Route::post('target-accounts/{targetAccount}/assign', [TargetAccountController::class, 'assign'])->name('target-accounts.assign');
    Route::resource('target-accounts', TargetAccountController::class);
    Route::resource('outreach', OutreachController::class);
    Route::resource('activities', ActivityController::class);
    Route::resource('leads', LeadController::class);
    Route::patch('/leads/{lead}/qualify', [LeadController::class, 'qualify'])
        ->name('leads.qualify');

    Route::prefix('opportunities')->name('opportunities.')->group(function () {
        Route::get('/', [OpportunityController::class, 'index'])->name('index');
        Route::get('/board', [OpportunityController::class, 'board'])->name('board'); // <-- tambahkan
        Route::get('/create', [OpportunityController::class, 'create'])->name('create');
        Route::post('/', [OpportunityController::class, 'store'])->name('store');
        Route::post('/bulk-delete', [OpportunityController::class, 'bulkDelete'])->name('bulk-delete');
        Route::get('/{opportunity}', [OpportunityController::class, 'show'])->name('show');
        Route::get('/{opportunity}/edit', [OpportunityController::class, 'edit'])->name('edit');
        Route::patch('/{opportunity}', [OpportunityController::class, 'update'])->name('update');
        Route::delete('/{opportunity}', [OpportunityController::class, 'destroy'])->name('destroy');
        Route::patch('/{opportunity}/stage', [OpportunityController::class, 'updateStage'])->name('update-stage');
    });
    // Module Follow Ups
    Route::prefix('follow-ups')->name('follow-ups.')->group(function () {
        Route::get('/', [FollowUpController::class, 'index'])->name('index');
        Route::get('/create', [FollowUpController::class, 'create'])->name('create');
        Route::post('/', [FollowUpController::class, 'store'])->name('store');
        Route::get('/{followUp}', [FollowUpController::class, 'show'])->name('show');
        Route::patch('/{followUp}/status', [FollowUpController::class, 'updateStatus'])->name('update-status');
    });
    Route::get('/pipeline/dashboard', [PipelineController::class, 'dashboard'])->name('pipeline.dashboard');;

    Route::get('/performance', [PerformanceController::class, 'index'])->name('performance.index');
});

require __DIR__.'/settings.php';
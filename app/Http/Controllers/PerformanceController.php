<?php

namespace App\Http\Controllers;

use App\Actions\Analytics\GetSalesPerformanceAction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PerformanceController extends Controller
{
    public function index(Request $request, GetSalesPerformanceAction $action): Response
    {
        // Jika Sales Rep, hanya tampilkan performansinya sendiri. Jika Manager/Admin, tampilkan semua.
        $userId = $request->user()->hasRole('Sales Rep') ? $request->user()->id : null;
        $performance = $action->execute($userId);

        return Inertia::render('performance/index', [
            'performance' => $performance,
        ]);
    }
}
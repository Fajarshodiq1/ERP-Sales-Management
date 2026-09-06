<?php

namespace App\Http\Controllers;

use App\Actions\Analytics\GetPipelineAnalyticsAction;
use App\Models\FollowUp;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PipelineController extends Controller
{
    public function dashboard(Request $request, GetPipelineAnalyticsAction $action): Response
    {
        $userId = $request->user()->hasRole('Sales Rep') ? $request->user()->id : null;
        $analytics = $action->execute($userId);

        $pendingFollowUps = FollowUp::with(['account', 'subject', 'user'])
            ->when($userId, fn($q) => $q->where('user_id', $userId))
            ->where('status', 'pending')
            ->orderBy('due_date', 'asc')
            ->take(5)
            ->get();

        return Inertia::render('pipeline/dashboard', [
            'analytics' => $analytics,
            'pendingFollowUps' => $pendingFollowUps,
        ]);
    }
}
<?php

namespace App\Actions\Analytics;

use App\Models\Opportunity;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class GetSalesPerformanceAction
{
    public function execute(?int $userId = null): array
    {
        $query = User::role('Sales Rep')
            ->when($userId, fn($q) => $q->where('id', $userId))
            ->withCount(['activities', 'followUps']);

        $performanceData = $query->get()->map(function ($user) {
            $oppQuery = Opportunity::where('user_id', $user->id);

            $totalWon = (clone $oppQuery)->where('stage', 'closed_won')->count();
            $totalLost = (clone $oppQuery)->where('stage', 'closed_lost')->count();
            $totalClosed = $totalWon + $totalLost;

            $winRate = $totalClosed > 0 ? round(($totalWon / $totalClosed) * 100, 2) : 0;
            $revenueWon = (clone $oppQuery)->where('stage', 'closed_won')->sum('potential_value');
            $gpWon = (clone $oppQuery)->where('stage', 'closed_won')->sum('estimated_gp');

            return [
                'user_id' => $user->id,
                'user_name' => $user->name,
                'total_activities' => $user->activities_count,
                'total_followups' => $user->follow_ups_count,
                'deals_won' => $totalWon,
                'deals_lost' => $totalLost,
                'win_rate' => $winRate,
                'total_revenue' => (float) $revenueWon,
                'total_gp' => (float) $gpWon,
            ];
        });

        return [
            'sales_performance' => $performanceData,
            'summary' => [
                'total_revenue_achieved' => $performanceData->sum('total_revenue'),
                'total_gp_achieved' => $performanceData->sum('total_gp'),
                'avg_win_rate' => round($performanceData->avg('win_rate') ?? 0, 2),
            ],
        ];
    }
}
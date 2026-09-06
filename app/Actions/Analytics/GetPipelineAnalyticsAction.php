<?php

namespace App\Actions\Analytics;

use App\Models\Opportunity;
use Illuminate\Support\Facades\DB;

class GetPipelineAnalyticsAction
{
    public function execute(?int $userId = null): array
    {
        $query = Opportunity::query();

        if ($userId) {
            $query->where('user_id', $userId);
        }

        // 1. Calculations
        $totalPipeline = (clone $query)->whereNotIn('stage', ['closed_won', 'closed_lost'])->sum('potential_value');

        $weightedRevenue = (clone $query)->whereNotIn('stage', ['closed_won', 'closed_lost'])
            ->selectRaw('SUM(potential_value * (probability / 100)) as weighted')
            ->value('weighted') ?? 0;

        $totalEstimatedGp = (clone $query)->whereNotIn('stage', ['closed_won', 'closed_lost'])->sum('estimated_gp');

        // 2. Stage Breakdown
        $stageBreakdown = (clone $query)
            ->select('stage', DB::raw('count(*) as count'), DB::raw('SUM(potential_value) as total_value'))
            ->groupBy('stage')
            ->get();

        return [
            'total_pipeline' => (float) $totalPipeline,
            'weighted_revenue' => (float) $weightedRevenue,
            'estimated_gp' => (float) $totalEstimatedGp,
            'stage_breakdown' => $stageBreakdown,
        ];
    }
}
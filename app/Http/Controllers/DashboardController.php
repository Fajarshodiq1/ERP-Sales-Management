<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Activity;
use App\Models\BusinessPillar;
use App\Models\Lead;
use App\Models\Opportunity;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $isSalesRep = $user->hasRole('Sales Rep');
        $canFilterByRep = $user->hasRole(['Admin', 'Sales Manager']);

        // ---- Filters ----
        $from = $request->filled('from')
            ? Carbon::parse($request->query('from'))->startOfDay()
            : now()->subDays(29)->startOfDay();

        $to = $request->filled('to')
            ? Carbon::parse($request->query('to'))->endOfDay()
            : now()->endOfDay();

        $businessPillarId = $request->query('business_pillar_id');
        $salesRepId = $canFilterByRep ? $request->query('sales_rep_id') : null;

        // Bandingkan ke periode sebelumnya (untuk trend KPI)
        $daysDiff = $from->diffInDays($to) + 1;
        $prevFrom = (clone $from)->subDays($daysDiff);
        $prevTo = (clone $from)->subSecond();

        $applyFilters = function ($query, string $dateColumn, bool $hasDirectPillar = true) use ($isSalesRep, $user, $businessPillarId, $salesRepId, $from, $to) {
            $query->whereBetween($dateColumn, [$from, $to]);

            if ($isSalesRep) {
                $query->where('user_id', $user->id);
            } elseif ($salesRepId) {
                $query->where('user_id', $salesRepId);
            }

            if ($businessPillarId) {
                if ($hasDirectPillar) {
                    $query->where('business_pillar_id', $businessPillarId);
                } else {
                    // Activity tidak punya business_pillar_id langsung,
                    // filter lewat relasi account
                    $query->whereHas('account', function ($q) use ($businessPillarId) {
                        $q->where('business_pillar_id', $businessPillarId);
                    });
                }
            }

            return $query;
        };

        $applyPrevFilters = function ($query, string $dateColumn, bool $hasDirectPillar = true) use ($isSalesRep, $user, $businessPillarId, $salesRepId, $prevFrom, $prevTo) {
            $query->whereBetween($dateColumn, [$prevFrom, $prevTo]);

            if ($isSalesRep) {
                $query->where('user_id', $user->id);
            } elseif ($salesRepId) {
                $query->where('user_id', $salesRepId);
            }

            if ($businessPillarId) {
                if ($hasDirectPillar) {
                    $query->where('business_pillar_id', $businessPillarId);
                } else {
                    $query->whereHas('account', function ($q) use ($businessPillarId) {
                        $q->where('business_pillar_id', $businessPillarId);
                    });
                }
            }

            return $query;
        };
        // ---- KPI: current period ----
        $totalLeads = $applyFilters(Lead::query(), 'created_at')->count();
        $totalOpportunities = $applyFilters(Opportunity::query(), 'created_at')->count();
        $pipelineValue = (float) $applyFilters(Opportunity::query(), 'created_at')
            ->whereNotIn('stage', ['Closed Won', 'Closed Lost'])
            ->sum('potential_value');
        $wonValue = (float) $applyFilters(Opportunity::query(), 'created_at')
            ->where('stage', 'Closed Won')
            ->sum('potential_value');

        // ---- KPI: previous period (untuk trend %) ----
        $prevLeads = $applyPrevFilters(Lead::query(), 'created_at')->count();
        $prevOpportunities = $applyPrevFilters(Opportunity::query(), 'created_at')->count();
        $prevPipelineValue = (float) $applyPrevFilters(Opportunity::query(), 'created_at')
            ->whereNotIn('stage', ['Closed Won', 'Closed Lost'])
            ->sum('potential_value');
        $prevWonValue = (float) $applyPrevFilters(Opportunity::query(), 'created_at')
            ->where('stage', 'Closed Won')
            ->sum('potential_value');

        $trend = function (float $current, float $previous): array {
            if ($previous == 0.0) {
                return ['percent' => $current > 0 ? 100 : 0, 'direction' => $current >= 0 ? 'up' : 'down'];
            }
            $percent = (($current - $previous) / $previous) * 100;

            return ['percent' => round(abs($percent), 1), 'direction' => $percent >= 0 ? 'up' : 'down'];
        };

        // ---- Opportunities by stage ----
        $opportunitiesByStage = $applyFilters(Opportunity::query(), 'created_at')
            ->select('stage', DB::raw('COUNT(*) as total'), DB::raw('SUM(potential_value) as value'))
            ->groupBy('stage')
            ->get()
            ->map(fn($row) => [
                'stage' => $row->stage,
                'total' => (int) $row->total,
                'value' => (float) $row->value,
            ]);

        // ---- Leads by status ----
        $leadsByStatus = $applyFilters(Lead::query(), 'created_at')
            ->select('status', DB::raw('COUNT(*) as total'))
            ->groupBy('status')
            ->get()
            ->map(fn($row) => [
                'status' => $row->status,
                'total' => (int) $row->total,
            ]);

        // ---- Daily trend within selected range ----
        $dailyTrend = $applyFilters(Opportunity::query(), 'created_at')
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(potential_value) as value'),
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn($row) => [
                'date' => $row->date,
                'value' => (float) $row->value,
                'total' => (int) $row->total,
            ]);

        // ---- Top sales performance (Admin/Manager only) ----
        $topSales = collect();
        if ($canFilterByRep) {
            $topSales = $applyFilters(Opportunity::query(), 'created_at')
                ->select('user_id', DB::raw('COUNT(*) as total'), DB::raw('SUM(potential_value) as value'))
                ->groupBy('user_id')
                ->orderByDesc('value')
                ->with('user:id,name')
                ->limit(5)
                ->get()
                ->map(fn($row) => [
                    'name' => $row->user?->name ?? '-',
                    'total' => (int) $row->total,
                    'value' => (float) $row->value,
                ]);
        }

        $recentActivities = $applyFilters(Activity::query(), 'performed_at', false)
            ->with(['account:id,company_name', 'user:id,name'])
            ->latest('performed_at')
            ->limit(6)
            ->get()
            ->map(fn($a) => [
                'id' => $a->id,
                'type' => $a->type,
                'result' => $a->result,
                'performed_at' => optional($a->performed_at)->diffForHumans(),
                'account' => $a->account?->company_name,
                'user' => $a->user?->name,
            ]);

        return Inertia::render('dashboard', [
            'filters' => [
                'from' => $from->toDateString(),
                'to' => $to->toDateString(),
                'business_pillar_id' => $businessPillarId,
                'sales_rep_id' => $salesRepId,
            ],
            'canFilterByRep' => $canFilterByRep,
            'businessPillars' => BusinessPillar::select('id', 'name')->orderBy('name')->get(),
            'salesReps' => $canFilterByRep
                ? User::role('Sales Rep')->select('id', 'name')->orderBy('name')->get()
                : [],
            'kpi' => [
                'totalAccounts' => Account::count(),
                'totalLeads' => $totalLeads,
                'totalOpportunities' => $totalOpportunities,
                'pipelineValue' => $pipelineValue,
                'wonValue' => $wonValue,
                'trends' => [
                    'leads' => $trend($totalLeads, $prevLeads),
                    'opportunities' => $trend($totalOpportunities, $prevOpportunities),
                    'pipelineValue' => $trend($pipelineValue, $prevPipelineValue),
                    'wonValue' => $trend($wonValue, $prevWonValue),
                ],
            ],
            'opportunitiesByStage' => $opportunitiesByStage,
            'leadsByStatus' => $leadsByStatus,
            'dailyTrend' => $dailyTrend,
            'topSales' => $topSales,
            'recentActivities' => $recentActivities,
        ]);
    }
}
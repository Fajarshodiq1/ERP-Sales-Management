<?php

namespace App\Http\Controllers;

use App\Actions\Opportunities\ConvertLeadToOpportunityAction;
use App\Actions\Opportunities\UpdateOpportunityStageAction;
use App\Data\ConvertLeadData;
use App\Data\UpdateOpportunityData;
use App\Data\UpdateOpportunityStageData;
use App\Models\BusinessPillar;
use App\Models\Lead;
use App\Models\Opportunity;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class OpportunityController extends Controller
{
    public function index(Request $request): Response
    {
        $query = QueryBuilder::for(Opportunity::class)
            ->with(['account', 'contact', 'businessPillar', 'user'])
            ->allowedFilters(
                'stage',
                AllowedFilter::exact('business_pillar_id'),
                AllowedFilter::exact('user_id'),
            );

        if ($request->user()->hasRole('Sales Rep')) {
            $query->where('user_id', $request->user()->id);
        }

        return Inertia::render('opportunities/index', [
            'opportunities' => $query->defaultSort('-created_at')->paginate(10)->withQueryString(),
        ]);
    }

    public function create(Request $request): Response
    {
        $lead = null;
        if ($request->has('lead_id')) {
            $lead = Lead::with(['account', 'contact', 'businessPillar'])->findOrFail($request->query('lead_id'));
        }

        return Inertia::render('opportunities/form', [
            'lead' => $lead,
        ]);
    }

    public function store(Request $request, ConvertLeadToOpportunityAction $action)
    {
        $data = ConvertLeadData::validateAndCreate($request->all());
        $opportunity = $action->execute($data);

        return redirect()->route('opportunities.show', $opportunity->id)
            ->with('success', 'Opportunity successfully converted and initialized.');
    }

    public function show(Opportunity $opportunity): Response
    {
        $opportunity->load(['account', 'contact', 'businessPillar', 'user', 'activities', 'followUps']);

        return Inertia::render('opportunities/show', [
            'opportunity' => $opportunity,
        ]);
    }

    public function edit(Opportunity $opportunity): Response
    {
        $opportunity->load(['account', 'contact', 'businessPillar', 'user']);

        return Inertia::render('opportunities/edit', [
            'opportunity' => $opportunity,
            'businessPillars' => BusinessPillar::select('id', 'name')->get(),
            'users' => User::select('id', 'name')->get(),
        ]);
    }

    public function update(Request $request, Opportunity $opportunity)
    {
        $data = UpdateOpportunityData::validateAndCreate($request->all());

        $opportunity->update([
            'opportunity_name' => $data->opportunity_name,
            'potential_value' => $data->potential_value,
            'estimated_gp' => $data->estimated_gp,
            'probability' => $data->probability,
            'stage' => $data->stage,
            'expected_closing_date' => $data->expected_closing_date,
            'description' => $data->description,
            'business_pillar_id' => $data->business_pillar_id,
            'user_id' => $data->user_id,
        ]);

        return redirect()->route('opportunities.show', $opportunity->id)
            ->with('success', 'Opportunity updated successfully.');
    }

    public function destroy(Opportunity $opportunity)
    {
        $opportunity->delete();

        return redirect()->route('opportunities.index')
            ->with('success', 'Opportunity deleted successfully.');
    }

    public function board(Request $request): Response
    {
        $query = Opportunity::query()
            ->with(['account', 'contact', 'businessPillar', 'user'])
            ->whereNotIn('stage', ['closed_won', 'closed_lost']); // opsional: sembunyikan yang sudah closed

        if ($request->user()->hasRole('Sales Rep')) {
            $query->where('user_id', $request->user()->id);
        }

        return Inertia::render('opportunities/kanban', [
            'opportunities' => $query->orderBy('created_at', 'desc')->get(),
        ]);
    }
    public function bulkDelete(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'exists:opportunities,id',
        ]);

        Opportunity::whereIn('id', $validated['ids'])->delete();

        return back()->with('success', count($validated['ids']) . ' opportunity berhasil dihapus.');
    }

    public function updateStage(Request $request, Opportunity $opportunity, UpdateOpportunityStageAction $action)
    {
        $data = UpdateOpportunityStageData::validateAndCreate($request->all());
        $action->execute($opportunity, $data);

        return back()->with('success', 'Opportunity stage updated.');
    }
}
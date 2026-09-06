<?php

namespace App\Http\Controllers;

use App\Actions\Leads\CreateLeadAction;
use App\Actions\Leads\QualifyLeadAction;
use App\Data\CreateLeadData;
use App\Data\QualifyLeadData;
use App\Models\Account;
use App\Models\BusinessPillar;
use App\Models\Contact;
use App\Models\Lead;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class LeadController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Lead::class);

        $query = QueryBuilder::for(Lead::class)
            ->with(['account', 'contact', 'businessPillar', 'user'])
            ->allowedFilters(
                'status',
                'lead_source',
                AllowedFilter::exact('business_pillar_id'),
                AllowedFilter::exact('user_id'),
            );

        // Scoping Data: Sales Rep hanya bisa akses Lead milik sendiri
        if ($request->user()->hasRole('Sales Rep')) {
            $query->where('user_id', $request->user()->id);
        }

        return Inertia::render('leads/index', [
            'leads' => $query->defaultSort('-created_at')->paginate(10)->withQueryString(),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Lead::class);

        return Inertia::render('leads/form', [
            'accounts' => Account::select('id', 'company_name')->get(),
            'contacts' => Contact::select('id', 'account_id', 'name')->get(),
            'businessPillars' => BusinessPillar::where('status', 'active')->select('id', 'name')->get(),
            'users' => User::select('id', 'name')->get(),
        ]);
    }
    public function store(Request $request, CreateLeadAction $action)
    {
        Gate::authorize('create', Lead::class);
        $data = CreateLeadData::validateAndCreate($request->all());

        $action->execute($data);

        return redirect()->route('leads.index')->with('success', 'Lead successfully created.');
    }

    public function show(Lead $lead): Response
    {
        Gate::authorize('view', $lead);
        $lead->load(['account', 'contact', 'businessPillar', 'user', 'sourceable']);

        return Inertia::render('leads/show', [
            'lead' => $lead,
        ]);
    }
    public function edit(Lead $lead): Response
    {
        Gate::authorize('update', $lead);

        $lead->load(['account', 'contact', 'businessPillar', 'user']);

        return Inertia::render('leads/form', [
            'lead' => $lead,
            'accounts' => Account::select('id', 'company_name')->get(),
            'contacts' => Contact::select('id', 'account_id', 'name')->get(),
            'businessPillars' => BusinessPillar::where('status', 'active')->select('id', 'name')->get(),
            'users' => User::select('id', 'name')->get(),
        ]);
    }

    public function update(Request $request, Lead $lead): RedirectResponse
    {
        Gate::authorize('update', $lead);

        $data = CreateLeadData::validateAndCreate($request->all());

        $lead->update($data->toArray());

        return redirect()->route('leads.index')->with('success', 'Lead successfully updated.');
    }
    public function qualify(Request $request, Lead $lead, QualifyLeadAction $action)
    {
        Gate::authorize('qualify', $lead);
        $data = QualifyLeadData::validateAndCreate($request->all());

        $action->execute($lead, $data);

        return back()->with('success', 'Lead qualification status updated.');
    }
}
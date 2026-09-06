<?php

namespace App\Http\Controllers;

use App\Actions\TargetAccount\AssignSalesAction;
use App\Actions\TargetAccount\CreateTargetAccountAction;
use App\Data\TargetAccountData;
use App\Models\Account;
use App\Models\BusinessPillar;
use App\Models\TargetAccount;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class TargetAccountController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', TargetAccount::class);

        $targetAccounts = QueryBuilder::for(TargetAccount::class)
            ->forUser($request->user())
            ->with(['account', 'businessPillar', 'assignedSales']) // Eager load relasi default
            ->allowedFilters(
                'priority',
                'status',
                AllowedFilter::exact('business_pillar_id'),
                AllowedFilter::exact('assigned_sales_id')
            )
            ->allowedIncludes('account', 'businessPillar', 'assignedSales')
            ->defaultSort('-created_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('target-accounts/index', [
            'targetAccounts' => $targetAccounts,
            'salesList' => User::role(['Sales Rep', 'Sales Manager'])->where('status', 'active')->get(['id', 'name']),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', TargetAccount::class);

        return Inertia::render('target-accounts/form', [
            'accounts' => Account::where('status', 'active')->get(['id', 'company_name']),
            'businessPillars' => BusinessPillar::where('status', 'active')->get(['id', 'name']),
            'salesList' => User::role(['Sales Rep', 'Sales Manager'])->where('status', 'active')->get(['id', 'name']),
        ]);
    }

    public function store(TargetAccountData $data, CreateTargetAccountAction $action): RedirectResponse
    {
        Gate::authorize('create', TargetAccount::class);

        $action->execute($data);

        return redirect('/target-accounts')->with('success', 'Target Account berhasil dibuat.');
    }

    public function show(TargetAccount $targetAccount): Response
    {
        Gate::authorize('view', $targetAccount);

        return Inertia::render('target-accounts/show', [
            'targetAccount' => $targetAccount->load(['account.contacts', 'businessPillar', 'assignedSales']),
        ]);
    }

    public function edit(TargetAccount $targetAccount): Response
    {
        Gate::authorize('update', $targetAccount);

        return Inertia::render('target-accounts/form', [
            'targetAccount' => $targetAccount,
            'accounts' => Account::where('status', 'active')->get(['id', 'company_name']),
            'businessPillars' => BusinessPillar::where('status', 'active')->get(['id', 'name']),
            'salesList' => User::role(['Sales Rep', 'Sales Manager'])->where('status', 'active')->get(['id', 'name']),
        ]);
    }

    public function update(TargetAccountData $data, TargetAccount $targetAccount, CreateTargetAccountAction $action): RedirectResponse
    {
        Gate::authorize('update', $targetAccount);

        $action->execute($data, $targetAccount);

        return redirect('/target-accounts')->with('success', 'Target Account berhasil diperbarui.');
    }

    public function assign(Request $request, TargetAccount $targetAccount, AssignSalesAction $action): RedirectResponse
    {
        Gate::authorize('assignSales', TargetAccount::class);

        $request->validate(['assigned_sales_id' => 'required|exists:users,id']);

        $action->execute($targetAccount, (int) $request->assigned_sales_id);

        return back()->with('success', 'Sales Rep berhasil di-assign.');
    }
}
<?php

namespace App\Http\Controllers;

use App\Actions\Account\UpsertAccountAction;
use App\Data\AccountData;
use App\Models\Account;
use App\Models\BusinessPillar;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class AccountController extends Controller
{
    public function index(): Response
    {
        $accounts = QueryBuilder::for(Account::class)
            ->with(['businessPillar'])
            ->allowedFilters(
                'company_name',
                'industry',
                'email',
                'phone',
                'status',
                AllowedFilter::exact('business_pillar_id')
            )
            ->allowedIncludes('businessPillar', 'contacts')
            ->defaultSort('-created_at')
            ->paginate(request('per_page', 100))
            ->withQueryString();

        return Inertia::render('accounts/index', [
            'accounts' => $accounts,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('accounts/form', [
            'businessPillars' => BusinessPillar::where('status', 'active')->get(['id', 'name']),
        ]);
    }

    public function store(AccountData $data, UpsertAccountAction $action): RedirectResponse
    {
        $action->execute($data);

        return redirect()->route('accounts.index')->with('success', 'Account berhasil dibuat.');
    }

    public function show(Account $account): Response
    {
        return Inertia::render('accounts/show', [
            'account' => $account->load(['businessPillar', 'contacts']),
        ]);
    }

    public function edit(Account $account): Response
    {
        return Inertia::render('accounts/form', [
            'account' => $account,
            'businessPillars' => BusinessPillar::where('status', 'active')->get(['id', 'name']),
        ]);
    }

    public function update(AccountData $data, Account $account, UpsertAccountAction $action): RedirectResponse
    {
        $action->execute($data, $account);

        return redirect()->route('accounts.index')->with('success', 'Account berhasil diperbarui.');
    }

    public function destroy(Account $account): RedirectResponse
    {
        $account->delete();

        return redirect()->route('accounts.index')->with('success', 'Account berhasil dihapus.');
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer', 'exists:accounts,id'],
        ]);

        Account::whereIn('id', $request->input('ids'))->delete();

        return redirect()->route('accounts.index')->with('success', 'Account terpilih berhasil dihapus.');
    }

    public function export()
    {
        $accounts = Account::with('businessPillar')->get();

        $filename = 'accounts_export_' . date('Y-m-d_H-i-s') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($accounts) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Company Name', 'Email', 'Phone', 'Website', 'Industry', 'Pillar', 'Status', 'Address']);

            foreach ($accounts as $account) {
                fputcsv($file, [
                    $account->id,
                    $account->company_name,
                    $account->email,
                    $account->phone,
                    $account->website,
                    $account->industry,
                    $account->businessPillar?->name ?? '-',
                    $account->status,
                    $account->address,
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
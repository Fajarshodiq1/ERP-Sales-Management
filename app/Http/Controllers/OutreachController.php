<?php

namespace App\Http\Controllers;

use App\Actions\Outreach\LogOutreachAction;
use App\Data\OutreachData;
use App\Models\Contact;
use App\Models\Outreach;
use App\Models\TargetAccount;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class OutreachController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Outreach::class);

        $outreaches = QueryBuilder::for(Outreach::class)
            ->forUser($request->user())
            ->with(['targetAccount.account', 'contact', 'user'])
            ->allowedFilters(...[
                'channel',
                'result',
                AllowedFilter::exact('target_account_id'),
            ])
            ->allowedIncludes(...[
                'targetAccount.account',
                'contact',
                'user',
            ])
            ->defaultSort('-outreach_date')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('outreach/index', [
            'outreaches' => $outreaches,
        ]);
    }

    public function create(Request $request): Response
    {
        Gate::authorize('create', Outreach::class);

        $targetAccountId = $request->query('target_account_id');
        $contactId = $request->query('contact_id');

        return Inertia::render('outreach/form', [
            'targetAccounts' => TargetAccount::with('account')->forUser($request->user())->get(),
            'contacts' => $targetAccountId
                ? Contact::where('account_id', TargetAccount::find($targetAccountId)?->account_id)->get()
                : Contact::all(),
            'selectedTargetAccountId' => $targetAccountId ? (int) $targetAccountId : null,
            'selectedContactId' => $contactId ? (int) $contactId : null,
        ]);
    }

    public function store(OutreachData $data, Request $request, LogOutreachAction $action): RedirectResponse
    {
        Gate::authorize('create', Outreach::class);

        $action->execute($data, $request->user());

        return redirect('/outreach')->with('success', 'Log Outreach berhasil disimpan.');
    }

    public function edit(Outreach $outreach, Request $request): Response
    {
        Gate::authorize('update', $outreach);

        // Load relasi supaya form bisa menampilkan nilai awal (company name, contact name, dst)
        $outreach->load(['targetAccount.account', 'contact', 'user']);

        $targetAccountId = $outreach->target_account_id;

        return Inertia::render('outreach/form', [
            // dipakai form untuk tahu ini mode edit + prefill nilai
            'outreach' => $outreach,
            'targetAccounts' => TargetAccount::with('account')->forUser($request->user())->get(),
            'contacts' => $targetAccountId
                ? Contact::where(
                    'account_id',
                    TargetAccount::find($targetAccountId)?->account_id,
                )->get()
                : Contact::all(),
            'selectedTargetAccountId' => $targetAccountId,
            'selectedContactId' => $outreach->contact_id,
        ]);
    }

    public function update(OutreachData $data, Outreach $outreach, Request $request): RedirectResponse
    {
        Gate::authorize('update', $outreach);

        $outreach->update($data->toArray());

        return redirect('/outreach')->with('success', 'Log Outreach berhasil diperbarui.');
    }
}
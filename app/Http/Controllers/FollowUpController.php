<?php

namespace App\Http\Controllers;

use App\Actions\FollowUps\CreateFollowUpAction;
use App\Actions\FollowUps\UpdateFollowUpStatusAction;
use App\Data\CreateFollowUpData;
use App\Data\UpdateFollowUpStatusData;
use App\Models\Account;
use App\Models\Contact;
use App\Models\FollowUp;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class FollowUpController extends Controller
{
    public function index(): Response
    {
        $followUps = QueryBuilder::for(FollowUp::class)
            ->with(['user', 'account', 'contact', 'activity', 'subject'])
            ->allowedFilters(
                'status',
                AllowedFilter::exact('user_id'),
                AllowedFilter::exact('account_id'),
                AllowedFilter::exact('activity_id'),
            )
            ->defaultSort('due_date')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('follow-ups/index', [
            'followUps' => $followUps,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('follow-ups/form', [
            'accounts' => Account::select('id', 'company_name')->get(),
            'contacts' => Contact::select('id', 'account_id', 'name')->get(),
            'users' => User::select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request, CreateFollowUpAction $action)
    {
        $data = CreateFollowUpData::validateAndCreate($request->all());
        $action->execute($data);

        return redirect()->route('follow-ups.index')->with('success', 'Follow-up task scheduled successfully.');
    }

    public function show(FollowUp $followUp): Response
    {
        $followUp->load(['user', 'account', 'contact', 'activity', 'subject']);

        return Inertia::render('follow-ups/show', [
            'followUp' => $followUp,
        ]);
    }

    public function updateStatus(Request $request, FollowUp $followUp, UpdateFollowUpStatusAction $action)
    {
        $data = UpdateFollowUpStatusData::validateAndCreate($request->all());
        $action->execute($followUp, $data);

        return back()->with('success', 'Follow-up status updated.');
    }
}
<?php

namespace App\Http\Controllers;

use App\Actions\Activities\LogActivityAction;
use App\Data\ActivityData;
use App\Models\Account;
use App\Models\Activity;
use App\Models\Contact;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class ActivityController extends Controller
{
    public function index(): Response
    {
        $activities = QueryBuilder::for(Activity::class)
            ->with(['user', 'account', 'contact'])
            ->allowedFilters(
                'type',
                'result',
                AllowedFilter::exact('user_id'),
                AllowedFilter::exact('account_id')
            )
            ->defaultSort('-performed_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('activities/index', [
            'activities' => $activities,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('activities/form', [
            'accounts' => Account::select('id', 'company_name')->get(),
            'contacts' => Contact::select('id', 'account_id', 'name')->get(),
            'users' => User::select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request, LogActivityAction $action)
    {
        $data = ActivityData::validateAndCreate($request->all());
        $action->execute($data);

        return redirect()->route('activities.index')->with('success', 'Activity logged successfully.');
    }

    public function edit(Activity $activity): Response
    {
        return Inertia::render('activities/form', [
            'activity' => $activity,
            'accounts' => Account::select('id', 'company_name')->get(),
            'contacts' => Contact::select('id', 'account_id', 'name')->get(),
            'users' => User::select('id', 'name')->get(),
        ]);
    }

    public function show(Activity $activity): Response
    {
        $activity->load(['user', 'account', 'contact', 'followUp', 'subject']);

        return Inertia::render('activities/show', [
            'activity' => $activity,
        ]);
    }
}
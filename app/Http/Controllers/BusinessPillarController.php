<?php

namespace App\Http\Controllers;

use App\Actions\BusinessPillar\UpsertBusinessPillarAction;
use App\Data\BusinessPillarData;
use App\Models\BusinessPillar;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Spatie\QueryBuilder\QueryBuilder;

class BusinessPillarController extends Controller
{
    public function index(): Response
    {
        $pillars = QueryBuilder::for(BusinessPillar::class)
            ->allowedFilters('name', 'status') 
            ->defaultSort('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('business-pillars/index', [
            'pillars' => $pillars,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('business-pillars/form');
    }

    public function store(BusinessPillarData $data, UpsertBusinessPillarAction $action): RedirectResponse
    {
        $action->execute($data);

        return redirect()->route('business-pillars.index')->with('success', 'Business Pillar berhasil ditambahkan.');
    }

    public function edit(BusinessPillar $businessPillar): Response
    {
        return Inertia::render('business-pillars/form', [
            'pillar' => $businessPillar,
        ]);
    }

    public function update(BusinessPillarData $data, BusinessPillar $businessPillar, UpsertBusinessPillarAction $action): RedirectResponse
    {
        $action->execute($data, $businessPillar);

        return redirect()->route('business-pillars.index')->with('success', 'Business Pillar berhasil diperbarui.');
    }
    public function destroy(BusinessPillar $businessPillar): RedirectResponse
    {
        $businessPillar->delete();

        return redirect()->route('business-pillars.index')
            ->with('success', 'Business Pillar berhasil dihapus.');
    }
}
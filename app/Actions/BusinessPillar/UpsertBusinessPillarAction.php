<?php

namespace App\Actions\BusinessPillar;

use App\Data\BusinessPillarData;
use App\Models\BusinessPillar;
use Illuminate\Support\Facades\DB;

class UpsertBusinessPillarAction
{
    public function execute(BusinessPillarData $data, ?BusinessPillar $pillar = null): BusinessPillar
    {
        return DB::transaction(function () use ($data, $pillar) {
            return BusinessPillar::updateOrCreate(
                ['id' => $pillar?->id],
                $data->toArray()
            );
        });
    }
}
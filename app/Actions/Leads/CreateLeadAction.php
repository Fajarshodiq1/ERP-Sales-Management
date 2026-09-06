<?php

namespace App\Actions\Leads;

use App\Data\CreateLeadData;
use App\Models\Lead;
use Illuminate\Support\Facades\DB;

class CreateLeadAction
{
    public function execute(CreateLeadData $data): Lead
    {
        return DB::transaction(function () use ($data) {
            return Lead::create([
                ...$data->toArray(),
                'status' => 'unqualified',
            ]);
        });
    }
}
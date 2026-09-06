<?php

namespace App\Actions\Leads;

use App\Data\QualifyLeadData;
use App\Models\Lead;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class QualifyLeadAction
{
    public function execute(Lead $lead, QualifyLeadData $data): Lead
    {
        return DB::transaction(function () use ($lead, $data) {
            $isQualified = $data->status === 'qualified';

            $lead->update([
                'status' => $data->status,
                'potential_need' => $data->potential_need ?? $lead->potential_need,
                'notes' => $data->notes ?? $lead->notes,
                'qualified_at' => $isQualified ? Carbon::now() : null,
            ]);

            return $lead;
        });
    }
}
<?php

namespace App\Actions\Opportunities;

use App\Data\ConvertLeadData;
use App\Models\FollowUp;
use App\Models\Lead;
use App\Models\Opportunity;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ConvertLeadToOpportunityAction
{
    public function execute(ConvertLeadData $data): Opportunity
    {
        return DB::transaction(function () use ($data) {
            $lead = Lead::findOrFail($data->lead_id);

            // 1. Create Opportunity dari Lead
            $opportunity = Opportunity::create([
                'opportunity_name' => $data->opportunity_name,
                'lead_id' => $lead->id,
                'account_id' => $lead->account_id,
                'contact_id' => $lead->contact_id,
                'business_pillar_id' => $lead->business_pillar_id,
                'user_id' => $lead->user_id,
                'potential_value' => $data->potential_value,
                'probability' => $data->probability,
                'estimated_gp' => $data->estimated_gp,
                'stage' => 'prospecting',
                'expected_closing_date' => $data->expected_closing_date,
                'description' => $data->description,
            ]);

            // 2. Update Lead Status
            $lead->update(['status' => 'qualified']);

            // 3. Generate First Follow-Up Task Otomatis
            FollowUp::create([
                'user_id' => $opportunity->user_id,
                'account_id' => $opportunity->account_id,
                'contact_id' => $opportunity->contact_id,
                'subject_type' => Opportunity::class,
                'subject_id' => $opportunity->id,
                'title' => 'First Opportunity Discovery Meeting: ' . $opportunity->opportunity_name,
                'due_date' => Carbon::now()->addDays(3),
                'status' => 'pending',
            ]);

            return $opportunity;
        });
    }
}
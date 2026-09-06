<?php

namespace App\Actions\Opportunities;

use App\Data\UpdateOpportunityStageData;
use App\Models\Opportunity;

class UpdateOpportunityStageAction
{
    public function execute(Opportunity $opportunity, UpdateOpportunityStageData $data): Opportunity
    {
        $probability = $data->probability ?? match ($data->stage) {
            'prospecting' => 10,
            'qualification' => 30,
            'proposal' => 60,
            'negotiation' => 80,
            'closed_won' => 100,
            'closed_lost' => 0,
            default => $opportunity->probability,
        };

        $opportunity->update([
            'stage' => $data->stage,
            'probability' => $probability,
        ]);

        return $opportunity;
    }
}
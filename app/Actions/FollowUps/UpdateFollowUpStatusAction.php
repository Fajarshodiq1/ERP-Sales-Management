<?php

namespace App\Actions\FollowUps;

use App\Data\UpdateFollowUpStatusData;
use App\Models\FollowUp;
use Carbon\Carbon;

class UpdateFollowUpStatusAction
{
    public function execute(FollowUp $followUp, UpdateFollowUpStatusData $data): FollowUp
    {
        $completedAt = $data->status === 'completed' ? Carbon::now() : null;

        $followUp->update([
            'status' => $data->status,
            'activity_id' => $data->activity_id ?? $followUp->activity_id,
            'completed_at' => $completedAt,
        ]);

        return $followUp;
    }
}
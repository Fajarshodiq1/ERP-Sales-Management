<?php

namespace App\Actions\FollowUps;

use App\Data\CreateFollowUpData;
use App\Models\FollowUp;

class CreateFollowUpAction
{
    public function execute(CreateFollowUpData $data): FollowUp
    {
        return FollowUp::create([
            'activity_id' => $data->activity_id,
            'user_id' => $data->user_id,
            'account_id' => $data->account_id,
            'contact_id' => $data->contact_id,
            'subject_type' => $data->subject_type,
            'subject_id' => $data->subject_id,
            'title' => $data->title,
            'due_date' => $data->due_date,
            'status' => 'pending',
        ]);
    }
}
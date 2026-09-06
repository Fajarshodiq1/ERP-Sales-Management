<?php

namespace App\Services;

use App\Models\Activity;
use App\Models\FollowUp;
use Carbon\Carbon;
use InvalidArgumentException;

class FollowUpTaskService
{
    /**
     * Membuat FollowUp task baru dari record Activity.
     */
    public function generateFromActivity(Activity $activity): FollowUp
    {
        if (empty($activity->next_action) || empty($activity->follow_up_date)) {
            throw new InvalidArgumentException('Activity must have next_action and follow_up_date to generate a task.');
        }

        return FollowUp::create([
            'activity_id' => $activity->id,
            'user_id' => $activity->user_id,
            'account_id' => $activity->account_id,
            'contact_id' => $activity->contact_id,
            'subject_type' => $activity->subject_type,
            'subject_id' => $activity->subject_id,
            'title' => $activity->next_action,
            'due_date' => Carbon::parse($activity->follow_up_date),
            'status' => 'pending',
        ]);
    }

    /**
     * Menandai FollowUp task sebagai selesai.
     */
    public function markAsCompleted(FollowUp $followUp): bool
    {
        return $followUp->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);
    }
}
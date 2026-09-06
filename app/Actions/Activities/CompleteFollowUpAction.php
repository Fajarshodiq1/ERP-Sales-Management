<?php

namespace App\Actions\Activities;

use App\Data\CompleteFollowUpData;
use App\Models\Activity;
use App\Models\FollowUp;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CompleteFollowUpAction
{
    public function execute(FollowUp $followUp, CompleteFollowUpData $data): FollowUp
    {
        return DB::transaction(function () use ($followUp, $data) {
            $activityId = $followUp->activity_id;

            // Buat activity log otomatis jika sales mengisi catatan penyelesaian task
            if ($data->activity_notes) {
                $activity = Activity::create([
                    'user_id' => $followUp->user_id,
                    'subject_type' => $followUp->subject_type,
                    'subject_id' => $followUp->subject_id,
                    'type' => $data->activity_type ?? 'note',
                    'notes' => $data->activity_notes,
                ]);

                $activityId = $activity->id;
            }

            // Update status follow up
            $followUp->update([
                'activity_id' => $activityId,
                'status' => 'completed',
                'completed_at' => Carbon::now(),
            ]);

            return $followUp;
        });
    }
}
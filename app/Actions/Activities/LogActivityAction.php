<?php

namespace App\Actions\Activities;

use App\Data\ActivityData;
use App\Models\Activity;
use App\Services\FollowUpTaskService;
use Illuminate\Support\Facades\DB;

class LogActivityAction
{
    public function __construct(
        private readonly FollowUpTaskService $taskService
    ) {
    }

    public function execute(ActivityData $data): Activity
    {
        return DB::transaction(function () use ($data) {
            // Abaikan field 'id' agar MySQL menggunakan Auto Increment (BigInteger)
            $payload = $data->except('id')->toArray();

            $activity = Activity::create($payload);

            // Step 3 Service Call: Auto Generate Task jika next_action & follow_up_date terisi
            if (!empty($data->next_action) && !empty($data->follow_up_date)) {
                $this->taskService->generateFromActivity($activity);
            }

            return $activity;
        });
    }
}
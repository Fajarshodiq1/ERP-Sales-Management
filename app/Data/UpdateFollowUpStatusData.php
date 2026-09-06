<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;

class UpdateFollowUpStatusData extends Data
{
    public function __construct(
        #[Rule('required|in:pending,completed,cancelled')]
        public string $status,

        #[Rule('nullable|integer|exists:activities,id')]
        public ?int $activity_id,
    ) {
    }
}
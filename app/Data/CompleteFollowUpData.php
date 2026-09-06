<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;

class CompleteFollowUpData extends Data
{
    public function __construct(
        #[Rule('nullable|string')]
        public ?string $activity_notes,

        #[Rule('nullable|in:call,email,meeting,note')]
        public ?string $activity_type,
    ) {
    }
}
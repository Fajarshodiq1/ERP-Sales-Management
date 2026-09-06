<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;

class CreateFollowUpData extends Data
{
    public function __construct(
        #[Rule('nullable|integer|exists:activities,id')]
        public ?int $activity_id,

        #[Rule('required|integer|exists:users,id')]
        public int $user_id,

        #[Rule('required|integer|exists:accounts,id')]
        public int $account_id,

        #[Rule('nullable|integer|exists:contacts,id')]
        public ?int $contact_id,

        #[Rule('required|string')]
        public string $subject_type,

        #[Rule('required|integer')]
        public int $subject_id,

        #[Rule('required|string|max:255')]
        public string $title,

        #[Rule('required|date')]
        public string $due_date,
    ) {
    }
}
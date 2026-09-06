<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Rule;

class ActivityData extends Data
{
    public function __construct(
        // Tambahkan ini agar Spatie Data tidak otomatis membuat UUID di atribut id
        public ?int $id = null,

        #[Rule('required|exists:users,id')]
        public int $user_id,

        #[Rule('required|exists:accounts,id')]
        public int $account_id,

        #[Rule('nullable|exists:contacts,id')]
        public ?int $contact_id = null,

        #[Rule('nullable|string')]
        public ?string $subject_type = null,

        #[Rule('nullable|integer')]
        public ?int $subject_id = null,

        #[Rule('required|string|max:255')]
        public string $type,

        #[Rule('required|date')]
        public string $performed_at,

        #[Rule('required|string|max:255')]
        public string $result,

        public ?string $notes = null,

        #[Rule('nullable|string|max:255')]
        public ?string $next_action = null,

        #[Rule('nullable|date')]
        public ?string $follow_up_date = null,
    ) {
    }
}
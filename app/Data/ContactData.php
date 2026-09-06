<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;

class ContactData extends Data
{
    public function __construct(
        #[Rule('required|exists:accounts,id')]
        public int $account_id,

        #[Rule('required|string|max:255')]
        public string $name,

        public ?string $position,
        public ?string $phone,

        #[Rule('nullable|email|max:255')]
        public ?string $email,

        #[Rule('required|in:active,inactive')]
        public string $status,

        public ?string $notes,
    ) {
    }
}
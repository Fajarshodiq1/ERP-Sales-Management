<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Rule;

class AccountData extends Data
{
    public function __construct(
        #[Rule('required|exists:business_pillars,id')]
        public int $business_pillar_id,

        #[Rule('required|string|max:255')]
        public string $company_name,

        public ?string $industry,
        public ?string $address,
        public ?string $phone,

        #[Rule('nullable|email|max:255')]
        public ?string $email,

        #[Rule('nullable|url|max:255')]
        public ?string $website,

        #[Rule('required|in:active,inactive,prospect')]
        public string $status,

        public ?string $notes,
    ) {
    }
}
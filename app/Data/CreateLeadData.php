<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;

class CreateLeadData extends Data
{
    public function __construct(
        #[Rule('required|string|max:255')]
        public string $lead_name,

        #[Rule('required|exists:accounts,id')]
        public string $account_id,

        #[Rule('required|exists:contacts,id')]
        public string $contact_id,

        #[Rule('required|exists:business_pillars,id')]
        public string $business_pillar_id,

        #[Rule('required|exists:users,id')]
        public string $user_id,

        public ?string $sourceable_type,
        public ?string $sourceable_id,

        #[Rule('required|string|max:100')]
        public string $lead_source,

        public ?string $potential_need,
        public ?string $notes,
    ) {
    }
}
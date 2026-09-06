<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;

class UpdateOpportunityData extends Data
{
    public function __construct(
        #[Rule('required|string|max:255')]
        public string $opportunity_name,

        #[Rule('required|numeric|min:0')]
        public float $potential_value,

        #[Rule('nullable|numeric|min:0')]
        public ?float $estimated_gp,

        #[Rule('required|integer|min:0|max:100')]
        public int $probability,

        #[Rule('required|in:prospecting,qualification,proposal,negotiation,closed_won,closed_lost')]
        public string $stage,

        #[Rule('nullable|date')]
        public ?string $expected_closing_date,

        #[Rule('nullable|string')]
        public ?string $description,

        #[Rule('nullable|exists:business_pillars,id')]
        public ?int $business_pillar_id,

        #[Rule('nullable|exists:users,id')]
        public ?int $user_id,
    ) {
    }
}
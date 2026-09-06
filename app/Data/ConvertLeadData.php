<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;

class ConvertLeadData extends Data
{
    public function __construct(
        #[Rule('required|integer|exists:leads,id')]
        public int $lead_id,

        #[Rule('required|string|max:255')]
        public string $opportunity_name,

        #[Rule('required|numeric|min:0')]
        public float $potential_value,

        #[Rule('required|integer|min:0|max:100')]
        public int $probability,

        #[Rule('required|numeric|min:0')]
        public float $estimated_gp,

        #[Rule('nullable|date')]
        public ?string $expected_closing_date,

        public ?string $description,
    ) {
    }
}
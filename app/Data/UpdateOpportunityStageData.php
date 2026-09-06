<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;

class UpdateOpportunityStageData extends Data
{
    public function __construct(
        #[Rule('required|in:prospecting,qualification,proposal,negotiation,closed_won,closed_lost')]
        public string $stage,

        #[Rule('nullable|integer|min:0|max:100')]
        public ?int $probability,
    ) {
    }
}
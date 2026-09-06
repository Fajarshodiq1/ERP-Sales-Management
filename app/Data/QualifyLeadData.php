<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;

class QualifyLeadData extends Data
{
    public function __construct(
        #[Rule('required|in:qualified,disqualified,in_qualification')]
        public string $status,

        public ?string $potential_need,
        public ?string $notes,
    ) {
    }
}
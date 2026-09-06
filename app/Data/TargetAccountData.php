<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Rule;

class TargetAccountData extends Data
{
    public function __construct(
        #[Rule('required|exists:accounts,id')]
        public int $account_id,

        #[Rule('required|exists:business_pillars,id')]
        public int $business_pillar_id,

        #[Rule('nullable|exists:users,id')]
        public ?int $assigned_sales_id,

        #[Rule('required|in:low,medium,high')]
        public string $priority,

        #[Rule('required|in:prospect,engaged,qualified,lost,closed')]
        public string $status,

        public ?string $notes,
    ) {
    }
}
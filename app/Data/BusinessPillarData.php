<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Rule;

class BusinessPillarData extends Data
{
    public function __construct(
        #[Rule('required|string|max:255')]
        public string $name,

        public ?string $description,

        #[Rule('required|in:active,inactive')]
        public string $status,
    ) {
    }
}
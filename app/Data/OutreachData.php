<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Rule;

class OutreachData extends Data
{
    public function __construct(
        #[Rule('required|exists:target_accounts,id')]
        public int $target_account_id,

        #[Rule('nullable|exists:contacts,id')]
        public ?int $contact_id,

        #[Rule('required|in:phone,email,linkedin,offline_visit')]
        public string $channel,

        #[Rule('required|date')]
        public string $outreach_date,

        #[Rule('required|in:no_answer,busy,not_interested,follow_up_requested,interested')]
        public string $result,

        public ?string $notes,
    ) {
    }
}
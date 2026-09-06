<?php

namespace App\Actions\Contact;

use App\Data\ContactData;
use App\Models\Contact;
use Illuminate\Support\Facades\DB;

class UpsertContactAction
{
    public function execute(ContactData $data, ?Contact $contact = null): Contact
    {
        return DB::transaction(function () use ($data, $contact) {
            return Contact::updateOrCreate(
                ['id' => $contact?->id],
                $data->toArray()
            );
        });
    }
}
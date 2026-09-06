<?php

namespace App\Actions\Account;

use App\Data\AccountData;
use App\Models\Account;
use Illuminate\Support\Facades\DB;

class UpsertAccountAction
{
    public function execute(AccountData $data, ?Account $account = null): Account
    {
        return DB::transaction(function () use ($data, $account) {
            return Account::updateOrCreate(
                ['id' => $account?->id],
                $data->toArray()
            );
        });
    }
}
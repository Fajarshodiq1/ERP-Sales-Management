<?php

namespace App\Actions\TargetAccount;

use App\Data\TargetAccountData;
use App\Models\TargetAccount;
use Illuminate\Support\Facades\DB;

class CreateTargetAccountAction
{
    public function execute(TargetAccountData $data, ?TargetAccount $targetAccount = null): TargetAccount
    {
        return DB::transaction(function () use ($data, $targetAccount) {
            return TargetAccount::updateOrCreate(
                ['id' => $targetAccount?->id],
                $data->toArray()
            );
        });
    }
}
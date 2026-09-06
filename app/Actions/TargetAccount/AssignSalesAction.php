<?php

namespace App\Actions\TargetAccount;

use App\Models\TargetAccount;
use Illuminate\Support\Facades\DB;

class AssignSalesAction
{
    public function execute(TargetAccount $targetAccount, int $salesId): TargetAccount
    {
        return DB::transaction(function () use ($targetAccount, $salesId) {
            $targetAccount->update(['assigned_sales_id' => $salesId]);
            return $targetAccount;
        });
    }
}
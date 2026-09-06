<?php

namespace App\Policies;

use App\Models\TargetAccount;
use App\Models\User;

class TargetAccountPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['Admin', 'Sales Manager', 'Sales Rep']);
    }

    public function view(User $user, TargetAccount $targetAccount): bool
    {
        if ($user->hasRole('Sales Rep')) {
            return $targetAccount->assigned_sales_id === $user->id;
        }

        return true;
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['Admin', 'Sales Manager', 'Sales Rep']);
    }

    public function update(User $user, TargetAccount $targetAccount): bool
    {
        if ($user->hasRole('Sales Rep')) {
            return $targetAccount->assigned_sales_id === $user->id;
        }

        return true;
    }

    public function assignSales(User $user): bool
    {
        return $user->hasAnyRole(['Admin', 'Sales Manager']);
    }
}
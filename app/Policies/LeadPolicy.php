<?php

namespace App\Policies;

use App\Models\Lead;
use App\Models\User;

class LeadPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['Admin', 'Sales Manager', 'Sales Rep']);
    }

    public function view(User $user, Lead $lead): bool
    {
        if ($user->hasAnyRole(['Admin', 'Sales Manager'])) {
            return true;
        }

        return $user->id === $lead->user_id;
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['Admin', 'Sales Manager', 'Sales Rep']);
    }

    public function update(User $user, Lead $lead): bool
    {
        if ($user->hasAnyRole(['Admin', 'Sales Manager'])) {
            return true;
        }

        return $user->id === $lead->user_id;
    }

    public function qualify(User $user, Lead $lead): bool
    {
        if ($user->hasAnyRole(['Admin', 'Sales Manager'])) {
            return true;
        }

        return $user->id === $lead->user_id;
    }
}
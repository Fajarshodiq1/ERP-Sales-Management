<?php

namespace App\Policies;

use App\Models\Outreach;
use App\Models\User;

class OutreachPolicy
{
    /**
     * Semua role yang punya permission 'log outreach' boleh melihat listing.
     * Pembatasan "hanya lihat miliknya sendiri" untuk Sales Rep sudah
     * ditangani lewat scopeForUser() di controller/model, bukan di sini.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('log outreach');
    }

    public function view(User $user, Outreach $outreach): bool
    {
        if ($user->hasRole('Sales Rep')) {
            return $outreach->user_id === $user->id;
        }

        // Admin & Sales Manager boleh lihat semua outreach
        return $user->can('log outreach');
    }

    public function create(User $user): bool
    {
        return $user->can('log outreach');
    }

    public function update(User $user, Outreach $outreach): bool
    {
        // Admin & Sales Manager boleh update outreach siapa pun
        if ($user->hasRole(['Admin', 'Sales Manager'])) {
            return true;
        }

        // Sales Rep hanya boleh update outreach miliknya sendiri
        if ($user->hasRole('Sales Rep')) {
            return $outreach->user_id === $user->id;
        }

        return false;
    }

    public function delete(User $user, Outreach $outreach): bool
    {
        // Kebijakan sama seperti update: Admin/Manager bebas,
        // Sales Rep cuma boleh hapus miliknya sendiri.
        if ($user->hasRole(['Admin', 'Sales Manager'])) {
            return true;
        }

        if ($user->hasRole('Sales Rep')) {
            return $outreach->user_id === $user->id;
        }

        return false;
    }
}
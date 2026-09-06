<?php

namespace App\Actions\Outreach;

use App\Data\OutreachData;
use App\Models\Lead;
use App\Models\Outreach;
use App\Models\TargetAccount;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class LogOutreachAction
{
    public function execute(OutreachData $data, User $user): Outreach
    {
        return DB::transaction(function () use ($data, $user) {
            // 1. Simpan Outreach Log
            $outreach = Outreach::create([
                'target_account_id' => $data->target_account_id,
                'contact_id' => $data->contact_id,
                'user_id' => $user->id,
                'channel' => $data->channel,
                'outreach_date' => $data->outreach_date,
                'result' => $data->result,
                'notes' => $data->notes,
            ]);

            // 2. Automated Trigger: Jika Result = 'interested'
            if ($data->result === 'interested') {
                $targetAccount = TargetAccount::findOrFail($data->target_account_id);

                // Update status Target Account ke Engaged
                $targetAccount->update(['status' => 'engaged']);

                // Auto-create Lead jika belum ada Lead aktif untuk Target Account ini
                Lead::firstOrCreate(
                    [
                        'target_account_id' => $targetAccount->id,
                        'status' => 'new',
                    ],
                    [
                        'account_id' => $targetAccount->account_id,
                        'business_pillar_id' => $targetAccount->business_pillar_id,
                        'assigned_sales_id' => $targetAccount->assigned_sales_id ?? $user->id,
                        'source' => 'outreach_' . $data->channel,
                        'title' => 'Lead from Outreach: ' . ($targetAccount->account->company_name ?? 'Prospect'),
                        'notes' => 'Auto-generated Lead from positive outreach outcome on ' . $data->outreach_date,
                    ]
                );
            }

            return $outreach;
        });
    }
}
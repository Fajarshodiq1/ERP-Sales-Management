<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('outreaches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('target_account_id')->constrained('target_accounts')->cascadeOnDelete();
            $table->foreignId('contact_id')->nullable()->constrained('contacts')->nullOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete(); // Sales yang melakukan outreach
            $table->string('channel'); // phone, email, linkedin, offline_visit
            $table->timestamp('outreach_date');
            $table->string('result'); // no_answer, busy, not_interested, follow_up_requested, interested
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('outreaches');
    }
};
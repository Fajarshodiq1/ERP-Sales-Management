<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('account_id')->constrained('accounts')->cascadeOnDelete();
            $table->foreignId('contact_id')->nullable()->constrained('contacts')->nullOnDelete();

            $table->nullableMorphs('subject');

            $table->string('type'); // Cold Call, Follow-up Call, Email, Meeting, Visit, Other
            $table->dateTime('performed_at');
            $table->string('result'); // Connected, No Answer, Interested, Not Interested, Meeting Scheduled, Qualified, Other
            $table->text('notes')->nullable();

            $table->string('next_action')->nullable();
            $table->dateTime('follow_up_date')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id(); // Auto-increment bigInteger (id)
            $table->string('lead_name');
            $table->foreignId('account_id')->constrained('accounts')->cascadeOnDelete();
            $table->foreignId('contact_id')->constrained('contacts')->cascadeOnDelete();
            $table->foreignId('business_pillar_id')->constrained('business_pillars')->cascadeOnDelete();
            $table->foreignId('user_id')->comment('Assigned Sales')->constrained('users')->cascadeOnDelete();

            // Reference asal usul Lead (Outreach atau Activity)
            $table->nullableMorphs('sourceable'); // Berubah dari nullableUuidMorphs ke nullableMorphs

            $table->string('lead_source'); // Cold Outreach, Website, Referral, Event, Activity, dll.
            $table->string('status')->default('unqualified'); // unqualified, in_qualification, qualified, disqualified
            $table->text('potential_need')->nullable();
            $table->text('notes')->nullable();

            $table->timestamp('qualified_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
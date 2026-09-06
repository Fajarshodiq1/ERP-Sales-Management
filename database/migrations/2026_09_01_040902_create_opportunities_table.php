<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('opportunities', function (Blueprint $table) {
            $table->id(); 
            $table->string('opportunity_name');
            $table->foreignId('lead_id')->nullable()->constrained('leads')->nullOnDelete();
            $table->foreignId('account_id')->constrained('accounts')->cascadeOnDelete();
            $table->foreignId('contact_id')->nullable()->constrained('contacts')->nullOnDelete();
            $table->foreignId('business_pillar_id')->constrained('business_pillars')->cascadeOnDelete();
            $table->foreignId('user_id')->comment('Assigned Sales')->constrained('users')->cascadeOnDelete();

            $table->decimal('potential_value', 15, 2);
            $table->integer('probability')->default(10); // 0% - 100%
            $table->decimal('estimated_gp', 15, 2)->default(0);
            $table->string('stage')->default('prospecting'); // prospecting, qualification, proposal, negotiation, closed_won, closed_lost
            $table->date('expected_closing_date')->nullable();
            $table->text('description')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('opportunities');
    }
};
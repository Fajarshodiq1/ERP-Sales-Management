<?php

namespace Database\Factories;

use App\Models\Account;
use App\Models\BusinessPillar;
use Illuminate\Database\Eloquent\Factories\Factory;

class AccountFactory extends Factory
{
    protected $model = Account::class;

    public function definition(): array
    {
        return [
            // Mengambil ID acak dari 5 BusinessPillar yang tersedia
            'business_pillar_id' => BusinessPillar::inRandomOrder()->value('id') ?? 1,
            'company_name' => fake()->unique()->company() . ' ' . fake()->randomNumber(3),
            'industry' => fake()->word(),
            'address' => fake()->address(),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->unique()->safeEmail(),
            'website' => fake()->url(),
            'status' => fake()->randomElement(['active', 'inactive', 'pending']),
            'notes' => fake()->sentence(),
        ];
    }
}
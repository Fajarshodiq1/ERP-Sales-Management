<?php

namespace Database\Seeders;

use App\Models\BusinessPillar;
use Illuminate\Database\Seeder;

class BusinessPillarSeeder extends Seeder
{
    public function run(): void
    {
        $pillars = ['Technology', 'Finance', 'Healthcare', 'Education', 'Manufacturing'];

        foreach ($pillars as $pillar) {
            BusinessPillar::create([
                'name' => $pillar,
                'description' => 'Description for ' . $pillar,
                'status' => 'active',
            ]);
        }
    }
}
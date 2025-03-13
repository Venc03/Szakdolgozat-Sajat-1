<?php

namespace Database\Seeders;

use App\Models\Car;
use App\Models\Compcateg;
use App\Models\Competition;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        User::factory(50)->create();
        Car::factory(20)->create();
        Competition::factory(20)->create();
        Compcateg::factory(20)->create();
    }
}

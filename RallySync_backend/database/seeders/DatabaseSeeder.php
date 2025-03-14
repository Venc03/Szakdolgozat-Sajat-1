<?php

namespace Database\Seeders;

use App\Models\Car;
use App\Models\Compcateg;
use App\Models\Competition;
use App\Models\Place;
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
        User::factory(50)->create();
        Place::factory(10)->create();
        Car::factory(5)->create();
        Competition::factory(20)->create();
        Compcateg::factory(20)->create();
    }
}

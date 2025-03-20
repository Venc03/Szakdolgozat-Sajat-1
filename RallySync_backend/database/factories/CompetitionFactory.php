<?php

namespace Database\Factories;

use App\Models\Place;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Competition>
 */
class CompetitionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $random_month = rand(1, 12);
        $random_dayStart = rand(1, 31);
        $random_dayEnd = rand($random_dayStart, 31);

        return [
            'event_name' => fake()->text(10),
            'place' => rand(1, Place::count()),
            'organiser' => rand(1, User::count()),
            'description' => fake()->text(50),
            'start_date' => date('Y-m-d', strtotime("2025-$random_month-$random_dayStart")),
            'end_date' => date('Y-m-d', strtotime("2025-$random_month-$random_dayEnd")),
        ];
    }
}

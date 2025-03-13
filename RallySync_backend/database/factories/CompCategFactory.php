<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Competition;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Compcateg>
 */
class CompCategFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $min_entry_max = 50;
        return [
            'competition' => rand(1, Competition::count()),
            'category' => rand(1, Category::count()),
            'min_entry' => rand(1, $min_entry_max),
            'max_entry' => date($min_entry_max, 100),
        ];
    }
}

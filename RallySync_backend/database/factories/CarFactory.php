<?php

namespace Database\Factories;

use App\Models\Brandtype;
use App\Models\Category;
use App\Models\Status;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Car>
 */
class CarFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'brandtype' => rand(1, Brandtype::count()),
            'category' => rand(1, Category::count()),
            'status' => rand(1, Status::count()),
        ];
    }
}

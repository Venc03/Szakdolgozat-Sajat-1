<?php

namespace Database\Factories;

use App\Models\Brandtype;
use App\Models\Category;
use App\Models\Status;
use App\Models\Car;
use Illuminate\Database\Eloquent\Factories\Factory;

class CarFactory extends Factory
{
    protected $model = Car::class;

    public function definition(): array
    {
        return [
            'brandtype' => Brandtype::inRandomOrder()->first()->bt_id,
            'category' => Category::inRandomOrder()->first()->categ_id,
            'status' => Status::inRandomOrder()->first()->stat_id,
            'image' => null
        ];
    }
}

<?php

use App\Models\Category;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id('categ_id');
            $table->string('category');
            $table->timestamps();
        });

        Category::create([
            'category' => 'Rally1',
        ]);
        Category::create([
            'category' => 'Rally2',
        ]);
        Category::create([
            'category' => 'Rally3',
        ]);
        Category::create([
            'category' => 'Rally4',
        ]);
        Category::create([
            'category' => 'Rally5',
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};

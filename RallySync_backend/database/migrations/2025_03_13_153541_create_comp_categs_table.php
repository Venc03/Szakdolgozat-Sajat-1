<?php

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
        Schema::create('compcategs', function (Blueprint $table) {
            $table->id('coca_id');
            $table->foreignId('competition')->references('comp_id')->on('competitions');
            $table->foreignId('category')->references('categ_id')->on('categories');
            $table->integer('min_entry');
            $table->integer('max_entry');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('compcategs');
    }
};

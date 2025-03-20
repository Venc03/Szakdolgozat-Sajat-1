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
        Schema::create('enlistments', function (Blueprint $table) {
            $table->foreignId('competitor')
                ->constrained('users') 
                ->onDelete('cascade');  // Optional: Adjust delete behavior

            $table->foreignId('competition')
                ->constrained('compcategs', 'competition')
                ->onDelete('cascade');  // Optional: Adjust delete behavior

            $table->foreignId('category')
                ->constrained('compcategs', 'category') 
                ->onDelete('cascade');  // Optional: Adjust delete behavior

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enlistments');
    }
};

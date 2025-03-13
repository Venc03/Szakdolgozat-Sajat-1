<?php

use App\Models\Car;
use Illuminate\Support\Facades\DB;
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
        Schema::create('cars', function (Blueprint $table) {
            $table->id('cid');
            $table->foreignId('brandtype') -> references('bt_id')->on('brandtypes');
            $table->foreignId('category') -> references('categ_id')->on('categories');
            $table->unsignedBigInteger('status');
            $table->foreign('status')->references('stat_id')->on('statuses');
            $table->timestamps();
        });
    }

    

    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};

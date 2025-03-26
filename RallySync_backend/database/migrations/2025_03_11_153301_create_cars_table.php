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
            $table->foreignId('brandtype')->constrained('brandtypes', 'bt_id');
            $table->foreignId('category') -> constrained('categories', 'categ_id');
            $table->unsignedBigInteger('status');
            $table->foreign('status')->references('stat_id')->on('statuses');
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    

    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};

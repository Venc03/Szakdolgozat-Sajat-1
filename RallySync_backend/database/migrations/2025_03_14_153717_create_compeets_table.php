<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('compeets', function (Blueprint $table) {
            $table->id('cs_id');
            $table->unsignedBigInteger('competitor');
            $table->foreignId('competition')->references('comp_id')->on('competitions');
            $table->foreign('competitor')->references('id')->on('users');
            $table->foreignId('car')->references('cid')->on('cars');
            $table->dateTime('arrives_at');
            $table->dateTime('start_date');
            $table->dateTime('finish_date');
            $table->timestamps();
        });

        DB::statement("ALTER TABLE compeets ADD CONSTRAINT
    	check_celbaeresElobbMintStartolas CHECK (start_date < finish_date)");

        DB::statement("ALTER TABLE compeets ADD CONSTRAINT
    	check_erkezesElobbMintAStart CHECK (arrives_at < start_date)");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('compeets');
    }
};

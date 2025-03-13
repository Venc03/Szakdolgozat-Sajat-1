<?php

use App\Models\Place;
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
        Schema::create('places', function (Blueprint $table) {
            $table->id('plac_id');
            $table->string('place');
            $table->timestamps();
        });

        Place::create([
            'place' => 'Kanári szigetek',
        ]);

        Place::create([
            'place' => 'Veszprém',
        ]);

        Place::create([
            'place' => 'Karlstad',
        ]);

        Place::create([
            'place' => 'Mikołajki',
        ]);

        Place::create([
            'place' => 'Róma',
        ]);

        Place::create([
            'place' => 'Zlín',
        ]);

        Place::create([
            'place' => 'Ceredigion',
        ]);

        Place::create([
            'place' => 'Zágráb',
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('places');
    }
};

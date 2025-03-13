<?php

use App\Models\Brandtype;
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
        Schema::create('brandtypes', function (Blueprint $table) {
            $table->id('bt_id');
            $table->string('brandtype');
            $table->timestamps();
        });

        Brandtype::create([
            'brandtype' => 'Skoda Fabia',
        ]);

        Brandtype::create([
            'brandtype' => 'Skoda Fabia RS',
        ]);

        Brandtype::create([
            'brandtype' => 'Citroen C3',
        ]);

        Brandtype::create([
            'brandtype' => 'Ford Puma',
        ]);

        Brandtype::create([
            'brandtype' => 'Peugeot 208',
        ]);

        Brandtype::create([
            'brandtype' => 'Hyundai i20 N',
        ]);

        Brandtype::create([
            'brandtype' => 'Ford Fiesta',
        ]);

        Brandtype::create([
            'brandtype' => 'Renault Clio',
        ]);

        Brandtype::create([
            'brandtype' => 'Volkswagen Polo',
        ]);

        Brandtype::create([
            'brandtype' => 'Toyota GR Yaris',
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('brandtypes');
    }
};

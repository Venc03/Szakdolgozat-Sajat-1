<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Competition extends Model
{
    /** @use HasFactory<\Database\Factories\CompetitionFactory> */
    use HasFactory;

    protected $primaryKey = 'comp_id';

    protected $fillable = [
        'event_name',
        'place',
        'organiser',
        'description',
        'start_date',
        'end_date',
    ];
}

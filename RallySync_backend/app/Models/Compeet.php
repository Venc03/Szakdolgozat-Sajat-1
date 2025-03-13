<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Compeet extends Model
{
    /** @use HasFactory<\Database\Factories\CompeetFactory> */
    use HasFactory;

    protected $primaryKey = 'cs_id';

    protected $fillable = [
        'competition',
        'competitor',
        'car',
        'arrives_at',
        'start_time',
        'finish_time',
    ];
}

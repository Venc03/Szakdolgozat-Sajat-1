<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Compeet extends Model
{
    /** @use HasFactory<\Database\Factories\CompeetFactory> */
    use HasFactory;

    protected $primaryKey = ['competition', 'competitor', 'car'];

    protected $fillable = [
        'arrives_at',
        'start_time',
        'finish_time',
    ];
}

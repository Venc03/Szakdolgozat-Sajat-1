<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Compcateg extends Model
{
    use HasFactory;
    protected $primaryKey = 'coca_id';

    protected $fillable = [
        'competition',
        'category',
        'min_entry',
        'max_entry'
    ];
}

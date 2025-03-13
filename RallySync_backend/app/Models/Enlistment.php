<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enlistment extends Model
{
    /** @use HasFactory<\Database\Factories\EnlistmentFactory> */
    use HasFactory;

    protected $primaryKey = ['competitor', 'competition'];

    protected $fillable = ['category'];
}

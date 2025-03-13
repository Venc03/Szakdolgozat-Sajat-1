<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Brandtype extends Model
{
    protected $primaryKey = 'bt_id';

    protected $fillable = [
        'brandtype',
    ];
}

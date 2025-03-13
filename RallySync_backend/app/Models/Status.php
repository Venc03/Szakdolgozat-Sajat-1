<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Status extends Model
{
    protected $primaryKey = 'stat_id';

    protected $fillable = [
        'statsus',
    ];
}

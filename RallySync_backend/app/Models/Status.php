<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Status extends Model
{
    protected $primaryKey = 'stat_id';
    public $incrementing = true;

    protected $fillable = [
        'statsus',
    ];
}

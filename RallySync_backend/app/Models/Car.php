<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Car extends Model
{

    use HasFactory;
    protected $primaryKey = 'cid';
    public $incrementing = true;

    protected $fillable = [
        'brandtype',
        'category',
        'status'
    ];
}

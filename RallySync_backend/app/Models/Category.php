<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $primaryKey = 'categ_id';
    public $incrementing = true;

    protected $fillable = [
        'category',
    ];
}

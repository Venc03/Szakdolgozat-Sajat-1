<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    protected $primaryKey = 'perm_id';

    protected $fillable = [
        'permission',
    ];
}

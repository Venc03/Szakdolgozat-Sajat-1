<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    use HasFactory;

    protected $primaryKey = 'cid';
    public $incrementing = true;
    protected $fillable = ['brandtype', 'category', 'status', 'image'];

    public function brand()
    {
        return $this->belongsTo(Brandtype::class, 'brandtype', 'bt_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category', 'categ_id');
    }

    public function status()
    {
        return $this->belongsTo(Status::class, 'status', 'stat_id');
    }

}

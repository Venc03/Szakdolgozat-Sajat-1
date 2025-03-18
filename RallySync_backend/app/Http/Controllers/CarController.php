<?php

namespace App\Http\Controllers;

use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CarController extends Controller
{

    public function carsAccordingToCategory(){
        return DB::select('
            SELECT cs.category, cs.brandtype
            FROM cars cs
            ORDER BY cs.category
        ');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return DB::select('
            SELECT cs.cid, bt.bt_id AS btid, ca.categ_id AS categid, ss.stat_id AS statid   , bt.brandtype, ca.category, ss.statsus
            FROM cars cs
            INNER JOIN brandtypes bt ON cs.brandtype = bt.bt_id
            INNER JOIN categories ca ON cs.category = ca.categ_id
            INNER JOIN statuses ss ON cs.status = ss.stat_id
            ORDER BY cs.cid
        ');
    }

    public function osszesSzabadAuto()
    {
        return DB::select('
            SELECT bt.brandtype, ca.category, ss.statsus 
            FROM cars cs
            INNER JOIN brandtypes bt ON cs.brandtype = bt.bt_id
            INNER JOIN categories ca ON cs.category = ca.categ_id
            INNER JOIN statuses ss ON cs.status = ss.stat_id
            WHERE ss.statsus = ?
        ', ['Szabad']);
    }

    public function osszesFoglaltAuto()
    {
        return DB::select('
            SELECT bt.brandtype, ca.category, ss.statsus 
            FROM cars cs
            INNER JOIN brandtypes bt ON cs.brandtype = bt.bt_id
            INNER JOIN categories ca ON cs.category = ca.categ_id
            INNER JOIN statuses ss ON cs.status = ss.stat_id
            WHERE ss.statsus = ?
        ', ['Foglalt']);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'brandtype' => 'required|integer|exists:brandtypes,bt_id',
            'category' => 'required|integer|exists:categories,categ_id',
            'status' => 'required|integer|exists:statuses,stat_id',
        ]);
    
        // Create the car using the IDs directly
        $car = new Car;
        $car->brandtype = $validated['brandtype'];
        $car->category = $validated['category'];
        $car->status = $validated['status'];
        $car->save();
    
        return response()->json(['message' => 'Car created successfully']);
    }
    


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return DB::select('
        SELECT bt.brandtype, ca.category, ss.statsus 
        FROM cars cs
        INNER JOIN brandtypes bt ON cs.brandtype = bt.bt_id
        INNER JOIN categories ca ON cs.category = ca.categ_id
        INNER JOIN statuses ss ON cs.status = ss.stat_id
        WHERE cs.cid = ?
    ', [$id]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
{
    $record = Car::find($id);
    if ($record) {
        $record->brandtype = $request->input('brandtype');
        $record->category = $request->input('category');
        $record->status = $request->input('statsus');

        $record->save();
        return response()->json(['message' => 'Car updated successfully']);
    }

    return response()->json(['message' => 'Car not found'], 404);
}



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Car::find($id)->delete();
    }

    public function CompetCars(string $car)
    {
        return DB::select(
            '
            SELECT * FROM compeets 
            WHERE car = ?
            ',
            [$car]
        );
    }
}

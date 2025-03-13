<?php

namespace App\Http\Controllers;

use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return DB::select('
            SELECT cs.cid, bt.brandtype, ca.category, ss.statsus 
            FROM cars cs
            INNER JOIN brandtypes bt ON cs.brandtype = bt.bt_id
            INNER JOIN categories ca ON cs.category = ca.categ_id
            INNER JOIN statuses ss ON cs.status = ss.stat_id
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
        $record = new Car();
        $record->fill($request->all());
        $record->save();
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
        // Validate input to ensure correct data
        $validator = Validator::make($request->all(), [
            'brandtype' => 'nullable|integer|exists:brandtypes,bt_id',
            'category'  => 'nullable|integer|exists:categories,categ_id',
            'status'    => 'nullable|integer|exists:statuses,stat_id',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // Filter out only the fields provided
        $updateData = array_filter($request->only(['brandtype', 'category', 'status']), 'strlen');

        if (empty($updateData)) {
            return response()->json(['message' => 'No data provided for update'], 400);
        }

        // Update the record in DB
        $updated = DB::table('cars')->where('cid', $id)->update($updateData);

        if ($updated) {
            return response()->json(['message' => 'Car updated successfully']);
        } else {
            return response()->json(['message' => 'Car not found or no changes made'], 404);
        }
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

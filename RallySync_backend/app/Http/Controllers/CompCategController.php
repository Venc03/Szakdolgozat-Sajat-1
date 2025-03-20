<?php

namespace App\Http\Controllers;

use App\Models\Compcateg;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CompcategController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return DB::select('
            SELECT ca.category, c.event_name, cc.min_entry, cc.max_entry
            FROM compcategs cc
            INNER JOIN competitions c ON cc.competition = c.comp_id
            INNER JOIN categories ca ON cc.category = ca.categ_id
        ');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $record = new Compcateg();
        $record->fill($request->all());
        $record->save();
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return DB::select('
            SELECT ca.category, c.event_name, cc.min_entry, cc.max_entry
            FROM compcategs cc
            INNER JOIN competitions c ON cc.competition = c.comp_id
            INNER JOIN categories ca ON cc.category = ca.categ_id
            WHERE cc.category = ?
        ', [$id]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'competition' => 'nullable|integer|exists:competitions,comp_id',
            'category'    => 'nullable|integer|exists:categories,categ_id',
            'min_entry'   => 'nullable|integer|min:1',
            'max_entry'   => 'nullable|integer|min:1|gte:min_entry',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }
    
        // Get only provided fields and keep valid values (including 0)
        $updateData = array_filter(
            $request->only(['competition', 'category', 'min_entry', 'max_entry']),
            fn($value) => $value !== null
        );
    
        if (empty($updateData)) {
            return response()->json(['message' => 'No data provided for update'], 400);
        }
    
        // Update the record in DB
        $updated = DB::table('compcategs')->where('coca_id', $id)->update($updateData);
    
        if ($updated) {
            return response()->json(['message' => 'Competition updated successfully']);
        } else {
            return response()->json(['message' => 'Competition not found or no changes made'], 404);
        }
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Compcateg::find($id)->delete();
    }
}

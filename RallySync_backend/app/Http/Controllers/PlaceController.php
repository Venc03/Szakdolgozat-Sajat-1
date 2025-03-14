<?php

namespace App\Http\Controllers;

use App\Models\Place;
use Illuminate\Http\Request;

class PlaceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Place::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
        {
            $validated = $request->validate([
                'place' => 'required|string|max:255',
            ]);
        
            $record = new Place();
            $record->place = $validated['place']; // Assign the validated value
            $record->save();
        
            return response()->json(['message' => 'Place created successfully.'], 201);
        }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Place::find($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $record = Place::find($id);
        $record->fill($request->all());
        $record->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
{
    try {

        $place = Place::find($id);

        if (!$place) {
            return response()->json(['message' => 'Place not found.'], 404);
        }

        $place->delete();

        return response()->json(['message' => 'Place deleted successfully.'], 200);
    } catch (\Exception) {
        return response()->json(['message' => 'An error occurred while deleting the place.'], 500);
    }
}
}

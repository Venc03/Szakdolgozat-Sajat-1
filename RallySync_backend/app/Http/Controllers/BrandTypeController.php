<?php

namespace App\Http\Controllers;

use App\Models\Brandtype;
use Illuminate\Http\Request;

class BrandtypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brandtypes = Brandtype::all();
        return response()->json($brandtypes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $validated = $request->validate([
        'brandtype' => 'required|string|max:255',
    ]);

    $record = new Brandtype();
    $record->brandtype = $validated['brandtype']; 
    $record->save();

    return response()->json(['message' => 'Brandtype created successfully.'], 201);
}


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Brandtype::find($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
{
    $record = Brandtype::find($id);
    $record->brandtype = $request->brandtype; 
    $record->save();
}


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
{
    try {
        $place = Brandtype::find($id);

        if (!$place) {
            return response()->json(['message' => 'Brandtype not found.'], 404);
        }

        $place->delete();

        return response()->json(['message' => 'Brandtype deleted successfully.'], 200);
    } catch (\Exception $e) {
        return response()->json(['message' => 'An error occurred while deleting the brandtype.'], 500);
    }
}

}

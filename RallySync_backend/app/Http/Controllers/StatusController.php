<?php

namespace App\Http\Controllers;

use App\Models\Status;
use Illuminate\Http\Request;

class StatusController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $status = Status::all();
        return response()->json($status);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    try {
        $validated = $request->validate([
            'statsus' => 'required|string|max:255',
        ]);

        $record = new Status();
        $record->statsus = $validated['statsus'];
        $record->save();

        return response()->json(['message' => 'Status created successfully.'], 201);
    } catch (\Exception $e) {
        return response()->json(['message' => 'An error occurred: ' . $e->getMessage()], 500);
    }
}


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Status::find($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
{
    $validated = $request->validate([
        'statsus' => 'required|string|max:255',
    ]);

    $record = Status::find($id);
    if ($record) {
        $record->statsus = $validated['statsus']; 
        $record->save();
        return response()->json(['message' => 'Status updated successfully.']);
    } else {
        return response()->json(['message' => 'Status not found.'], 404);
    }
}



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
{
    try {
        $place = Status::find($id);

        if (!$place) {
            return response()->json(['message' => 'Status not found.'], 404);
        }

        $place->delete();

        return response()->json(['message' => 'Status deleted successfully.'], 200);
    } catch (\Exception $e) {
        return response()->json(['message' => 'An error occurred while deleting the status.'], 500);
    }
}
}

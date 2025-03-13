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
        return Brandtype::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $record = new Brandtype();
        $record->fill($request->all());
        $record->save();
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
        $record->fill($request->all());
        $record->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Brandtype::find($id)->delete();
    }
}

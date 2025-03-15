<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Compcateg;
use App\Models\Competition;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class CompetitionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return DB::select('
        SELECT c.comp_id, c.event_name, p.place, o.name as organiser, 
        c.description, cc.min_entry, cc.max_entry, ctg.category, cc.competition, c.start_date, c.end_date
        FROM competitions c
        INNER JOIN users o ON c.organiser = o.id
        INNER JOIN places p ON c.place = p.plac_id
        INNER JOIN compcategs cc ON c.comp_id = cc.competition
        INNER JOIN categories ctg ON cc.category = ctg.categ_id
    ');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $competition = new Competition();
    $competition->fill($request->all());
    $competition->save();

    // Create compcateg entries
    foreach ($request["category"] as $category) {
        $cc = new Compcateg();
        $cc->competition = $competition->comp_id;
        $cc->category = $category;
        $cc->save();
    }

    return response()->json(['message' => 'Competition created successfully']);
}

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return DB::select('
        SELECT o.name, c.event_name, p.place, c.description, c.start_date, c.end_date
            FROM competitions c
            INNER JOIN places p ON c.place = p.plac_id
            INNER JOIN users o ON c.organiser = o.id
        WHERE c.organiser = ?
    ', [$id]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
{
    $competition = Competition::findOrFail($id);
    $competition->update($request->only(['event_name', 'place', 'organiser', 'description', 'start_date', 'end_date']));

    return response()->json(['message' => 'Competition updated successfully']);
}

public function destroy(string $id)
{
    Competition::findOrFail($id)->delete();
    return response()->json(['message' => 'Competition deleted successfully']);
}

    public function legtobbetSzervezo()
    {
        return DB::select('
        SELECT c.organiser, u.name, COUNT(*) AS competition_number
        FROM competitions c
        JOIN users u ON c.organiser = u.id
        GROUP BY c.organiser, u.name
        HAVING COUNT(*) = (
            SELECT MAX(sub.competition_number)
            FROM (
                SELECT organiser, COUNT(*) AS competition_number
                FROM competitions
                GROUP BY organiser
            ) AS sub
        );
    ');
    }

    //szervező-e a felhasználó
    public function isOrganiser(string $id)
    {
        $user = User::find($id);
        return $user->permission == 2;
    }

    public function myCompetitions(string $id)
    {
        return DB::select(
            "select * from competition
            where organiser = ?",
            [$id]
        );
    }
}

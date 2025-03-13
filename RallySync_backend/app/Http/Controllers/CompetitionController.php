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
        return Competition::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //létrejön a competition!!!!
        $competition = new Competition();
        $competition->fill($request->all());
        //elmenti a versenyt!
        $competition->save();
        //létrejön egy új compcateg
        foreach ($request["category"] as $category) {
            $cc = new Compcateg();
            $cc->fill($request->all());
            $cc->competition = $competition->comp_id;
            $cc->category = $category;
            $cc->save();
        }
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
        // Validate input to ensure correct data
        $validator = Validator::make($request->all(), [
            'event_name'   => 'nullable|string|max:255',
            'place'        => 'nullable|integer|exists:places,plac_id',
            'organiser'    => 'nullable|integer|exists:users,id',
            'description'  => 'nullable|string|max:255',
            'start_date'   => 'nullable|date',
            'end_date'     => 'nullable|date|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // Get only provided fields and keep valid values (including 0)
        $updateData = array_filter(
            $request->only(['event_name', 'place', 'organiser', 'description', 'start_date', 'end_date']),
            fn($value) => $value !== null
        );

        if (empty($updateData)) {
            return response()->json(['message' => 'No data provided for update'], 400);
        }

        // Update the record in DB
        $updated = DB::table('competitions')->where('comp_id', $id)->update($updateData);

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
        Competition::find($id)->delete();
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

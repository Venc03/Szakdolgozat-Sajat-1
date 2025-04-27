<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Compcateg;
use App\Models\Competition;
use App\Models\Place;
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
        SELECT c.comp_id, c.event_name, c.place as pid, p.place, o.name as organiser, 
        c.description, cc.min_entry, cc.max_entry, ctg.category, cc.category as categid, cc.competition, c.start_date, c.end_date
        FROM competitions c
        INNER JOIN users o ON c.organiser = o.id
        INNER JOIN places p ON c.place = p.plac_id
        INNER JOIN compcategs cc ON c.comp_id = cc.competition
        INNER JOIN categories ctg ON cc.category = ctg.categ_id
    ');
    }

    /**
     * Store a newly created comp.
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
     * Display the specified comp.
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
     * Update the specified comp.
     */
    public function update(Request $request, $competitionId, $categoryId)
    {
        try {
            // Validate input data
            $validated = $request->validate([
                'event_name' => 'required|string',
                'categid' => 'required|integer|exists:categories,categ_id',
                'pid' => 'required|integer|exists:places,plac_id',
                'min_entry' => 'required|integer|min:0',
                'max_entry' => 'required|integer|min:' . $request->input('min_entry'),
                'start_date' => 'required|date',
                'end_date' => 'required|date',
            ]);
    
            // Use DB transaction to ensure atomicity
            DB::beginTransaction();
    
            // Update the competition itself
            $competition = Competition::findOrFail($competitionId);
            $competition->update([
                'event_name' => $validated['event_name'],
                'place' => $validated['pid'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
            ]);
    
            // Delete the old compcateg record
            $compcateg = Compcateg::where([
                ['competition', '=', $competitionId],
                ['category', '=', $categoryId],
            ])->first();
    
            if ($compcateg) {
                $compcateg->delete(); // Delete the old record
            }
    
            // Create a new compcateg entry with the updated category
            $newCompcateg = new Compcateg();
            $newCompcateg->competition = $competitionId;
            $newCompcateg->category = $validated['categid'];  
            $newCompcateg->min_entry = $validated['min_entry'];
            $newCompcateg->max_entry = $validated['max_entry'];
            $newCompcateg->save();
    
            // Commit the transaction
            DB::commit();
    
            return response()->json(['message' => 'Competition updated successfully'], 200);
        } catch (\Exception $e) {
            // Rollback the transaction if something goes wrong
            DB::rollBack();
    
            // Log any errors
            Log::error('Error updating competition: ' . $e->getMessage(), [
                'competitionId' => $competitionId,
                'categoryId' => $categoryId
            ]);
    
            return response()->json(['message' => 'An error occurred while updating the competition.'], 500);
        }
    }


public function destroy($competitionId, $categoryId)
{
    Log::info("Delete request received for Competition: $competitionId, Category: $categoryId");

    try {
        DB::beginTransaction();

        // Delete related compcateg entry
        $deletedRows = DB::table('compcategs')->where([
            ['competition', $competitionId],
            ['category', $categoryId]
        ])->delete();

        if ($deletedRows === 0) {
            Log::warning("No compcateg entry found for Competition: $competitionId, Category: $categoryId");
        }

        // Check if any categories remain
        $remainingCategories = DB::table('compcategs')->where('competition', $competitionId)->count();

        if ($remainingCategories === 0) {
            DB::table('competitions')->where('comp_id', $competitionId)->delete();
            Log::info("Deleted competition $competitionId as it had no remaining categories.");
        }

        DB::commit();
        return response()->json(['message' => 'Competition deleted successfully']);
    } catch (\Exception $e) {
        DB::rollBack();
        Log::error("Error deleting competition: " . $e->getMessage());
        return response()->json(['error' => $e->getMessage()], 500);
    }
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
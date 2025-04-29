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
        SELECT c.comp_id, c.event_name, c.place as pid, p.place, o.name as organiser, cc.coca_id,
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
    public function update(Request $request, $CocaId)
    {
        try {
            // Validate input data
            $validated = $request->validate([
                'coca_id' => 'required|integer|exists:compcategs,coca_id',
                'event_name' => 'required|string',
                'comp_id' => 'required|integer|exists:competitions,comp_id',
                'categid' => 'required|integer|exists:categories,categ_id',
                'pid' => 'required|integer|exists:places,plac_id',
                'min_entry' => 'required|integer|min:0',
                'max_entry' => 'required|integer|min:' . $request->input('min_entry'),
                'start_date' => 'required|date',
                'end_date' => 'required|date',
            ]);
    
            DB::beginTransaction();
    
            // Update the competition
            $competition = Competition::findOrFail($validated['comp_id']);
            $competition->update([
                'event_name' => $validated['event_name'],
                'place' => $validated['pid'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
            ]);
    
            // Update the compcateg entry
            $existing = Compcateg::where('competition', $validated['comp_id'])
            ->where('category', $validated['categid'])
            ->where('coca_id', '!=', $validated['coca_id'])
            ->first();

            if ($existing) {
            return response()->json([
                'message' => 'A competition with the same competition ID and category already exists.'
            ], 422);
            }

            // Proceed with update
            $compcateg = Compcateg::findOrFail($CocaId);
            $compcateg->update([
            'category' => $validated['categid'],
            'competition' => $validated['comp_id'],
            'min_entry' => $validated['min_entry'],
            'max_entry' => $validated['max_entry'],
            ]);
    
            DB::commit();
    
            return response()->json(['message' => 'Competition updated successfully'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'An error occurred while updating the competition.', 'error' => $e->getMessage()], 500);
        }
    }
    


    public function destroy($CocaId)
    {
        Log::info("Delete request received for Compcateg ID: $CocaId");
    
        try {
            DB::beginTransaction();
    
            // Find the compcateg entry
            $compcateg = Compcateg::findOrFail($CocaId);
            $competitionId = $compcateg->competition;
    
            // Delete the compcateg
            $compcateg->delete();
            Log::info("Deleted compcateg ID: $CocaId");
    
            // Check if any categories remain for this competition
            $remaining = Compcateg::where('competition', $competitionId)->count();
    
            if ($remaining === 0) {
                // Delete the competition itself
                Competition::where('comp_id', $competitionId)->delete();
                Log::info("Deleted competition ID: $competitionId as it had no remaining categories.");
            }
    
            DB::commit();
            return response()->json(['message' => 'Competition and category entry deleted successfully'], 200);
    
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error deleting competition/category: " . $e->getMessage());
            return response()->json([
                'error' => 'Deletion failed',
                'details' => $e->getMessage()
            ], 500);
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
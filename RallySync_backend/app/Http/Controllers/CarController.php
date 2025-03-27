<?php

namespace App\Http\Controllers;

use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CarController extends Controller
{

    public function carsAccordingToCategory(){
        return DB::select('
            SELECT cs.category, cs.brandtype
            FROM cars cs
            ORDER BY cs.category
        ');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return DB::select('
            SELECT cs.cid, bt.bt_id AS btid, ca.categ_id AS categid, ss.stat_id AS statid, bt.brandtype, ca.category, ss.statsus, cs.image
            FROM cars cs
            INNER JOIN brandtypes bt ON cs.brandtype = bt.bt_id
            INNER JOIN categories ca ON cs.category = ca.categ_id
            INNER JOIN statuses ss ON cs.status = ss.stat_id
            ORDER BY cs.cid
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
        $validated = $request->validate([
            'brandtype' => 'required|integer|exists:brandtypes,bt_id',
            'category' => 'required|integer|exists:categories,categ_id',
            'status' => 'required|integer|exists:statuses,stat_id',
        ]);
    
        // Create the car using the IDs directly
        $car = new Car;
        $car->brandtype = $validated['brandtype'];
        $car->category = $validated['category'];
        $car->status = $validated['status'];
        $car->save();
    
        return response()->json(['message' => 'Car created successfully']);
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
    $record = Car::find($id);
    if ($record) {
        $validated = $request->validate([
            'brandtype' => 'required|integer|exists:brandtypes,bt_id',
            'category' => 'required|integer|exists:categories,categ_id',
            'status' => 'required|integer|exists:statuses,stat_id',
        ]);

        $record->brandtype = $validated['brandtype'];
        $record->category = $validated['category'];
        $record->status = $validated['status'];

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $fileName = $id . '_' . time() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('cars'), $fileName);
            $record->image = asset('cars/' . $fileName);
        }

        $record->save();

        return response()->json(['message' => 'Car updated successfully']);
    }

    return response()->json(['message' => 'Car not found'], 404);
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

    public function uploadImage(Request $request)
{
    // Validate the uploaded image
    $validated = $request->validate([
        'image' => 'required|image|max:10240', // max 10MB
    ]);

    // Get the car ID and the uploaded image
    $carId = $request->input('car_id');
    $image = $request->file('image');

    // Generate a new filename for the image
    $fileName = $carId . '_' . time() . '.' . $image->getClientOriginalExtension();

    // Step 1: Copy the image to the public/cars directory
    $image->move(public_path('cars'), $fileName);

    // Step 2: Generate the public URL for the uploaded image
    $imageUrl = asset('cars/' . $fileName);  // This is the URL that can be accessed in the browser

    // Step 3: Update the car's image in the database with the new image URL
    $car = Car::find($carId);
    if ($car) {
        $car->image = $imageUrl;
        $car->save();
    } else {
        return response()->json(['error' => 'Car not found'], 404);
    }

    // Step 4: Return the image URL in the response
    return response()->json([
        'success' => true,
        'image_url' => $imageUrl
    ]);
}

}

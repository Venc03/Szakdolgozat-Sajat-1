<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Get all users.
     */
    public function index()
    {
        return DB::select('
        SELECT u.id, u.name, u.email, p.permission, u.image
        FROM users u
        INNER JOIN permissions p ON u.permission = p.perm_id'
        );
    }

    /**
     * Store a new user with validation.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'permission' => 'nullable|string'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']), // Hash password
            'permission' => $validated['permission'] ?? 'user'
        ]);

        return response()->json(['message' => 'User created successfully', 'user' => $user], 201);
    }

    /**
     * Get a specific user.
     */
    public function show(string $id)
    {
        $user = User::find($id);
        return DB::select('
        SELECT u.id, u.name, u.email, p.permission, u.image
        FROM users u
        INNER JOIN permissions p ON u.permission = p.perm_id
        WHERE u.id = ?', [$id]
        );
    }

    /**
     * Update user (Only name is allowed).
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->name = $validated['name'];
        $user->save();

        return response()->json(['message' => 'Username updated successfully']);
    }

    /**
     * Admin Update - Change name and permission.
     */
    public function adminUpdate(Request $request, string $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'permission' => 'required|string'
        ]);

        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->update($validated);

        return response()->json(['message' => 'User updated successfully']);
    }

    /**
     * Delete a user.
     */
    public function destroy(string $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    /**
     * Update user password with validation.
     */
    public function updatePassword(Request $request, $id)
    {
        $validated = $request->validate([
            'password' => 'required|string|min:6|max:50',
        ]);

        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->password = Hash::make($validated['password']);
        $user->save();

        return response()->json(['message' => 'Password updated successfully']);
    }

    public function uploadImage(Request $request)
{
    // Validate the uploaded image
    $validated = $request->validate([
        'image' => 'required|image|max:10240', // max 10MB
    ]);

    // Get the car ID and the uploaded image
    $Id = $request->input('id');
    $image = $request->file('image');

    // Generate a new filename for the image
    $fileName = $Id . '_' . time() . '.' . $image->getClientOriginalExtension();

    // Step 1: Copy the image to the public/cars directory
    $image->move(public_path('users'), $fileName);

    // Step 2: Generate the public URL for the uploaded image
    $imageUrl = asset('users/' . $fileName);  // This is the URL that can be accessed in the browser

    // Step 3: Update the car's image in the database with the new image URL
    $user = User::find($Id);
    if ($user) {
        $user->image = $imageUrl;
        $user->save();
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

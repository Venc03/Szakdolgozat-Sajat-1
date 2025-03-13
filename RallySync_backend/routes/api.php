<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CompcategController;
use App\Http\Controllers\CompeetController;
use App\Http\Controllers\CompetitionController;
use App\Http\Controllers\PlaceController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\Admin;
use App\Http\Middleware\Competitor;
use App\Http\Middleware\Organiser;
use App\Models\Category;
use App\Models\Place;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:sanctum', Admin::class])->group(function () {
    Route::post('/carCreate', [CarController::class, 'store']);
    Route::put('/carModify/{id}', [CarController::class, 'update']);
    Route::delete('/carDelete/{id}', [CarController::class, 'destroy']);
    Route::get('/categCreate', [CategoryController::class, 'store']);
    Route::put('/categModify/{id}', [CategoryController::class, 'update']);
    Route::delete('/categDelete/{id}', [CategoryController::class, 'destroy']);
    Route::get('/placeCreate', [PlaceController::class, 'store']);
    Route::put('/placeModify/{id}', [PlaceController::class, 'update']);
    Route::delete('/placeDelete/{id}', [PlaceController::class, 'destroy']);
    Route::get('/registeredRaces', [CompetitionController::class, 'registeredRaces']);
    Route::get('/tookPart', [CompeetController::class, 'tookPart']);
    Route::get('/carsAccordingToCategory', [CarController::class, 'carsAccordingToCategory']);
});

Route::middleware(['auth:sanctum', Organiser::class])->group(function () {

});

Route::middleware(['auth:sanctum', Competitor::class])->group(function () {

});

//public

Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);
Route::patch('/users/{id}/update-password', [UserController::class, 'updatePassword']);

Route::get("/cars", [CarController::class, 'index']);
route::get("/car/{id}", [CarController::class, "show"]);
route::get("/compets-cars/{id}", [CarController::class, "CompetCars"]);
route::get("/szabadAutok", [CarController::class, "osszesSzabadAuto"]);

route::get("/place/{id}", [PlaceController::class, "show"]);


Route::post('/compeet', [CompeetController::class, 'store']);

Route::get('/mostUsedBrand', [CompeetController::class, "legtobbetHasznaltMarka"]);
Route::get('/mostUsedCateg', [CompeetController::class, "legtobbetHasznaltKategoria"]);
Route::get('/mostParticPlace', [CompeetController::class, "legtobbetVersenyzettTerulet"]);
Route::get('/fastestTime', [CompeetController::class, "leggyorsabbPajaido"]);
Route::get('/mostHostedOrg', [CompetitionController::class, "legtobbetSzervezo"]);

Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);

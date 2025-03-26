<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\BrandtypeController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CompcategController;
use App\Http\Controllers\CompeetController;
use App\Http\Controllers\CompetitionController;
use App\Http\Controllers\PlaceController;
use App\Http\Controllers\StatusController;
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

    route::get("/competitionGet", [CompetitionController::class, "index"]);
    route::get("/competition/{id}", [CompetitionController::class, "show"]);
    Route::patch('/competitionModify/{competitionId}/{ccccategoryId}', [CompetitionController::class, 'update']);
    Route::delete('/competitionDelete/{competitionId}/{ccccategoryId}', [CompetitionController::class, 'destroy']);
    route::get("/compcategs", [CompcategController::class, "index"]);
    route::get("/compcateg/{id}", [CompcategController::class, "show"]);
    Route::patch('/compcategUpdate/{id}', [CompcategController::class, 'update']);
    Route::get('/carGet', [CarController::class, 'index']);
    Route::post('/carCreate', [CarController::class, 'store']);
    Route::patch('/carModify/{id}', [CarController::class, 'update']);
    Route::delete('/carDelete/{id}', [CarController::class, 'destroy']);
    Route::post('/carUploadImage', [CarController::class, 'uploadImage']);
    Route::get('/categGet', [CategoryController::class, 'index']);
    Route::post('/categCreate', [CategoryController::class, 'store']);
    Route::patch('/categModify/{id}', [CategoryController::class, 'update']);
    Route::delete('/categDelete/{id}', [CategoryController::class, 'destroy']);
    Route::get('/placeGet', [PlaceController::class, 'index']);
    Route::post('/placeCreate', [PlaceController::class, 'store']);
    Route::patch('/placeModify/{id}', [PlaceController::class, 'update']);
    Route::delete('/placeDelete/{id}', [PlaceController::class, 'destroy']);
    Route::get('/brandtypeGet', [BrandtypeController::class, 'index']);
    Route::post('/brandtypeCreate', [BrandtypeController::class, 'store']);
    Route::patch('/brandtypeModify/{id}', [BrandtypeController::class, 'update']);
    Route::delete('/brandtypeDelete/{id}', [BrandtypeController::class, 'destroy']);
    Route::get('/statusGet', [StatusController::class, 'index']);
    Route::post('/statusCreate', [StatusController::class, 'store']);
    Route::patch('/statusModify/{id}', [StatusController::class, 'update']);
    Route::delete('/statusDelete/{id}', [StatusController::class, 'destroy']);
    Route::get('/registeredRaces', [CompetitionController::class, 'registeredRaces']);
    Route::get('/tookPart', [CompeetController::class, 'tookPart']);
    Route::get('/carsAccordingToCategory', [CarController::class, 'carsAccordingToCategory']);
    Route::patch('/userAdminModify/{id}', [UserController::class, 'adminUpdate']);
});

Route::middleware(['auth:sanctum', Organiser::class])->group(function () {

});

Route::middleware(['auth:sanctum', Competitor::class])->group(function () {

});

Route::get('/userGet', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::patch('/userModify/{id}', [UserController::class, 'update']);
Route::delete('/userDelete/{id}', [UserController::class, 'destroy']);
Route::patch('/users/{id}/update-password', [UserController::class, 'updatePassword']);
Route::post('/userUploadImage', [UserController::class, 'uploadImage']);


Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
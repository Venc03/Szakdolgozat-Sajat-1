<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;
use App\Models\Brandtype;
use App\Models\Status;
use App\Models\Category;
use App\Models\Permission;
use App\Models\Car;
use App\Models\Place;
use App\Models\User;
use App\Models\Competition;
use App\Models\CompCateg;
use App\Models\Enlistment;
use App\Models\Compeet;

class AdminMigrationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_creates_all_tables()
    {
        // Check if all the tables are created
        $tables = [
            'brandtypes', 'statuses', 'categories', 'permissions', 'cars', 'places', 'users', 
            'competitions', 'compcategs', 'enlistments', 'compeets', 'password_reset_tokens', 'sessions'
        ];

        foreach ($tables as $table) {
            $this->assertTrue(Schema::hasTable($table));
        }
    }

    /** @test */
    public function it_creates_the_brandtypes_table()
    {
        $this->assertTrue(Schema::hasColumns('brandtypes', ['bt_id', 'brandtype', 'created_at', 'updated_at']));
        $brandtype = Brandtype::first();
        $this->assertNotNull($brandtype);
        $this->assertContains($brandtype->brandtype, [
            'Skoda Fabia', 'Skoda Fabia RS', 'Citroen C3', 'Ford Puma', 'Peugeot 208', 'Hyundai i20 N',
            'Ford Fiesta', 'Renault Clio', 'Volkswagen Polo', 'Toyota GR Yaris'
        ]);
    }

    /** @test */
    public function it_creates_the_statuses_table()
    {
        $this->assertTrue(Schema::hasColumns('statuses', ['stat_id', 'statsus', 'created_at', 'updated_at']));
        $status = Status::first();
        $this->assertNotNull($status);
        $this->assertContains($status->statsus, [
            'Szabad', 'Foglalt', 'Pályán', 'Szervízelés alatt'
        ]);
    }

    /** @test */
    public function it_creates_the_categories_table()
    {
        $this->assertTrue(Schema::hasColumns('categories', ['categ_id', 'category', 'created_at', 'updated_at']));
        $category = Category::first();
        $this->assertNotNull($category);
        $this->assertContains($category->category, [
            'Rally1', 'Rally2', 'Rally3', 'Rally4', 'Rally5'
        ]);
    }

    /** @test */
    public function it_creates_the_permissions_table()
    {
        $this->assertTrue(Schema::hasColumns('permissions', ['perm_id', 'permission', 'created_at', 'updated_at']));
        $permission = Permission::first();
        $this->assertNotNull($permission);
        $this->assertContains($permission->permission, [
            'versenyző', 'szervező', 'adminisztrátor'
        ]);
    }

    /** @test */
    public function it_creates_the_cars_table()
    {
        $this->assertTrue(Schema::hasColumns('cars', ['cid', 'brandtype', 'category', 'status', 'image', 'created_at', 'updated_at']));
    }

    /** @test */
    public function it_creates_the_places_table()
    {
        $this->assertTrue(Schema::hasColumns('places', ['plac_id', 'place', 'created_at', 'updated_at']));
    }

    /** @test */
    public function it_creates_the_users_table()
    {
        $this->assertTrue(Schema::hasColumns('users', ['id', 'name', 'email', 'permission', 'password', 'image', 'created_at', 'updated_at']));
    }

    /** @test */
    public function it_creates_the_competitions_table()
    {
        $this->assertTrue(Schema::hasColumns('competitions', ['comp_id', 'event_name', 'place', 'organiser', 'description', 'start_date', 'end_date', 'created_at', 'updated_at']));
    }

    /** @test */
    public function it_creates_the_compcategs_table()
    {
        $this->assertTrue(Schema::hasColumns('compcategs', ['coca_id', 'competition', 'category', 'min_entry', 'max_entry', 'created_at', 'updated_at']));
    }

    /** @test */
    public function it_creates_the_enlistments_table()
    {
        $this->assertTrue(Schema::hasColumns('enlistments', ['competitor', 'competition', 'category']));
    }

    /** @test */
    public function it_creates_the_compeets_table()
    {
        $this->assertTrue(Schema::hasColumns('compeets', ['competitor', 'competition', 'car', 'arrives_at', 'start_date', 'finish_date', 'created_at', 'updated_at']));
    }

    /** @test */
public function it_creates_new_user_racecar_place_permission_and_brandtype()
{
    // Create new permission
    $permission = \App\Models\Permission::create([
        'permission' => 'teszt'
    ]);
    $this->assertDatabaseHas('permissions', [
        'permission' => 'teszt'
    ]);

    // Create new brandtype
    $brandtype = \App\Models\Brandtype::create([
        'brandtype' => 'Lada 2107'
    ]);
    $this->assertDatabaseHas('brandtypes', [
        'brandtype' => 'Lada 2107'
    ]);

    // Create new place
    $place = \App\Models\Place::create([
        'place' => 'Hungaroring'
    ]);
    $this->assertDatabaseHas('places', [
        'place' => 'Hungaroring'
    ]);

    // Create new user
    $user = \App\Models\User::create([
        'name' => 'Test Elek',
        'email' => 'testelek@example.com',
        'password' => bcrypt('password'),
        'permission' => $permission->perm_id
    ]);
    $this->assertDatabaseHas('users', [
        'email' => 'testelek@example.com'
    ]);

    // Create new racecar
    $car = \App\Models\Car::create([
        'brandtype' => $brandtype->bt_id,
        'category' => 1, 
        'status' => 1    
    ]);
    $this->assertDatabaseHas('cars', [
        'brandtype' => $brandtype->bt_id
    ]);
}
}
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return view('welcome');
// });



Route::middleware(['auth'])->group(function () {
    Route::get("/", [TaskController::class, "index"])->name("index");

    Route::post('/store', [TaskController::class, 'store'])->name('store');
    Route::delete('/delete/{id}', [TaskController::class, 'delete'])->name('delete');
    Route::get('/edit', [TaskController::class, 'edit'])->name('edit');
    Route::post('/update', [TaskController::class, 'update'])->name('update');
    Route::get('/fetchall', [TaskController::class, 'fetchAll'])->name('fetchAll');
    Route::get('/show-all', [TaskController::class, 'showAll'])->name('showAll');
    Route::get("/pagination/fetch_data", [TaskController::class, "showAll"]);
    
});


Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified'
])->group(function () {
    Route::get('/dashboard', function () {
        return view('dashboard');
    })->name('dashboard');
});
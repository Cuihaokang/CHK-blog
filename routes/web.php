<?php

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

Auth::routes();


Route::get('/','HomeController@home')->name('home');

Route::get('/admin','AdminController@index')->name('admin');

Route::post('/articles/search', 'ArticleController@search')->name('articles.search');
Route::get('/articles/list', 'ArticleController@list')->name('articles.list');
Route::resource('/comments','CommentController');
Route::resource('/articles','ArticleController');
Route::resource('/tags', 'TagController');

// Route::get('/articles', 'ArticlesController@index')->name('articles.index');
// Route::get('/articles/create', 'ArticlesController@create')->name('articles.create');
// Route::get('/articles/{id}', 'ArticlesController@show')->name('articles.show');
// Route::post('/articles', 'ArticleController@store')->name('articles.store');
// Route::get('/articles/{id}/edit', 'ArticlesController@edit')->name('articles.edit');
// Route::patch('/articles/{id}', 'ArticlesController@update')->name('articles.update');
// Route::delete('/articles/{id}', 'ArticlesController@destroy')->name('articles.destroy');
// Route::middleware(['auth','super'])->prefix('z')->group(function () {
Route::prefix('z')->group(function () {
  Route::get('/dashboard', 'AdminController@dashboard_api');
  Route::get('/articles', 'ArticleController@index_api');
  Route::post('/articles', 'ArticleController@store_api');
  Route::post('/articles/update','ArticleController@update_api');
  Route::get('/articles/publish/{id}', 'ArticleController@publish_api');
  Route::get('/articles/delete/{id}', 'ArticleController@destroy_api');
  Route::post('/articles/markdown','ArticleController@markdown_api');
  Route::get('/articles/{id}', 'ArticleController@show_api');
  Route::get('/comments', 'CommentController@index_api');
  Route::get('/comments/delete/{id}', 'CommentController@destroy_api');
  Route::get('/visits','VisitController@index_api');
  Route::post('/upload', 'UploadController@upload_api');
  Route::get('/tags', 'TagController@index_api');
  Route::get('/tags/delete/{id}', 'TagController@destroy_api');
});

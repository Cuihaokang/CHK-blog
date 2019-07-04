<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Article;

class HomeController extends Controller
{
    public function index()
    {
        return view('welcome');
    }
    /**
     * Show the home.
     *
     * @return \Illuminate\Http\Response
     */
     public function home()
     {
         $articles = Article::where('is_hidden', 0 )->orderBy('created_at','desc')->limit(10)->get();
         for($i=0; $i < sizeof($articles); $i++){
           $articles[$i]->content = str_limit(strip_tags($articles[$i]->content),300);
           $articles[$i]->created_at_date = $articles[$i]->created_at->toDateString();
           $articles[$i]->updated_at_date = $articles[$i]->updated_at->diffForHumans();
         }
         return view('home',compact('articles'));
     }
}

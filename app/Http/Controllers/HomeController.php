<?php namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Faq;

class HomeController extends Controller
{
    public function homepage()
    {
        $faqs = Faq::all(); // Fetch FAQs from DB
        return view('Passenger.homepage', compact('faqs'));
    }
}

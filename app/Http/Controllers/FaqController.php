<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Faq;

class FaqController extends Controller
{
    public function index()
    {
        $faqs = Faq::all();
        return view('admin.FAQs', compact('faqs'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'question' => 'required|string|max:255',
            'answer'   => 'required|string',
        ]);

        Faq::create([
            'question' => $request->question,
            'answer'   => $request->answer,
        ]);

        return redirect()->route('admin.faqs')->with('success', 'FAQ added successfully!');
    }

    public function destroy($id)
    {
        $faq = Faq::findOrFail($id);
        $faq->delete();

        return redirect()->route('admin.faqs')->with('success', 'FAQ deleted successfully!');
    }
        public function homepage()
    {
        $faqs = Faq::all(); // get all FAQs
        return view('Passenger.homepage', compact('faqs'));
    }
}

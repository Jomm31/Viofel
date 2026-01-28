<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Faq;
use Inertia\Inertia;

class FaqController extends Controller
{
    public function index()
    {
        $faqs = Faq::all();
        return Inertia::render('Admin/Faqs', [
            'faqs' => $faqs
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'question' => 'required|string|max:255',
            'answer'   => 'required|string',
        ]);

        Faq::create($request->only(['question', 'answer']));

        return redirect()->route('admin.faqs')->with('success', 'FAQ added successfully!');
    }

    public function destroy($id)
    {
        Faq::findOrFail($id)->delete();
        return redirect()->route('admin.faqs')->with('success', 'FAQ deleted successfully!');
    }

    // ✅ New: Edit page
    public function edit($id)
    {
        $faq = Faq::findOrFail($id);
        return view('admin.edit-faq', compact('faq'));
    }

    // ✅ New: Update action
    public function update(Request $request, $id)
    {
        $request->validate([
            'question' => 'required|string|max:255',
            'answer'   => 'required|string',
        ]);

        $faq = Faq::findOrFail($id);
        $faq->update($request->only(['question', 'answer']));

        return redirect()->route('admin.faqs')->with('success', 'FAQ updated successfully!');
    }
}

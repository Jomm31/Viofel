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

        $faq = Faq::create($request->only(['question', 'answer']));

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'faq' => $faq]);
        }

        return redirect()->route('admin.faqs')->with('success', 'FAQ added successfully!');
    }

    public function destroy($id, Request $request)
    {
        Faq::where('faq_id', $id)->delete();
        
        if ($request->wantsJson() || $request->ajax()) {
            return response()->json(['success' => true]);
        }

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

        $faq = Faq::where('faq_id', $id)->firstOrFail();
        $faq->update($request->only(['question', 'answer']));

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json(['success' => true, 'faq' => $faq]);
        }

        return redirect()->route('admin.faqs')->with('success', 'FAQ updated successfully!');
    }
}

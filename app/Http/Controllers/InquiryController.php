<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'contact_number' => 'nullable|string|max:20',
            'message' => 'nullable|string',
            'attachment' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx|max:2048',
        ]);

        $inquiry = new Inquiry();
        $inquiry->name = $request->name;
        $inquiry->email = $request->email;
        $inquiry->contact_number = $request->contact_number;
        $inquiry->message = $request->message;

        if ($request->hasFile('attachment')) {
            $inquiry->attachment = $request->file('attachment')->store('attachments', 'public');
        }

        $inquiry->save();

        return redirect()->route('inquiries.index')->with('success', 'Inquiry submitted!');
    }

    public function index()
    {
        $inquiries = Inquiry::latest()->get(); // latest first
        return view('admin.inquiries', compact('inquiries'));
    }
}



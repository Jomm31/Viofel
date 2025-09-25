<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class InquiryController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'contact_number' => 'nullable|string|max:20',
            'message' => 'nullable|string',
            'attachment' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx|max:20048',
        ]);

        $inquiry = new Inquiry();
        $inquiry->name = $request->name;
        $inquiry->email = $request->email;
        $inquiry->contact_number = $request->contact_number;
        $inquiry->message = $request->message;

    if ($request->hasFile('attachment')) {
        $file = $request->file('attachment');
        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('attachments', $filename, 'public'); // store in storage/app/public/attachments
        $inquiry->attachment = $path; // save "attachments/filename.png" to DB
    }



        $inquiry->save();

        return redirect()->route('inquiries.admin')->with('success', 'Inquiry submitted!');
    }

    public function index()
    {
        $inquiries = Inquiry::latest()->get(); // latest first
        return view('admin.inquiries', compact('inquiries'));
    }

    public function destroy($id)
    {
        $inquiry = Inquiry::findOrFail($id);

        // If attachment exists, delete it from storage
        if ($inquiry->attachment && Storage::disk('public')->exists($inquiry->attachment)) {
            Storage::disk('public')->delete($inquiry->attachment);
        }


        $inquiry->delete();

        return redirect()->route('inquiries.admin')->with('success', 'Inquiry deleted successfully!');
    }

}



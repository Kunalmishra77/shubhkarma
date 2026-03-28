<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    /**
     * POST /api/contact
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:100',
            'phone'   => 'required|string|max:15',
            'email'   => 'nullable|email|max:150',
            'subject' => 'nullable|string|max:100',
            'message' => 'required|string|max:2000',
        ]);

        // Queue notification email (configure mail driver in .env)
        // Mail::to(config('mail.admin_address'))->queue(new ContactFormMail($validated));

        return response()->json([
            'message' => 'Thank you! We will get back to you within 2 hours.',
        ], 201);
    }
}

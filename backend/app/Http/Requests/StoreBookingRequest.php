<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'puja_id'       => 'required|exists:pujas,id',
            'package_tier'  => 'required|in:basic,standard,premium',
            'customer_name' => 'required|string|max:100',
            'customer_phone'=> 'required|string|max:15',
            'customer_email'=> 'nullable|email|max:150',
            'puja_date'     => 'required|date|after:today',
            'puja_time'     => 'nullable|string|max:20',
            'address'       => 'required|string|max:500',
            'city'          => 'required|string|max:100',
            'pincode'       => 'required|string|size:6',
            'notes'         => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'puja_id.exists'      => 'The selected puja does not exist.',
            'puja_date.after'     => 'Puja date must be a future date.',
            'pincode.size'        => 'Pincode must be exactly 6 digits.',
        ];
    }
}

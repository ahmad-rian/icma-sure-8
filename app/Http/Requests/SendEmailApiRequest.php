<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class SendEmailApiRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization will be handled by middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'to' => 'required|array|min:1|max:10',
            'to.*' => 'required|email|max:255',
            'cc' => 'nullable|array|max:5',
            'cc.*' => 'required|email|max:255',
            'bcc' => 'nullable|array|max:5',
            'bcc.*' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'body' => 'required|string|max:50000',
            'body_type' => 'nullable|string|in:html,text',
            'from_name' => 'nullable|string|max:255',
            'reply_to' => 'nullable|email|max:255',
            'attachments' => 'nullable|array|max:5',
            'attachments.*.name' => 'required_with:attachments|string|max:255',
            'attachments.*.content' => 'required_with:attachments|string', // Base64 encoded
            'attachments.*.mime_type' => 'required_with:attachments|string|max:100',
            'priority' => 'nullable|integer|in:1,2,3,4,5', // 1=highest, 5=lowest
            'tags' => 'nullable|array|max:10',
            'tags.*' => 'string|max:50',
            'metadata' => 'nullable|array',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'to.required' => 'At least one recipient email address is required.',
            'to.array' => 'Recipients must be provided as an array.',
            'to.min' => 'At least one recipient is required.',
            'to.max' => 'Maximum 10 recipients allowed.',
            'to.*.email' => 'Each recipient must be a valid email address.',
            'cc.max' => 'Maximum 5 CC recipients allowed.',
            'cc.*.email' => 'Each CC recipient must be a valid email address.',
            'bcc.max' => 'Maximum 5 BCC recipients allowed.',
            'bcc.*.email' => 'Each BCC recipient must be a valid email address.',
            'subject.required' => 'Email subject is required.',
            'subject.max' => 'Subject cannot exceed 255 characters.',
            'body.required' => 'Email body content is required.',
            'body.max' => 'Email body cannot exceed 50,000 characters.',
            'body_type.in' => 'Body type must be either "html" or "text".',
            'from_name.max' => 'From name cannot exceed 255 characters.',
            'reply_to.email' => 'Reply-to must be a valid email address.',
            'attachments.max' => 'Maximum 5 attachments allowed.',
            'attachments.*.name.required_with' => 'Attachment name is required.',
            'attachments.*.content.required_with' => 'Attachment content is required.',
            'attachments.*.mime_type.required_with' => 'Attachment MIME type is required.',
            'priority.in' => 'Priority must be between 1 (highest) and 5 (lowest).',
            'tags.max' => 'Maximum 10 tags allowed.',
            'tags.*.max' => 'Each tag cannot exceed 50 characters.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'to' => 'recipients',
            'to.*' => 'recipient email',
            'cc' => 'CC recipients',
            'cc.*' => 'CC email',
            'bcc' => 'BCC recipients',
            'bcc.*' => 'BCC email',
            'body_type' => 'body type',
            'from_name' => 'sender name',
            'reply_to' => 'reply-to email',
        ];
    }

    /**
     * Handle a failed validation attempt.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return void
     *
     * @throws \Illuminate\Http\Exceptions\HttpResponseException
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'error_code' => 'VALIDATION_ERROR'
            ], 422)
        );
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Set default body type if not provided
        if (!$this->has('body_type')) {
            $this->merge([
                'body_type' => 'html'
            ]);
        }

        // Set default priority if not provided
        if (!$this->has('priority')) {
            $this->merge([
                'priority' => 3 // Normal priority
            ]);
        }

        // Ensure arrays are properly formatted
        if ($this->has('to') && is_string($this->input('to'))) {
            $this->merge([
                'to' => [$this->input('to')]
            ]);
        }
    }

    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Check for duplicate email addresses across to, cc, bcc
            $allEmails = collect()
                ->merge($this->input('to', []))
                ->merge($this->input('cc', []))
                ->merge($this->input('bcc', []))
                ->filter()
                ->map('strtolower');

            if ($allEmails->count() !== $allEmails->unique()->count()) {
                $validator->errors()->add('recipients', 'Duplicate email addresses are not allowed across recipients, CC, and BCC.');
            }

            // Validate attachment size (base64 decoded size should not exceed 10MB per file)
            if ($this->has('attachments')) {
                foreach ($this->input('attachments', []) as $index => $attachment) {
                    if (isset($attachment['content'])) {
                        $decodedSize = strlen(base64_decode($attachment['content'], true));
                        if ($decodedSize > 10 * 1024 * 1024) { // 10MB
                            $validator->errors()->add(
                                "attachments.{$index}.content",
                                'Attachment size cannot exceed 10MB.'
                            );
                        }
                    }
                }
            }
        });
    }
}
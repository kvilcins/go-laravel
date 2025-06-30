<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Services\MailService;

class CallbackController extends Controller
{
    protected $mailService;

    public function __construct(MailService $mailService)
    {
        $this->mailService = $mailService;
    }

    public function send(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'message' => 'nullable|string|max:1000'
        ]);

        try {
            $callbackId = DB::table('callback_requests')->insertGetId([
                'name' => $validated['name'],
                'phone' => $validated['phone'],
                'email' => $validated['email'] ?? null,
                'message' => $validated['message'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            try {
                $this->mailService->sendCallbackRequest($validated);
                \Log::info('Callback emails sent successfully', ['callback_id' => $callbackId]);
            } catch (\Exception $e) {
                \Log::error('Failed to send callback emails', [
                    'callback_id' => $callbackId,
                    'error' => $e->getMessage()
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Заявка успешно отправлена'
            ]);

        } catch (\Exception $e) {
            \Log::error('Database error in callback: ' . $e->getMessage());

            $callbackData = [
                'id' => uniqid(),
                'name' => $validated['name'],
                'phone' => $validated['phone'],
                'email' => $validated['email'] ?? null,
                'message' => $validated['message'] ?? null,
                'created_at' => now()->toDateTimeString(),
            ];

            $filePath = storage_path('app/callbacks.json');
            $callbacks = [];

            if (file_exists($filePath)) {
                $callbacks = json_decode(file_get_contents($filePath), true) ?? [];
            }

            $callbacks[] = $callbackData;
            file_put_contents($filePath, json_encode($callbacks, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

            return response()->json([
                'success' => true,
                'message' => 'Заявка принята! (сохранено в резервное хранилище)'
            ]);
        }
    }
}

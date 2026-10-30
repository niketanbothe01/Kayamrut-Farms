<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'service' => 'kayamrut-api',
        'message' => 'This is the JSON API — not the storefront or admin UI.',
        'apps' => [
            'storefront' => 'http://localhost:3000',
            'admin' => 'http://localhost:3001',
            'api' => 'http://localhost:8080/api',
        ],
        'try' => [
            'GET /api/health',
            'GET /api/products',
            'GET /api/categories',
            'POST /api/admin/auth/login',
        ],
    ]);
});

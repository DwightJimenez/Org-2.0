<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class IngestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'document' => 'required|file|mimes:pdf|max:10240',
        ]);

        $file = $request->file('document');
        $tenantId = tenant('id');
        $fileName = $file->getClientOriginalName();

        try {
            $parser = new \Smalot\PdfParser\Parser();
            $pdf = $parser->parseFile($file->getPathname());
            $text = $pdf->getText();

            $chunks = str_split($text, 1000);
            $vectors = [];

            foreach ($chunks as $index => $chunk) {
                if (trim($chunk) === '') continue;

                $geminiResponse = Http::withoutVerifying()->withHeaders([
                    'Content-Type' => 'application/json',
                ])->post('https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=' . env('GEMINI_API_KEY'), [
                    'model' => 'models/gemini-embedding-001',
                    'content' => [
                        'parts' => [
                            ['text' => $chunk]
                        ]
                    ],
                    'outputDimensionality' => 768
                ]);

                if (!$geminiResponse->successful()) {
                    throw new \Exception('Gemini Error: ' . $geminiResponse->body());
                }

                $embedding = $geminiResponse->json('embedding.values');

                // 4. Prepare Vector payload for Pinecone
                $vectorId = $tenantId . '_' . uniqid() . '_chunk_' . $index;

                $vectors[] = [
                    'id' => $vectorId,
                    'values' => $embedding,
                    'metadata' => [
                        'text' => $chunk,
                        'source' => $fileName,
                        'tenant_id' => $tenantId
                    ]
                ];
            }

            // 5. Send to Pinecone using the Tenant's Namespace
            // Added withoutVerifying() for local XAMPP testing
            $pineconeResponse = Http::withoutVerifying()->withHeaders([
                'Api-Key' => env('PINECONE_API_KEY'),
                'Content-Type' => 'application/json'
            ])->post('https://' . env('PINECONE_HOST') . '/vectors/upsert', [
                'vectors' => $vectors,
                'namespace' => $tenantId
            ]);

            if (!$pineconeResponse->successful()) {
                throw new \Exception('Pinecone Error: ' . $pineconeResponse->body());
            }
        } catch (\Exception $e) {
            Log::error('Ingestion Error: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to process document: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

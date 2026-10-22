<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class KnowledgeQueryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }
    public function ask(Request $request)
    {
        $request->validate([
            'query' => 'required|string|max:1000',
        ]);

        $tenantId = tenant('id');
        $userQuery = $request->input('query');

        try {
            // 1. Embed query with Gemini (matched to 768 dimensions)
            $embedResponse = Http::withoutVerifying()->withHeaders([
                'Content-Type' => 'application/json',
            ])->post('https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=' . env('GEMINI_API_KEY'), [
                'model' => 'models/gemini-embedding-001',
                'content' => [
                    'parts' => [
                        ['text' => $userQuery]
                    ]
                ],
                'outputDimensionality' => 768,
            ]);

            if (!$embedResponse->successful()) {
                throw new \Exception('Gemini Embedding Error: ' . $embedResponse->body());
            }

            $queryVector = $embedResponse->json('embedding.values');

            // 2. Query Pinecone using tenant namespace isolation
            $pineconeResponse = Http::withoutVerifying()->withHeaders([
                'Api-Key' => env('PINECONE_API_KEY'),
                'Content-Type' => 'application/json',
            ])->post('https://' . env('PINECONE_HOST') . '/query', [
                'namespace' => $tenantId,
                'vector' => $queryVector,
                'topK' => 3,
                'includeMetadata' => true,
            ]);

            if (!$pineconeResponse->successful()) {
                throw new \Exception('Pinecone Error: ' . $pineconeResponse->body());
            }

            $matches = $pineconeResponse->json('matches', []);

            if (empty($matches)) {
                return response()->json([
                    'answer' => "No relevant knowledge base documents found for {$tenantId}. Please upload reference documents first.",
                    'sources' => [],
                ]);
            }

            // 3. Assemble context from matches
            $contextText = '';
            $sources = [];

            foreach ($matches as $match) {
                $text = $match['metadata']['text'] ?? '';
                $sourceName = $match['metadata']['source'] ?? 'Unknown Document';
                $contextText .= "Source Document: {$sourceName}\nText: {$text}\n\n";

                if (!in_array($sourceName, $sources, true)) {
                    $sources[] = $sourceName;
                }
            }

            $systemPrompt = "You are an intelligent organization assistant for '{$tenantId}'.\n" .
                "Answer the user's question using ONLY the provided context.\n" .
                "If the answer is not present in the context, explicitly state: 'I cannot answer this based on the uploaded documents.'\n\n" .
                "CONTEXT:\n{$contextText}";

            // 4. Generate answer with Gemini 3.5 Flash
            $chatResponse = Http::withoutVerifying()->withHeaders([
                'Content-Type' => 'application/json',
            ])->post('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=' . env('GEMINI_API_KEY'), [
                'systemInstruction' => [
                    'parts' => [['text' => $systemPrompt]]
                ],
                'contents' => [
                    ['role' => 'user', 'parts' => [['text' => $userQuery]]]
                ],
            ]);

            if (!$chatResponse->successful()) {
                throw new \Exception('Gemini Chat Error: ' . $chatResponse->body());
            }

            $answer = $chatResponse->json('candidates.0.content.parts.0.text', 'No answer generated.');

            return response()->json([
                'answer' => $answer,
                'sources' => $sources,
            ]);
        } catch (\Exception $e) {
            Log::error('RAG Engine Error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to process AI query: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Ping Pinecone to check connection status and vector count.
     */
    public function checkStatus()
    {
        $tenantId = tenant('id');

        try {
            $pineconeResponse = Http::withoutVerifying()->withHeaders([
                'Api-Key' => env('PINECONE_API_KEY'),
            ])->get('https://' . env('PINECONE_HOST') . '/describe_index_stats');

            if (!$pineconeResponse->successful()) {
                throw new \Exception('Pinecone API Error: ' . $pineconeResponse->body());
            }

            $stats = $pineconeResponse->json();
            $namespaces = $stats['namespaces'] ?? [];

            $vectorCount = isset($namespaces[$tenantId]) ? $namespaces[$tenantId]['vectorCount'] : 0;

            if ($vectorCount > 0) {
                return response()->json([
                    'message' => "🟢 **System Online**\n\nConnection established securely. The **{$tenantId}** knowledge base currently contains **{$vectorCount}** indexed vectors.\n\nWhat would you like to search for?"
                ]);
            } else {
                return response()->json([
                    'message' => "🟡 **System Ready**\n\nConnected to the engine, but the **{$tenantId}** knowledge base is currently empty. Please ingest some documents first."
                ]);
            }
        } catch (\Exception $e) {
            Log::error('AI Status Check Error: ' . $e->getMessage());
            return response()->json([
                'message' => "🔴 **System Offline**\n\n" . $e->getMessage()
            ], 500);
        }
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
        //
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

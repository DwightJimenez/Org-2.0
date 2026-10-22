import React, { useRef, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import TenantLayout from "@/Layouts/TenantLayout";

export default function TenantDashboard({ tenantId, auth }) {
    const fileInputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);

    // Form handler using Inertia
    const { data, setData, post, processing, progress, errors, reset, wasSuccessful } = useForm({
        document: null,
    });

    const handleFileSelect = (file) => {
        if (!file) return;
        setData("document", file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const submitDocument = (e) => {
        e.preventDefault();
        if (!data.document) return;

        post(route("document.ingest"), {
            onSuccess: () => {
                reset();
                if (fileInputRef.current) fileInputRef.current.value = "";
            },
        });
    };

    return (
        <TenantLayout>
            <Head title={`${tenantId.toUpperCase()} Workspace`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Section */}
                <div className="flex items-center justify-between border-b border-base-300 pb-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight uppercase">
                            {tenantId} Dashboard
                        </h1>
                        <p className="mt-2 opacity-70">
                            AI-Powered Organization Intelligence
                        </p>
                    </div>

                    <div className="hidden sm:flex items-center gap-4">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
                        </span>
                        <span className="text-sm font-medium text-success">
                            System Online
                        </span>

                        <Link href={route("settings.layout")} className="btn btn-sm btn-outline btn-primary ml-4">
                            Edit Layout
                        </Link>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Knowledge Base RAG Upload */}
                    <div className="col-span-1 md:col-span-2 bg-base-100 border border-base-300 rounded-3xl p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <h2 className="text-xl font-bold">Knowledge Base RAG</h2>
                            </div>

                            {data.document && !processing && (
                                <button
                                    onClick={submitDocument}
                                    className="btn btn-primary btn-sm rounded-xl"
                                >
                                    Upload & Ingest Vector
                                </button>
                            )}
                        </div>

                        {/* Status Feedback */}
                        {wasSuccessful && (
                            <div className="alert alert-success mb-4 rounded-xl text-sm py-2">
                                <span>Document embedded and synchronized with Pinecone!</span>
                            </div>
                        )}

                        {errors.document && (
                            <div className="alert alert-error mb-4 rounded-xl text-sm py-2">
                                <span>{errors.document}</span>
                            </div>
                        )}

                        {errors.error && (
                            <div className="alert alert-error mb-4 rounded-xl text-sm py-2">
                                <span>{errors.error}</span>
                            </div>
                        )}

                        {/* Interactive Drag & Drop Area */}
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-2xl h-56 flex flex-col items-center justify-center transition-all cursor-pointer ${
                                dragActive
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-base-300 bg-base-200/50 text-base-content/60 hover:text-primary hover:border-primary/50 hover:bg-primary/5"
                            }`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={(e) => handleFileSelect(e.target.files?.[0])}
                            />

                            {processing ? (
                                <div className="flex flex-col items-center gap-3">
                                    <span className="loading loading-spinner loading-lg text-primary"></span>
                                    <p className="text-sm font-medium">Extracting text & generating Gemini vectors...</p>
                                    {progress && (
                                        <progress
                                            className="progress progress-primary w-56"
                                            value={progress.percentage}
                                            max="100"
                                        ></progress>
                                    )}
                                </div>
                            ) : data.document ? (
                                <div className="flex flex-col items-center text-center px-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-success mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="font-semibold text-base-content">{data.document.name}</p>
                                    <p className="text-xs opacity-60 mt-1">
                                        {(data.document.size / (1024 * 1024)).toFixed(2)} MB - Click "Upload & Ingest Vector" above
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <p className="font-medium">Drag & Drop Organization Documents</p>
                                    <p className="text-sm mt-1 opacity-70">PDF up to 10MB</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* AI Chat Interface */}
                    <div className="col-span-1 bg-base-100 border border-base-300 rounded-3xl p-6 shadow-sm flex flex-col h-[340px]">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="avatar placeholder">
                                <div className="bg-secondary text-secondary-content rounded-full w-8">
                                    <span className="text-xs">AI</span>
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-secondary">AI Assistant</h2>
                        </div>

                        <div className="flex-1 bg-base-200 rounded-2xl p-4 text-sm opacity-70 italic mb-4 border border-base-300 flex items-end">
                            <p>Ready to analyze documents for {tenantId}...</p>
                        </div>

                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Ask the engine..."
                                className="input input-bordered input-secondary w-full pr-12 bg-base-100"
                            />
                            <button className="btn btn-sm btn-circle btn-secondary absolute right-2 top-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </TenantLayout>
    );
}
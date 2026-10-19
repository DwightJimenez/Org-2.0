import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";

export default function TenantDashboard({ tenantId, auth }) {
    // State to toggle the profile dropdown
    const [showingDropdown, setShowingDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
            <Head title={`${tenantId.toUpperCase()} Workspace`} />

            {/* Top Navigation Bar */}
            <nav className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold uppercase">
                                {tenantId.charAt(0)}
                            </div>
                            <span className="font-bold tracking-wider uppercase text-slate-200">
                                {tenantId} OS
                            </span>
                        </div>

                        {/* Profile Dropdown */}
                        <div className="flex items-center relative">
                            <button
                                onClick={() =>
                                    setShowingDropdown(!showingDropdown)
                                }
                                className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors focus:outline-none px-3 py-2 rounded-lg hover:bg-slate-800"
                            >
                                <span>{auth?.user?.name || "Employee"}</span>
                                <svg
                                    className={`h-4 w-4 transition-transform duration-200 ${showingDropdown ? "rotate-180" : ""}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {showingDropdown && (
                                <div className="absolute right-0 top-12 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1 z-50 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-slate-700/50">
                                        <p className="text-sm font-medium text-white">
                                            {auth?.user?.name}
                                        </p>
                                        <p className="text-xs text-slate-400 truncate">
                                            {auth?.user?.email}
                                        </p>
                                    </div>

                                    <div className="py-1">
                                        {/* Profile Link (You can map this to a real profile route later) */}
                                        <Link
                                            href="#"
                                            className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                                        >
                                            Profile Settings
                                        </Link>

                                        {/* Logout Button */}
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors"
                                        >
                                            Log Out
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Section */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 uppercase">
                            {tenantId} Workspace
                        </h1>
                        <p className="mt-2 text-slate-400">
                            AI-Powered Organization Intelligence
                        </p>
                    </div>
                    <div className="flex items-center gap-4 hidden sm:flex">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                        </span>
                        <span className="text-sm font-medium text-cyan-400">
                            System Online
                        </span>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Placeholder for Phase 2: RAG Upload */}
                    <div className="col-span-1 md:col-span-2 bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm hover:border-indigo-500/50 transition-colors group">
                        <h2 className="text-xl font-semibold mb-4 text-indigo-300">
                            Knowledge Base RAG
                        </h2>
                        <div className="border-2 border-dashed border-slate-600 rounded-xl h-48 flex items-center justify-center text-slate-500 group-hover:text-slate-300 group-hover:border-slate-400 transition-all cursor-pointer bg-slate-900/20">
                            <p>+ Drag & Drop Organization Documents</p>
                        </div>
                    </div>

                    {/* Placeholder for AI Chat */}
                    <div className="col-span-1 bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm flex flex-col">
                        <h2 className="text-xl font-semibold mb-4 text-cyan-300">
                            AI Assistant
                        </h2>
                        <div className="flex-1 bg-slate-900/50 rounded-xl p-4 text-sm text-slate-400 italic mb-4 border border-slate-700/50">
                            Ready to analyze documents for {tenantId}...
                        </div>
                        <input
                            type="text"
                            placeholder="Ask the automation engine..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}

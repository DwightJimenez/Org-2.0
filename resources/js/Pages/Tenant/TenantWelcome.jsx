import React from "react";
import { Head, Link } from "@inertiajs/react";

export default function TenantWelcome({ tenantName, canLogin, canRegister }) {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
            <Head title={`Welcome | ${tenantName}`} />

            {/* Top Navigation */}
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full border-b border-slate-800/50 z-10">
                <div className="text-2xl font-black tracking-tighter text-cyan-400 uppercase">
                    {tenantName}
                </div>
                <div className="flex items-center gap-6">
                    {canLogin && (
                        <Link
                            href={route("tenant.login")}
                            className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                        >
                            Employee Login
                        </Link>
                    )}
                    {canRegister && (
                        <Link
                            href={route("tenant.register")}
                            className="text-sm font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all transform hover:-translate-y-0.5"
                        >
                            Join Workspace
                        </Link>
                    )}
                </div>
            </nav>

            {/* Main Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 relative z-10">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                    Welcome to <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                        {tenantName}
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12">
                    This is the dedicated AI-powered intelligence portal for{" "}
                    {tenantName} personnel. Authenticate to access internal
                    documents, the RAG knowledge base, and automated systems.
                </p>

                <div className="flex gap-4">
                    <Link
                        href="dashboard"
                        className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-8 py-3 rounded-xl font-semibold transition-all"
                    >
                        Access Portal
                    </Link>
                </div>
            </main>

            {/* Ambient Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 blur-[150px] rounded-full"></div>
            </div>
        </div>
    );
}

import React from "react";
import { Head, Link } from "@inertiajs/react";

export default function Welcome() {
    return (
        <div className="min-h-screen bg-[#2E2842] text-slate-100 flex flex-col items-center justify-center selection:bg-[#432224] selection:text-white">
            <Head title="Welcome | Organization OS" />

            <main className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                    The Ultimate <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#CB7A5C] via-[#967FD0] to-[#CB7A5C] animate-gradient">
                        Organization Engine
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                    AI-powered automation, seamless multi-tenancy, and
                    futuristic data management. Create your dedicated workspace
                    in seconds.
                </p>

                {/* Call to Action */}
                <Link
                    href="/register-organization"
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all duration-300 transform hover:-translate-y-1"
                >
                    Initialize Workspace &rarr;
                </Link>
            </main>

            {/* Futuristic Background Elements */}
            <div className="absolute top-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-indigo-500/10 blur-[120px] rounded-full"></div>
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-cyan-500/10 blur-[120px] rounded-full"></div>
            </div>
        </div>
    );
}

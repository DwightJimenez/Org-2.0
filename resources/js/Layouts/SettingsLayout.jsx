import React from "react";
import { Link, usePage } from "@inertiajs/react";

export default function SettingsLayout({ children }) {
    const { auth, tenantId, tenantName } = usePage().props;

    const displayName = tenantName || tenantId;

    return (
        <div className="drawer lg:drawer-open bg-base-200 min-h-screen text-base-content">
            <input
                id="settings-drawer"
                type="checkbox"
                className="drawer-toggle"
            />

            {/* MAIN CONTENT AREA */}
            <div className="drawer-content flex flex-col">
                {/* Settings Topbar */}
                <div className="navbar bg-base-100 border-b border-base-300 sticky top-0 z-50">
                    <div className="flex-none lg:hidden">
                        <label
                            htmlFor="settings-drawer"
                            className="btn btn-square btn-ghost"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block w-6 h-6 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                ></path>
                            </svg>
                        </label>
                    </div>
                    <div className="flex-1 px-4">
                        <span className="badge badge-neutral font-bold mr-2">
                            SETTINGS
                        </span>
                        <span className="font-semibold hidden sm:inline opacity-70">
                            Configuration
                        </span>
                    </div>
                    <div className="flex-none gap-4">
                        <Link
                            href={route("workspace")}
                            className="btn btn-sm btn-ghost"
                        >
                            &larr; Back to Workspace
                        </Link>
                    </div>
                </div>

                {/* PAGE CONTENT */}
                <main className="flex-1 p-6 md:p-10">{children}</main>
            </div>
        </div>
    );
}

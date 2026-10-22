import React from "react";
import { Link, usePage } from "@inertiajs/react";

export default function AdminLayout({ children }) {
    const { auth, tenantId, tenantName } = usePage().props;
    const displayName = tenantName || tenantId;

    return (
        <div className="drawer lg:drawer-open bg-base-200 min-h-screen text-base-content">
            <input
                id="admin-drawer"
                type="checkbox"
                className="drawer-toggle"
            />

            {/* MAIN CONTENT AREA */}
            <div className="drawer-content flex flex-col">
                {/* Admin Topbar */}
                <div className="navbar bg-base-100 border-b border-base-300 sticky top-0 z-50">
                    <div className="flex-none lg:hidden">
                        <label
                            htmlFor="admin-drawer"
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
                        <span className="font-semibold hidden sm:inline opacity-70">
                            {displayName}
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

            {/* ADMIN SIDEBAR */}
            <div className="drawer-side z-20">
                <label
                    htmlFor="admin-drawer"
                    className="drawer-overlay"
                ></label>
                <ul className="menu p-4 w-72 min-h-full bg-base-100 border-r border-base-300 text-base-content gap-2">
                    <div className="px-4 py-4 mb-2 border-b border-base-300">
                        <h2 className="font-black text-2xl tracking-tight text-primary">
                            Administration
                        </h2>
                        <p className="text-xs opacity-60">
                            Manage Organization
                        </p>
                    </div>

                    <li className="menu-title mt-2">
                        <span>People & Access</span>
                    </li>
                    <li>
                        <Link
                            href={route("directory")}
                            className={
                                route().current("directory") ? "active" : ""
                            }
                        >
                            👥 Member Directory
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={route("admin.roles")}
                            className={
                                route().current("admin.roles") ? "active" : ""
                            }
                        >
                            🛡️ Roles & Permissions
                        </Link>
                    </li>

                    <div className="divider mt-auto mb-2"></div>

                    <li>
                        <Link
                            href={route("tenant.dashboard")}
                            className="hover:bg-base-200 text-error"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 opacity-70"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                            Exit Admin Console
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}

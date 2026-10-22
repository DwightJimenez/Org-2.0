import React from "react";
import { Link, usePage } from "@inertiajs/react";

export default function WorkspaceLayout({ children }) {
    const { auth, tenantId, tenantName } = usePage().props;
    const displayName = tenantName || tenantId;

    return (
        <div className="drawer lg:drawer-open bg-base-200 min-h-screen text-base-content">
            <input
                id="workspace-drawer"
                type="checkbox"
                className="drawer-toggle"
            />

            {/* MAIN CONTENT AREA */}
            <div className="drawer-content flex flex-col">
                {/* Workspace Topbar */}
                <div className="navbar bg-base-100 border-b border-base-300 sticky top-0 z-50 px-4">
                    <div className="flex-none lg:hidden">
                        <label
                            htmlFor="workspace-drawer"
                            aria-label="open sidebar"
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

                    <div className="flex-1 px-2">
                        <span className="font-bold text-lg tracking-tight">
                            {displayName?.toUpperCase()}
                        </span>
                    </div>

                    {/* Top Right Actions: Theme Switcher & Native daisyUI Dropdown */}
                    <div className="flex-none gap-3 flex items-center">
                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost rounded-btn px-2 flex items-center gap-2"
                            >
                                <div className="avatar placeholder">
                                    <div className="bg-primary text-primary-content rounded-full w-8">
                                        <span className="text-sm font-bold">
                                            {auth?.user?.name
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <span className="hidden sm:inline font-medium text-sm">
                                    {auth?.user?.name}
                                </span>
                                <svg
                                    className="h-4 w-4 opacity-60"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>

                            <ul
                                tabIndex={0}
                                className="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content bg-base-100 rounded-box w-56 border border-base-300 text-base-content gap-1"
                            >
                                <li className="menu-title px-4 py-2 border-b border-base-200 mb-1">
                                    <span className="text-xs opacity-60 block truncate">
                                        Signed in as
                                    </span>
                                    <span className="font-bold text-base-content block truncate">
                                        {auth?.user?.email}
                                    </span>
                                </li>
                                <li>
                                    <Link href={route("profile.edit")}>
                                        👤 Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route("settings.appearance")}>
                                        ⚙️ Settings
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route("directory")}>
                                        🛡️ Admin Console
                                    </Link>
                                </li>
                                <div className="divider my-0"></div>
                                <li>
                                    <Link
                                        href={route("tenant.logout")}
                                        method="post"
                                        as="button"
                                        className="text-error font-medium"
                                    >
                                        🚪 Log Out
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Workspace Content */}
                <main className="flex-1 p-6 md:p-8">{children}</main>
            </div>

            {/* Workspace Technical Sidebar */}
            <div className="drawer-side z-20">
                <label
                    htmlFor="workspace-drawer"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                ></label>
                <ul className="menu p-4 w-72 min-h-full bg-base-100 border-r border-base-300 text-base-content flex flex-col gap-2">
                    <div className="px-4 py-4 mb-2 border-b border-base-300">
                        <h2 className="font-black text-2xl text-primary tracking-tight">
                            Workspace Hub
                        </h2>
                    </div>

                    <li className="menu-title mt-2">
                        <span>AI & Automation</span>
                    </li>
                    <li>
                        <Link
                            href={route("workspace")}
                            className={
                                route().current("workspace") ? "active" : ""
                            }
                        >
                            🧠 Knowledge Base (RAG)
                        </Link>
                    </li>

                    <li className="menu-title mt-4">
                        <span>Organization Management</span>
                    </li>
                    <li>
                        <Link
                            href={route("settings.layout")}
                            className={
                                route().current("settings.layout")
                                    ? "active"
                                    : ""
                            }
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
                                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z"
                                />
                            </svg>
                            Portal Builder
                        </Link>
                    </li>

                    {/* Pushes the exit button to the very bottom of the sidebar */}
                    <div className="divider mt-auto mb-2"></div>

                    <li>
                        <Link
                            href={route("tenant.dashboard")}
                            className="text-error hover:bg-error/10 font-medium"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
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
                            Exit to Member View
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}

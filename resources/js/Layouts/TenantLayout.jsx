import React from "react";
import { Link, usePage } from "@inertiajs/react";

export default function TenantLayout({ children }) {
    const { auth, tenantName, tenantId } = usePage().props;
    const displayName = tenantName || tenantId;

    return (
        <div className="drawer lg:drawer-open bg-base-200 min-h-screen text-base-content">
            <input
                id="tenant-drawer"
                type="checkbox"
                className="drawer-toggle"
            />

            {/* MAIN CONTENT AREA */}
            <div className="drawer-content flex flex-col">
                {/* Top Navbar (Mobile Hamburger & User Profile) */}
                <div className="navbar bg-base-100 border-b border-base-300 w-full z-50 sticky top-0 px-4">
                    <div className="flex-none lg:hidden">
                        <label
                            htmlFor="tenant-drawer"
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

                    <div className="flex-1 px-2 mx-2 lg:hidden font-bold truncate">
                        {displayName}
                    </div>
                    <div className="flex-1 hidden lg:flex"></div>

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

                {/* PAGE CONTENT GOES HERE */}
                <main className="flex-1">{children}</main>
            </div>

            {/* SIDEBAR NAVIGATION */}
            <div className="drawer-side z-20">
                <label
                    htmlFor="tenant-drawer"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                ></label>
                <ul className="menu p-4 w-72 min-h-full bg-base-100 border-r border-base-300 text-base-content flex flex-col gap-2">
                    {/* Organization Logo/Name */}
                    <div className="flex items-center gap-3 px-4 py-4 mb-2 border-b border-base-300">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-content font-bold text-xl shadow-md shrink-0">
                            {displayName?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <h2 className="font-extrabold text-lg truncate">
                                {displayName}
                            </h2>
                            <p className="text-xs opacity-60">Member Portal</p>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <li className="menu-title mt-2">
                        <span>Organization</span>
                    </li>
                    <li>
                        <Link
                            href={route("dashboard")}
                            className={
                                route().current("dashboard") ||
                                route().current("tenant.dashboard")
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
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            Home / Announcements
                        </Link>
                    </li>

                    {/* -- ADMIN/MODERATOR MENU -- */}
                    <li className="menu-title mt-4">
                        <span className="text-primary">Admin & Management</span>
                    </li>
                    <li>
                        <Link
                            href={route("workspace")}
                            className={
                                route().current("workspace") ? "active" : ""
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
                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                />
                            </svg>
                            Workspace Hub
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={route("directory")}
                            className={
                                route().current("directory") ? "active" : ""
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
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                            </svg>
                            Admin Console
                        </Link>
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
                </ul>
            </div>
        </div>
    );
}

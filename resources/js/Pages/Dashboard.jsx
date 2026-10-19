import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Dashboard({ auth, tenants }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Central Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Welcome Header & Action Button */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                                Welcome, {auth.user.name}!
                            </h3>
                            <p className="text-gray-600">
                                Manage your AI-powered organizations from your
                                central hub.
                            </p>
                        </div>
                        <Link
                            href={route("register-organization")}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap"
                        >
                            + Create New Workspace
                        </Link>
                    </div>

                    {/* Workspaces List Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-xl font-extrabold text-gray-900 mb-6">
                            Your Workspaces
                        </h3>

                        {tenants && tenants.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tenants.map((tenant) => (
                                    <div
                                        key={tenant.id}
                                        className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-indigo-300 transition-all duration-300 flex flex-col bg-white"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-xl">
                                                {/* Displays the first letter of the company name */}
                                                {(
                                                    tenant.company_name ||
                                                    tenant.id
                                                )
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                            <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                                                Active
                                            </span>
                                        </div>

                                        <h4 className="text-xl font-bold text-gray-900 truncate">
                                            {tenant.company_name || tenant.id}
                                        </h4>
                                        <p className="text-sm text-gray-500 mb-6 flex-1">
                                            {tenant.id}.localhost:8000
                                        </p>

                                        {/* Standard HTML <a> tag used here to completely leave the central domain */}
                                        <a
                                            href={`http://${tenant.id}.localhost:8000/`}
                                            className="w-full text-center bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 text-gray-700 hover:text-indigo-700 py-2.5 rounded-xl font-semibold transition-colors"
                                        >
                                            Go to Portal &rarr;
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* Empty State (If no workspaces exist) */
                            <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400 mb-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                </svg>
                                <p className="text-gray-500 font-medium">
                                    You don't have any active workspaces yet.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

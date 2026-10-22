import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import ThemeSwitcher from "@/Components/ThemeSwitcher";

export default function Dashboard({ auth, tenants }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center w-full">
                    <h2 className="font-bold text-2xl text-base-content leading-tight tracking-tight">
                        Central Dashboard
                    </h2>
                    {/* Moved ThemeSwitcher up to the header for a cleaner nav */}
                    <ThemeSwitcher />
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12 text-base-content min-h-screen bg-base-200/30">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Hero Welcome Banner */}
                    <div className="bg-base-100 rounded-3xl p-8 sm:p-10 shadow-sm border border-base-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
                        {/* Subtle decorative background gradient */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                        
                        <div className="relative z-10">
                            <h3 className="text-3xl font-extrabold mb-2">
                                Welcome back, {auth.user.name}! 👋
                            </h3>
                            <p className="text-base-content/70 text-lg max-w-xl">
                                Manage your AI-powered platforms from your central hub. Select an organization below or create a new one to get started.
                            </p>
                        </div>

                        <Link
                            href={route("register-organization")}
                            className="btn btn-primary btn-lg rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all relative z-10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Create Organization
                        </Link>
                    </div>

                    {/* Organizations Section */}
                    <div className="flex flex-col space-y-6">
                        <div className="flex justify-between items-end px-2">
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight">Your Organizations</h3>
                                <p className="text-base-content/60 text-sm mt-1">Select an organization to manage its portal</p>
                            </div>
                            {tenants && tenants.length > 0 && (
                                <div className="badge badge-neutral badge-outline font-medium py-3 px-4">
                                    {tenants.length} Total
                                </div>
                            )}
                        </div>

                        {tenants && tenants.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tenants.map((tenant) => (
                                    <div
                                        key={tenant.id}
                                        className="group bg-base-100 border border-base-200 rounded-3xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-primary/40 transition-all duration-300 flex flex-col relative overflow-hidden cursor-default"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-2xl shadow-sm group-hover:bg-primary group-hover:text-primary-content transition-colors">
                                                {(tenant.company_name || tenant.id).charAt(0).toUpperCase()}
                                            </div>
                                            
                                            <span className="badge badge-success badge-sm font-semibold uppercase tracking-wider py-3 px-3 border-none bg-success/20 text-success">
                                                Active
                                            </span>
                                        </div>

                                        <div className="mb-8 flex-1">
                                            <h4 className="text-xl font-bold truncate mb-1 group-hover:text-primary transition-colors">
                                                {tenant.company_name || tenant.id}
                                            </h4>
                                            <a 
                                                href={`http://${tenant.id}.localhost:8000/`}
                                                className="inline-flex items-center gap-1 text-sm text-base-content/60 hover:text-primary transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                </svg>
                                                {tenant.id}.localhost:8000
                                            </a>
                                        </div>

                                        <a
                                            href={`http://${tenant.id}.localhost:8000/`}
                                            className="btn btn-outline btn-primary w-full rounded-xl group-hover:btn-active transition-all"
                                        >
                                            Go to Portal &rarr;
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* Modern Empty State */
                            <div className="text-center py-24 border-2 border-dashed border-base-300 rounded-3xl bg-base-100/50 flex flex-col items-center justify-center">
                                <div className="bg-base-200 p-5 rounded-full mb-5 shadow-inner">
                                    <svg
                                        className="h-10 w-10 text-base-content/40"
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
                                </div>
                                <h3 className="text-xl font-bold mb-2">No organizations found</h3>
                                <p className="text-base-content/60 max-w-sm mx-auto mb-6">
                                    You don't have any active organizations yet. Get started by creating your first organization.
                                </p>
                                <Link
                                    href={route("register-organization")}
                                    className="btn btn-primary rounded-full shadow-md"
                                >
                                    Create First Organization
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
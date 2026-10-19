import React from "react";
import { Head, useForm } from "@inertiajs/react";

export default function RegisterOrganization() {
    // This hook handles our form state and submission to Laravel
    const { data, setData, post, processing, errors } = useForm({
        company_name: "",
        subdomain: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post("/register-organization"); // This sends the data to our web.php route
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Register Organization" />

            <div className="max-w-md w-full space-y-8 bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-white">
                        Create your Workspace
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-400">
                        Start your AI-powered organization
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={submit}>
                    <div className="space-y-4">
                        {/* Company Name Input */}
                        <div>
                            <label
                                htmlFor="company_name"
                                className="text-sm font-medium text-slate-300"
                            >
                                Company Name
                            </label>
                            <input
                                id="company_name"
                                type="text"
                                value={data.company_name}
                                onChange={(e) =>
                                    setData("company_name", e.target.value)
                                }
                                className="mt-1 block w-full rounded-md bg-slate-900 border-slate-700 text-white focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm px-4 py-2"
                                placeholder="Acme Corp"
                            />
                            {errors.company_name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.company_name}
                                </p>
                            )}
                        </div>

                        {/* Subdomain Input */}
                        <div>
                            <label
                                htmlFor="subdomain"
                                className="text-sm font-medium text-slate-300"
                            >
                                Workspace URL
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                                <input
                                    id="subdomain"
                                    type="text"
                                    value={data.subdomain}
                                    onChange={(e) =>
                                        setData("subdomain", e.target.value)
                                    }
                                    className="flex-1 min-w-0 block w-full rounded-none rounded-l-md bg-slate-900 border-slate-700 text-white focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm px-4 py-2"
                                    placeholder="acme"
                                />
                                <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-slate-700 bg-slate-800 text-slate-400 sm:text-sm">
                                    .localhost:8000
                                </span>
                            </div>
                            {errors.subdomain && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.subdomain}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-slate-900 transition-colors disabled:opacity-50"
                    >
                        {processing
                            ? "Creating Workspace..."
                            : "Create Organization Workspace"}
                    </button>
                </form>
            </div>
        </div>
    );
}

import React from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import SettingsLayout from "@/Layouts/SettingsLayout";
import ThemeSwitcher from "@/Components/ThemeSwitcher";

export default function Appearance({ tenantName, tenantId, settings }) {
    // Inertia form handler for branding settings
    const { data, setData, put, processing, recentlySuccessful } = useForm({
        app_name: tenantName || "",
        primary_color: settings?.branding?.primary_color || "",
    });

    const submitBranding = (e) => {
        e.preventDefault();
        // Point this to your backend settings update route when ready
        // put(route('settings.appearance.update'));
        console.log("Saving branding: ", data);
    };

    return (
        <SettingsLayout>
            <Head title={`Appearance Settings - ${tenantName}`} />

            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold tracking-tight">
                        Appearance & Branding
                    </h1>
                    <p className="mt-2 opacity-70">
                        Customize how your organization's portal looks and feels
                        for all employees.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* SECTION 1: THEME & COLORS */}
                    <div className="bg-base-100 rounded-3xl shadow-sm border border-base-300 overflow-hidden flex flex-col md:flex-row">
                        <div className="p-8 md:w-1/2 border-b md:border-b-0 md:border-r border-base-300">
                            <h3 className="text-xl font-bold mb-2">
                                Portal Theme
                            </h3>
                            <p className="text-sm opacity-70 mb-6">
                                Choose a base color palette. This theme will be
                                automatically applied to all users in your
                                workspace.
                            </p>
                            
                            <div className="flex items-center justify-between bg-base-200 p-4 rounded-xl border border-base-300">
                                <span className="font-medium text-sm">Active Theme</span>
                                <ThemeSwitcher />
                            </div>
                        </div>
                        
                        {/* Live Theme Preview Area */}
                        <div className="p-8 md:w-1/2 bg-base-200/30 flex flex-col justify-center">
                            <p className="text-xs font-bold uppercase tracking-wider opacity-50 mb-4">
                                Live UI Preview
                            </p>
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-2">
                                    <button className="btn btn-primary btn-sm flex-1">Primary</button>
                                    <button className="btn btn-secondary btn-sm flex-1">Secondary</button>
                                </div>
                                <div className="flex gap-2">
                                    <button className="btn btn-accent btn-sm flex-1">Accent</button>
                                    <button className="btn btn-neutral btn-sm flex-1">Neutral</button>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <span className="badge badge-success">Success</span>
                                    <span className="badge badge-warning">Warning</span>
                                    <span className="badge badge-error">Error</span>
                                    <span className="badge badge-info">Info</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: WORKSPACE BRANDING */}
                    <div className="bg-base-100 rounded-3xl shadow-sm border border-base-300 p-8">
                        <h3 className="text-xl font-bold mb-2">
                            Workspace Branding
                        </h3>
                        <p className="text-sm opacity-70 mb-8">
                            Update your organization's display name and logo.
                        </p>

                        <form onSubmit={submitBranding} className="space-y-6 max-w-2xl">
                            {/* Organization Name */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-medium">Display Name</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.app_name}
                                    onChange={(e) => setData('app_name', e.target.value)}
                                    className="input input-bordered w-full"
                                    placeholder="e.g. Wayne Enterprises"
                                />
                            </div>

                            {/* Organization Logo (Placeholder for future file upload) */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-medium">Workspace Logo</span>
                                </label>
                                <div className="flex items-center gap-6 mt-2">
                                    <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary font-bold text-2xl flex items-center justify-center border-2 border-dashed border-primary/30">
                                        {data.app_name.charAt(0).toUpperCase()}
                                    </div>
                                    <button type="button" className="btn btn-sm btn-outline">
                                        Upload New Logo
                                    </button>
                                </div>
                            </div>

                            <div className="divider"></div>

                            <div className="flex items-center gap-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="btn btn-primary"
                                >
                                    {processing ? (
                                        <span className="loading loading-spinner loading-sm"></span>
                                    ) : (
                                        "Save Branding"
                                    )}
                                </button>
                                
                                {recentlySuccessful && (
                                    <span className="text-sm text-success font-medium">
                                        Saved successfully!
                                    </span>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* SECTION 3: LAYOUT BUILDER LINK */}
                    <div className="bg-base-100 rounded-3xl shadow-sm border border-base-300 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-xl font-bold mb-1">
                                Dashboard Layout
                            </h3>
                            <p className="text-sm opacity-70 max-w-lg">
                                Want to reorganize the widgets on the member homepage? Open the interactive layout builder to drag and drop elements.
                            </p>
                        </div>
                        <Link href={route('settings.layout')} className="btn btn-neutral whitespace-nowrap">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" /></svg>
                            Launch Portal Builder
                        </Link>
                    </div>

                </div>
            </div>
        </SettingsLayout>
    );
}
import React, { useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";

export default function TenantRegister({ tenantName }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        return () => reset("password", "password_confirmation");
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post("/register");
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-indigo-500 selection:text-white">
            <Head title={`Join | ${tenantName}`} />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="relative max-w-md w-full space-y-8 bg-slate-900/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-slate-800">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">
                        Join {tenantName}
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                        Create your employee account to access the workspace
                    </p>
                </div>

                <form className="mt-8 space-y-5" onSubmit={submit}>
                    <div>
                        <label className="text-sm font-medium text-slate-300">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="mt-1 block w-full rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 transition-colors"
                            required
                            autoFocus
                            autoComplete="name"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-300">
                            Work Email
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className="mt-1 block w-full rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 transition-colors"
                            required
                            autoComplete="username"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-300">
                            Password
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className="mt-1 block w-full rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 transition-colors"
                            required
                            autoComplete="new-password"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-300">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            className="mt-1 block w-full rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 transition-colors"
                            required
                            autoComplete="new-password"
                        />
                        {errors.password_confirmation && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password_confirmation}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex justify-center py-3 px-4 rounded-xl shadow-lg text-sm font-bold text-slate-100 bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 transition-all disabled:opacity-50 mt-4"
                    >
                        {processing ? "Registering..." : "Create Account"}
                    </button>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                            Log in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

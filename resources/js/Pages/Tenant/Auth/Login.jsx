import React, { useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";

export default function TenantLogin({ status, canResetPassword, tenantName }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => reset("password");
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post("/login");
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-cyan-500 selection:text-white">
            <Head title={`Login | ${tenantName}`} />

            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="relative max-w-md w-full space-y-8 bg-slate-900/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-slate-800">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-4">
                        <span className="text-3xl font-bold text-cyan-400">
                            {tenantName.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">
                        {tenantName} Workspace
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                        Enter your credentials to access the AI portal
                    </p>
                </div>

                {status && (
                    <div className="mb-4 font-medium text-sm text-green-400">
                        {status}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={submit}>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-300">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className="mt-1 block w-full rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 focus:ring-cyan-500 px-4 py-3 transition-colors"
                                required
                                autoFocus
                                autoComplete="username"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-2">
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
                                className="mt-1 block w-full rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 focus:ring-cyan-500 px-4 py-3 transition-colors"
                                required
                                autoComplete="current-password"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-2">
                                    {errors.password}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember_me"
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData("remember", e.target.checked)
                                }
                                className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-slate-700 bg-slate-900 rounded"
                            />
                            <label
                                htmlFor="remember_me"
                                className="ml-2 block text-sm text-slate-400"
                            >
                                Remember me
                            </label>
                        </div>

                        {canResetPassword && (
                            <Link
                                href={route("password.request")}
                                className="text-sm font-medium text-cyan-400 hover:text-cyan-300"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex justify-center py-3 px-4 rounded-xl shadow-lg text-sm font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-slate-900 transition-all disabled:opacity-50"
                    >
                        {processing ? "Authenticating..." : "Secure Login"}
                    </button>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        New employee?{" "}
                        <Link
                            href="/register"
                            className="text-cyan-400 hover:text-cyan-300 font-medium"
                        >
                            Create an account
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

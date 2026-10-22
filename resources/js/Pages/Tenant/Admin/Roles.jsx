import React, { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Roles({ tenantId, roles, allPermissions }) {
    // Local state for instant UI updates
    const [rolesData, setRolesData] = useState(roles);
    const [updatingKey, setUpdatingKey] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Keep local state in sync when server props change (like after creating a new role)
    useEffect(() => {
        setRolesData(roles);
    }, [roles]);

    // Form for creating a new role
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            name: "",
        });

    const hasPermission = (role, permissionName) => {
        return role.permissions.some((p) => p.name === permissionName);
    };

    const formatName = (name) => {
        return name
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const handleToggle = (role, permission, isChecked) => {
        const key = `${role.id}-${permission.id}`;
        setUpdatingKey(key);

        // Optimistic UI update
        setRolesData((prevRoles) =>
            prevRoles.map((r) => {
                if (r.id !== role.id) return r;
                const updatedPermissions = isChecked
                    ? [...r.permissions, permission]
                    : r.permissions.filter((p) => p.name !== permission.name);
                return { ...r, permissions: updatedPermissions };
            }),
        );

        router.put(
            route("admin.roles.permissions.update", role.id),
            { permission: permission.name, assigned: isChecked },
            {
                preserveScroll: true,
                onError: () => setRolesData(roles),
                onFinish: () => setUpdatingKey(null),
            },
        );
    };

    const openModal = () => setIsModalOpen(true);

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
        clearErrors();
    };

    const submitCreateRole = (e) => {
        e.preventDefault();
        post(route("admin.roles.store"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AdminLayout>
            <Head title={`Roles & Permissions - ${tenantId}`} />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">
                            Roles & Permissions
                        </h1>
                        <p className="mt-2 opacity-70">
                            Manage access levels and security for your
                            organization.
                        </p>
                    </div>
                    <button
                        className="btn btn-primary shadow-sm"
                        onClick={openModal}
                    >
                        + Create Custom Role
                    </button>
                </div>

                {/* Roles Grid */}
                <div className="grid grid-cols-1 gap-8">
                    {rolesData.map((role) => (
                        <div
                            key={role.id}
                            className="bg-base-100 rounded-3xl shadow-sm border border-base-300 overflow-hidden"
                        >
                            <div className="bg-base-200/50 px-6 py-4 border-b border-base-300 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        {role.name}
                                        {role.name === "Admin" && (
                                            <span className="badge badge-primary badge-sm">
                                                System Default
                                            </span>
                                        )}
                                    </h2>
                                    <p className="text-sm opacity-70 mt-1">
                                        Users with this role currently have{" "}
                                        {role.permissions.length} permissions.
                                    </p>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider opacity-60">
                                    Assigned Permissions
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {allPermissions.map((permission) => {
                                        const isAssigned = hasPermission(
                                            role,
                                            permission.name,
                                        );
                                        const isDisabled =
                                            role.name === "Admin" ||
                                            updatingKey ===
                                                `${role.id}-${permission.id}`;

                                        return (
                                            <div
                                                key={permission.id}
                                                className={`flex items-start justify-between p-4 rounded-xl border transition-colors ${
                                                    isAssigned
                                                        ? "border-primary/30 bg-primary/5"
                                                        : "border-base-300 bg-base-100"
                                                }`}
                                            >
                                                <div className="pr-4">
                                                    <p
                                                        className={`font-medium text-sm ${isAssigned ? "text-primary" : ""}`}
                                                    >
                                                        {formatName(
                                                            permission.name,
                                                        )}
                                                    </p>
                                                    <p className="text-xs opacity-60 mt-1">
                                                        Allows user to{" "}
                                                        {permission.name.replace(
                                                            /_/g,
                                                            " ",
                                                        )}
                                                        .
                                                    </p>
                                                </div>

                                                <input
                                                    type="checkbox"
                                                    className="toggle toggle-primary toggle-sm shrink-0"
                                                    checked={isAssigned}
                                                    disabled={isDisabled}
                                                    onChange={(e) =>
                                                        handleToggle(
                                                            role,
                                                            permission,
                                                            e.target.checked,
                                                        )
                                                    }
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create Custom Role Modal */}
            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">
                            Create Custom Role
                        </h3>
                        <p className="text-sm opacity-70 mt-1">
                            Define a new role. You can assign specific
                            permissions to it once created.
                        </p>

                        <form
                            onSubmit={submitCreateRole}
                            className="mt-6 space-y-4"
                        >
                            <div className="form-control">
                                <label className="label" htmlFor="role-name">
                                    <span className="label-text font-medium">
                                        Role Name
                                    </span>
                                </label>
                                <input
                                    id="role-name"
                                    type="text"
                                    placeholder="e.g., Content Editor"
                                    className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`}
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    autoFocus
                                />
                                {errors.name && (
                                    <span className="text-error text-sm mt-1">
                                        {errors.name}
                                    </span>
                                )}
                            </div>

                            <div className="modal-action">
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={closeModal}
                                    disabled={processing}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={processing}
                                >
                                    {processing && (
                                        <span className="loading loading-spinner loading-xs"></span>
                                    )}
                                    Save Role
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="modal-backdrop" onClick={closeModal}></div>
                </div>
            )}
        </AdminLayout>
    );
}

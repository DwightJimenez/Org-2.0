import React, { useMemo, useState } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Directory({
    tenantName,
    users,
    availableRoles,
    currentUserId,
    canManageRoles = false,
}) {
    const { flash } = usePage().props;
    const [processingId, setProcessingId] = useState(null);
    const [search, setSearch] = useState("");
    const [inviteOpen, setInviteOpen] = useState(false);
    const [revokeTarget, setRevokeTarget] = useState(null);
    const [revoking, setRevoking] = useState(false);
    const [roleError, setRoleError] = useState(null);

    // 1. Determine role management permissions[cite: 2]
    const currentUser = users.find((u) => u.id === currentUserId);
    const hasRoleManagementAccess =
        canManageRoles || currentUser?.role === "Admin";

    const invite = useForm({
        name: "",
        email: "",
        role: availableRoles[0] ?? "",
    });

    const filteredUsers = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return users;
        return users.filter(
            (u) =>
                u.name.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q) ||
                u.role.toLowerCase().includes(q),
        );
    }, [users, search]);

    const handleRoleChange = (userId, newRole) => {
        if (!hasRoleManagementAccess) return;

        setProcessingId(userId);
        setRoleError(null);

        router.put(
            route("directory.role.update", userId),
            { role: newRole },
            {
                preserveScroll: true,
                onError: (errors) =>
                    setRoleError(
                        errors.role ?? "Could not update the role. Try again.",
                    ),
                onFinish: () => setProcessingId(null),
            },
        );
    };

    const submitInvite = (e) => {
        e.preventDefault();
        invite.post(route("directory.invite"), {
            preserveScroll: true,
            onSuccess: () => {
                invite.reset();
                setInviteOpen(false);
            },
        });
    };

    const closeInvite = () => {
        invite.reset();
        invite.clearErrors();
        setInviteOpen(false);
    };

    const confirmRevoke = () => {
        if (!revokeTarget) return;
        setRevoking(true);
        router.delete(route("directory.destroy", revokeTarget.id), {
            preserveScroll: true,
            onSuccess: () => setRevokeTarget(null),
            onFinish: () => setRevoking(false),
        });
    };

    return (
        <AdminLayout>
            <Head title={`Directory - ${tenantName}`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">
                            Organization Directory
                        </h1>
                        <p className="mt-1 opacity-70">
                            Manage members, assign roles, and control access in{" "}
                            {tenantName}.
                        </p>
                    </div>
                    {hasRoleManagementAccess && (
                        <button
                            className="btn btn-primary shadow-sm"
                            onClick={() => setInviteOpen(true)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                />
                            </svg>
                            Invite Member
                        </button>
                    )}
                </div>

                {flash?.success && (
                    <div className="alert alert-success mb-4">
                        <span>{flash.success}</span>
                    </div>
                )}
                {(flash?.error || roleError) && (
                    <div className="alert alert-error mb-4">
                        <span>{flash?.error ?? roleError}</span>
                    </div>
                )}

                <div className="mb-4 flex items-center justify-between gap-4">
                    <input
                        type="search"
                        placeholder="Search by name, email, or role…"
                        className="input input-bordered w-full max-w-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <span className="text-sm opacity-60 whitespace-nowrap">
                        {filteredUsers.length} of {users.length} members
                    </span>
                </div>

                <div className="bg-base-100 rounded-3xl shadow-sm border border-base-300 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead className="bg-base-200/50 text-base-content/70 text-sm uppercase tracking-wider">
                                <tr>
                                    <th>Member</th>
                                    <th>Contact</th>
                                    <th>Role Assignment</th>
                                    <th>Joined</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="text-center py-10 opacity-60"
                                        >
                                            No members found.
                                        </td>
                                    </tr>
                                )}
                                {filteredUsers.map((user) => {
                                    const isSelf = user.id === currentUserId;
                                    const isBusy = processingId === user.id;

                                    // 2. Constraints: Admins cannot be modified, Self cannot be modified[cite: 2]
                                    const isTargetAdmin = user.role === "Admin";
                                    const roleIsLocked =
                                        isSelf ||
                                        isBusy ||
                                        !hasRoleManagementAccess ||
                                        isTargetAdmin;

                                    return (
                                        <tr key={user.id} className="hover">
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar placeholder">
                                                        <div className="bg-neutral text-neutral-content rounded-full w-10">
                                                            <span className="font-semibold">
                                                                {user.name.charAt(
                                                                    0,
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="font-bold flex items-center gap-2">
                                                        {user.name}
                                                        {isSelf && (
                                                            <span className="badge badge-xs badge-primary">
                                                                You
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="opacity-80">
                                                    {user.email}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <select
                                                        className={`select select-bordered select-sm w-full max-w-xs ${
                                                            isTargetAdmin
                                                                ? "text-primary border-primary/50 font-semibold"
                                                                : ""
                                                        } ${roleIsLocked ? "opacity-60 cursor-not-allowed" : ""}`}
                                                        value={user.role}
                                                        disabled={roleIsLocked}
                                                        title={
                                                            isTargetAdmin
                                                                ? "Admin roles cannot be modified"
                                                                : !hasRoleManagementAccess
                                                                  ? "You do not have permission to change roles"
                                                                  : ""
                                                        }
                                                        onChange={(e) =>
                                                            handleRoleChange(
                                                                user.id,
                                                                e.target.value,
                                                            )
                                                        }
                                                    >
                                                        {availableRoles.map(
                                                            (role) => (
                                                                <option
                                                                    key={role}
                                                                    value={role}
                                                                >
                                                                    {role}
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                    {isBusy && (
                                                        <span className="loading loading-spinner loading-xs text-primary"></span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="opacity-70 text-sm">
                                                {user.joined}
                                            </td>
                                            <td className="text-right">
                                                <button
                                                    className="btn btn-ghost btn-sm text-error hover:bg-error/20"
                                                    disabled={roleIsLocked}
                                                    title={
                                                        roleIsLocked
                                                            ? "Cannot revoke this user"
                                                            : ""
                                                    }
                                                    onClick={() =>
                                                        setRevokeTarget(user)
                                                    }
                                                >
                                                    Revoke Access
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {inviteOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Invite a member</h3>
                        <p className="text-sm opacity-70 mt-1">
                            They'll receive an email invitation to join{" "}
                            {tenantName}.
                        </p>

                        <form
                            onSubmit={submitInvite}
                            className="mt-4 space-y-4"
                        >
                            <div className="form-control">
                                <label className="label" htmlFor="invite-name">
                                    <span className="label-text">Name</span>
                                </label>
                                <input
                                    id="invite-name"
                                    type="text"
                                    className={`input input-bordered w-full ${
                                        invite.errors.name ? "input-error" : ""
                                    }`}
                                    value={invite.data.name}
                                    onChange={(e) =>
                                        invite.setData("name", e.target.value)
                                    }
                                    autoFocus
                                />
                                {invite.errors.name && (
                                    <span className="text-error text-sm mt-1">
                                        {invite.errors.name}
                                    </span>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label" htmlFor="invite-email">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    id="invite-email"
                                    type="email"
                                    className={`input input-bordered w-full ${
                                        invite.errors.email ? "input-error" : ""
                                    }`}
                                    value={invite.data.email}
                                    onChange={(e) =>
                                        invite.setData("email", e.target.value)
                                    }
                                />
                                {invite.errors.email && (
                                    <span className="text-error text-sm mt-1">
                                        {invite.errors.email}
                                    </span>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label" htmlFor="invite-role">
                                    <span className="label-text">Role</span>
                                </label>
                                <select
                                    id="invite-role"
                                    className={`select select-bordered w-full ${
                                        invite.errors.role ? "select-error" : ""
                                    }`}
                                    value={invite.data.role}
                                    onChange={(e) =>
                                        invite.setData("role", e.target.value)
                                    }
                                >
                                    {availableRoles.map((role) => (
                                        <option key={role} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                                {invite.errors.role && (
                                    <span className="text-error text-sm mt-1">
                                        {invite.errors.role}
                                    </span>
                                )}
                            </div>

                            <div className="modal-action">
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={closeInvite}
                                    disabled={invite.processing}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={invite.processing}
                                >
                                    {invite.processing && (
                                        <span className="loading loading-spinner loading-xs"></span>
                                    )}
                                    Send Invite
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="modal-backdrop" onClick={closeInvite}></div>
                </div>
            )}

            {revokeTarget && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Revoke access?</h3>
                        <p className="py-4">
                            <strong>{revokeTarget.name}</strong> (
                            {revokeTarget.email}) will immediately lose access
                            to {tenantName}.
                        </p>
                        <div className="modal-action">
                            <button
                                className="btn btn-ghost"
                                onClick={() => setRevokeTarget(null)}
                                disabled={revoking}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-error"
                                onClick={confirmRevoke}
                                disabled={revoking}
                            >
                                {revoking && (
                                    <span className="loading loading-spinner loading-xs"></span>
                                )}
                                Revoke Access
                            </button>
                        </div>
                    </div>
                    <div
                        className="modal-backdrop"
                        onClick={() => !revoking && setRevokeTarget(null)}
                    ></div>
                </div>
            )}
        </AdminLayout>
    );
}

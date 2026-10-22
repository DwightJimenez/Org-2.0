import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

export default function TenantDashboardBuilder({ tenantName }) {
    const [layout, setLayout] = useState([
        { i: "welcome", x: 0, y: 0, w: 12, h: 2, static: true },
        { i: "stats", x: 0, y: 2, w: 8, h: 4 },
        { i: "activity", x: 8, y: 2, w: 4, h: 6 },
        { i: "tasks", x: 0, y: 6, w: 8, h: 5 },
    ]);

    const handleLayoutChange = (newLayout) => {
        setLayout(newLayout);
    };

    return (
        <div className="min-h-screen bg-base-300 p-8 text-base-content border-4 border-dashed border-primary/20">
            <Head title={`Editing Layout - ${tenantName}`} />

            {/* Top Editing Bar */}
            <div className="bg-base-100 rounded-xl shadow-lg p-4 mb-6 flex justify-between items-center max-w-[1200px] mx-auto sticky top-4 z-50">
                <div className="flex items-center gap-3">
                    <span className="badge badge-primary badge-lg animate-pulse">
                        Edit Mode
                    </span>
                    <span className="font-semibold opacity-70">
                        Drag cards by their titles to reorganize.
                    </span>
                </div>

                <div className="flex gap-2">
                    <Link href={route("dashboard")} className="btn btn-ghost">
                        Cancel
                    </Link>
                    <Link href={route("dashboard")} className="btn btn-success">
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
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        Save Layout
                    </Link>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto">
                <GridLayout
                    className="layout"
                    layout={layout}
                    cols={12}
                    rowHeight={50}
                    width={1200}
                    onLayoutChange={handleLayoutChange}
                    draggableHandle=".drag-handle"
                >
                    {/* WIDGET 1 */}
                    <div
                        key="welcome"
                        className="bg-base-100 rounded-2xl shadow opacity-70 border-2 border-primary/20 p-6 flex flex-col justify-center"
                    >
                        <h2 className="text-xl font-bold">
                            Welcome Widget (Fixed)
                        </h2>
                    </div>

                    {/* WIDGET 2 */}
                    <div
                        key="stats"
                        className="bg-base-100 rounded-2xl shadow hover:shadow-lg hover:border-primary border-2 border-transparent transition-all flex flex-col overflow-hidden"
                    >
                        <div className="bg-base-300 px-4 py-2 cursor-move drag-handle font-bold text-sm flex justify-between items-center">
                            <span>📊 Stats Widget</span>
                            <span className="text-xl">⋮⋮</span>
                        </div>
                        <div className="p-4 flex-1 flex items-center justify-center opacity-50 bg-base-200">
                            (Stats Preview)
                        </div>
                    </div>

                    {/* WIDGET 3 */}
                    <div
                        key="activity"
                        className="bg-base-100 rounded-2xl shadow hover:shadow-lg hover:border-primary border-2 border-transparent transition-all flex flex-col overflow-hidden"
                    >
                        <div className="bg-base-300 px-4 py-2 cursor-move drag-handle font-bold text-sm flex justify-between items-center">
                            <span>🔔 Activity Widget</span>
                            <span className="text-xl">⋮⋮</span>
                        </div>
                        <div className="p-4 flex-1 bg-base-200 opacity-50">
                            (Activity Preview)
                        </div>
                    </div>

                    {/* WIDGET 4 */}
                    <div
                        key="tasks"
                        className="bg-base-100 rounded-2xl shadow hover:shadow-lg hover:border-primary border-2 border-transparent transition-all flex flex-col overflow-hidden"
                    >
                        <div className="bg-base-300 px-4 py-2 cursor-move drag-handle font-bold text-sm flex justify-between items-center">
                            <span>✅ Tasks Widget</span>
                            <span className="text-xl">⋮⋮</span>
                        </div>
                        <div className="p-4 flex-1 bg-base-200 opacity-50">
                            (Tasks Preview)
                        </div>
                    </div>
                </GridLayout>
            </div>
        </div>
    );
}

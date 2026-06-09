import React from "react";
import { useNavigate } from "react-router-dom";

interface Project {
    id: number;
    name: string;
    owner: string;
    status: "Active" | "Completed" | "Archived";
    members: number;
    dueDate: string;
}

export default function Dashboard() {
    const navigate = useNavigate();

    const projects: Project[] = [
        {
            id: 1,
            name: "Website Redesign",
            owner: "John Doe",
            status: "Active",
            members: 5,
            dueDate: "2026-07-15",
        },
        {
            id: 2,
            name: "Mobile Application",
            owner: "Sarah Smith",
            status: "Active",
            members: 8,
            dueDate: "2026-08-10",
        },
        {
            id: 3,
            name: "CRM Migration",
            owner: "Michael Brown",
            status: "Completed",
            members: 4,
            dueDate: "2026-05-20",
        },
    ];

    const getStatusClass = (status: Project["status"]) => {
        switch (status) {
            case "Active":
                return "bg-green-100 text-green-700";
            case "Completed":
                return "bg-blue-100 text-blue-700";
            case "Archived":
                return "bg-gray-100 text-gray-700";
            default:
                return "";
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">
                            Projects
                        </h1>
                        <p className="text-slate-500">
                            Manage and track all projects.
                        </p>
                    </div>

                    <button
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        onClick={() => navigate("/projects/create")}
                    >
                        New Project
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl bg-white shadow">
                    <table className="w-full">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Project Name
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Owner
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Members
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Due Date
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {projects.map((project) => (
                                <tr
                                    key={project.id}
                                    onClick={() => navigate(`/projects/${project.id}`)}
                                    className="cursor-pointer border-t hover:bg-slate-50"
                                >
                                    <td className="px-6 py-4 font-medium text-slate-800">
                                        {project.name}
                                    </td>

                                    <td className="px-6 py-4 text-slate-600">
                                        {project.owner}
                                    </td>

                                    <td className="px-6 py-4 text-slate-600">
                                        {project.members}
                                    </td>

                                    <td className="px-6 py-4 text-slate-600">
                                        {project.dueDate}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                                                project.status
                                            )}`}
                                        >
                                            {project.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
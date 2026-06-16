import { useNavigate } from "react-router-dom";
import { type Project } from "../interfaces/IProject";
import { useState, useEffect } from "react";
import { getProjects, createProject } from "../services/projectService";
import Badge from "../components/Badge";

export default function Dashboard() {
    const navigate = useNavigate();

    //===================== HOOKS =================
    const [projects, setProjects] = useState<Project[]>([]);

    //Load projects on page loading
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) return;

        const loadProjects = async () => {
            try {
                const data = await getProjects();
                setProjects(data);
            } catch (error) {
                console.error(error);
            }
        };

        loadProjects();
    }, []);

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
                        onClick={async () => {
                            try
                            {
                                const project = await createProject({ name: "New Project", description: "" });

                                navigate(`/projects/${project.id}`);
                            }
                            catch (error)
                            {
                                console.error(error);
                                alert("Failed to create project");
                            }
                        }}
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
                                    Created At
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
                                    <td className="px-6 py-4 text-left font-medium text-slate-800">
                                        {project.name}
                                    </td>

                                    <td className="px-6 py-4 text-left text-slate-600">
                                        {project.owner}
                                    </td>

                                    <td className="px-6 py-4 text-left text-slate-600">
                                        {project.totalMembers}
                                    </td>

                                    <td className="px-6 py-4 text-left text-slate-600">
                                        {new Date(project.createdAt).toLocaleDateString("sv-SE")}
                                    </td>

                                    <td className="px-6 py-4 text-left">
                                        <Badge variant={project.status === "Active" ? "active" : "default"}>
                                            {project.status}
                                        </Badge>
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
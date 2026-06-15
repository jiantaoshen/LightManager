import { useState, useEffect } from "react";
import { getProject, updateProject, deleteProject } from "../services/projectService";
import { useParams, useNavigate } from "react-router-dom";
import { type Task, type Status } from "../interfaces/ITask";
import { type Project, type Member } from "../interfaces/IProject";
import { getTasks, createTask, updateTask, deleteTask } from "../services/taskService";
import { findUserByEmail } from "../services/userService";

import ProjectStatusBadge  from '../components/StatusBadge';

export default function KanbanBoard() {
    const navigate = useNavigate();
    const { projectId } = useParams<{ projectId: string }>();
    const statuses: Status[] = ["Todo", "In Progress", "Review", "Done"];

    // ===================== STATE =====================
    // For project details
    const [project, setProject] = useState<Project | null>(null); //For display project details normal in header
    const [editProject, setEditProject] = useState<Project | null>(null); //For display project detail in edit mode in header

    // For tasks and kanban
    const [tasks, setTasks] = useState<Task[]>([]);
    const [draggedTask, setDraggedTask] = useState<Task | null>(null);
    const [isEditingProject, setIsEditingProject] = useState(false);

    // For task modal
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // For members management
    const [members, setMembers] = useState<Member[]>([]); //For display members normal in header
    const [editMembers, setEditMembers] = useState<Member[]>([]); //For display members in edit mode in header
    const [newEmail, setNewEmail] = useState(""); //For email input in add member feature
    const [loadingAdd, setLoadingAdd] = useState(false); 

    // Get current user role
    const currentUserId = JSON.parse(localStorage.getItem("user") || "null").userId;
    const myRole = project?.members.find(m => m.userId === currentUserId)?.role;

    // ========== LOAD PROJECT INFO and TASKS  ===============
    useEffect(() => {
        if (!projectId) return;

        const load = async () => {
            try {
                const projectData = await getProject(Number(projectId));
                setProject(projectData);
                setEditProject(projectData);

                setMembers(projectData.members);
                setEditMembers(projectData.members);

                const tasksData = await getTasks(Number(projectId));
                setTasks(tasksData);


            } catch (err) {
                console.error(err);
            }
        };

        load();
    }, [projectId]);

    // ===================== DRAG LOGIC =====================
    const handleDropColumn = async (newStatus: Status) => {
        if (!draggedTask) return;

        const updatedTask = {...draggedTask,status: newStatus,};

        setTasks(tasks => tasks.map(t => t.id === updatedTask.id ? updatedTask : t));

        await updateTask(Number(projectId),updatedTask.id,updatedTask);
    };

    const loadTasks = async () => {
        if (!projectId) return;

        try {
            const data = await getTasks(Number(projectId));

            setTasks(data);
        } catch (error) {
            console.error("Failed to load tasks:", error);
        }
    };

    // ===================== SAVE PROJECT =====================
    const handleSave = async () => {
        if (!editProject) return;

        try {
            const updated = await updateProject(editProject.id, { ...editProject, members: editMembers });

            setProject(updated);
            setIsEditingProject(false);
            setEditProject(null);
            setMembers(updated.members);

        } catch (err) {
            console.error(err);
            alert("Failed to update project");
        }
    };


    // ===================== DELETE PROJECT =====================
    const handleDelete = async () => {
        if (!project) return;

        const confirmed = window.confirm("Delete project?");
        if (!confirmed) return;

        try {
            await deleteProject(project.id);
            navigate("/");
        } catch (err) {
            console.error(err);
            alert("Failed to delete project");
        }
    };

    //===================== Member Badge =====================
    function getRoleBadgeClass(role: string) {
        const base = "px-3 py-1 rounded-full flex items-center gap-2";

        switch (role) {
            case "Owner":
                return `${base} bg-red-100 text-red-700`;

            case "Admin":
                return `${base} bg-orange-100 text-orange-700`;

            case "Member":
                return `${base} bg-blue-100 text-blue-700`;

            default:
                return `${base} bg-slate-100 text-slate-700`;
        }
    }


    // ===================== UI =====================
    return (
        <>
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-7xl">

                {/* HEADER */}
                <div className="mb-8 rounded-xl bg-white p-6 shadow">

                    {!isEditingProject ? (
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1> {project?.name} </h1>

                                    <ProjectStatusBadge status={project?.status} />
                                </div>

                                <p> {project?.description} </p>

                                {/* MEMBERS */}
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {members.map((m) => (
                                        <div key={m.userId}
                                            className={getRoleBadgeClass(m.role)}
                                        >
                                            {m.userName} ({m.role})
                                        </div>
                                    ))}
                                </div>
                            </div>

                             <div className="flex items-center gap-2">
                                {myRole === "Owner" || myRole === "Admin" ? (
                                    <button onClick={() => {
                                        setEditProject(project);
                                        setIsEditingProject(true);
                                    }}
                                        className="flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                                    >
                                        <span>Edit</span>
                                    </button>
                                ) : null}

                                {myRole === "Owner" ? (
                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center gap-1 rounded-md bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                                    >
                                        <span>Delete</span>
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">

                            {/* NAME */}
                            <input
                                className="w-full border p-2 rounded"
                                value={editProject?.name || ""}
                                onChange={(e) => setEditProject((prev) => prev ? { ...prev, name: e.target.value } : prev)}
                            />

                            {/* DESCRIPTION */}
                            <textarea
                                className="w-full border p-2 rounded"
                                value={editProject?.description || ""}
                                onChange={(e) => setEditProject((prev) =>prev? {...prev, description: e.target.value}: prev)}
                            />

                            {/* STATUS */}
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium">
                                    Status
                                </label>

                                <select
                                    value={editProject?.status ?? "Active"}
                                    onChange={(e) => setEditProject(prev => prev ? { ...prev, status: e.target.value as "Active" | "Archived" } : prev)}
                                    className="rounded border p-2"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Archived">Archived</option>
                                </select>
                            </div>

                            {/* MEMBERS */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                {editMembers.map((m) => (
                                    <span
                                        key={m.userId}
                                        className={getRoleBadgeClass(m.role)}
                                    >
                                        {m.userName}

                                        {/* CHANGE ROLE */}
                                        <select
                                            value={m.role}
                                            disabled={m.role === "Owner"}
                                            onChange={(e) => {setEditMembers(prev =>
                                                prev.map(member => member.userId === m.userId ? { ...member, role: e.target.value }: member));
                                            }}
                                            className="rounded border p-2 disabled:bg-slate-100 disabled:text-slate-500"
                                        >
                                            <option value="Admin">Admin</option>
                                            <option value="Member">Member</option>
                                        </select>

                                        {m.role !== "Owner" && (
                                            <button
                                                className="text-red-500"
                                                onClick={() => { setEditMembers(prev =>prev.filter(member => member.userId !== m.userId));}}
                                            >
                                                ×
                                            </button>
                                        )}
                                    </span>
                                ))}
                            </div>

                            {/* ADD MEMBER INPUT */}
                            <div className="flex gap-2 mb-4">
                                <input type="email"
                                    className="border p-2 flex-1"
                                    placeholder="user@email.com"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                />

                                <button
                                    onClick={async () => {
                                        if (!newEmail.trim()) return;

                                        setLoadingAdd(true);

                                        const user = await findUserByEmail(newEmail);

                                        if (user == null) return; 

                                        const newMember = {
                                            userId: user.id,
                                            userName: user.userName,
                                            email: user.email,
                                            role: "Member"
                                        };

                                        setEditMembers(prev => {
                                            const exists = prev.some(m => m.userId === user.id);
                                            if (exists) return prev;

                                            return [...prev, newMember];
                                        });

                                        setNewEmail("");
                                        setLoadingAdd(false);
                                    }}
                                    disabled={loadingAdd}
                                    className="bg-green-600 text-white px-3 rounded"
                                >
                                    {loadingAdd ? "..." : "Add"}
                                </button>
                            </div>

                            {/* BUTTONS */}
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSave}
                                    className="bg-green-600 text-white px-4 py-2 rounded"
                                >
                                    Save
                                </button>

                                <button
                                    onClick={() => setIsEditingProject(false)}
                                    className="bg-gray-300 px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                    </div>

                    {/* NEW TASK BUTTON */  }
                    <button onClick={() => {
                            setSelectedTask({
                                id: 0,
                                title: "",
                                description: "",
                                status: "Todo",
                                priority: "High",
                                assignedUserId: null,
                                assignedUserName: null
                            });

                            setIsTaskModalOpen(true);
                        }}
                        className="mb-4 rounded bg-blue-600 px-4 py-2 text-white"
                    >
                        + New Task
                    </button>

                {/* KANBAN */}
                    <div className="grid grid-cols-4 gap-4">
                        {statuses.map((status) => (
                            <div
                                key={status}
                                className="min-h-[400px] rounded bg-white p-4 shadow"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => handleDropColumn(status)}
                            >
                                <h2 className="mb-3 font-bold">{status}</h2>

                                {tasks.filter((t) => t.status === status)
                                    .map((task) => (
                                        <div key={task.id}
                                            draggable
                                            onDragStart={() => setDraggedTask(task)}

                                            onClick={() => {
                                                setSelectedTask(task);
                                                setIsTaskModalOpen(true);
                                            }}
                                            className="mb-3 cursor-pointer rounded-lg border border-slate-200 bg-slate-50 p-3 shadow-sm transition hover:shadow"
                                        >
                                            {/* Title */}
                                            <h3 className="font-medium text-slate-800">
                                                {task.title}
                                            </h3>

                                            {/* Assigned Member */}
                                            <p className="mt-2 text-sm text-slate-500">
                                                Assigned to:{" "}
                                                {task.assignedUserName || "Unassigned"}
                                            </p>

                                            {/* Priority */}
                                            <div className="mt-3 flex items-center justify-between">
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs font-medium ${task.priority === "High"
                                                            ? "bg-red-100 text-red-700"
                                                            : task.priority === "Medium"
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : "bg-green-100 text-green-700"
                                                        }`}
                                                >
                                                    {task.priority}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ))}
                    </div>
            </div>
        </div>

            {/* TASK MODAL */}
            {isTaskModalOpen && selectedTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">

                        <h2 className="mb-4 text-xl font-bold">
                            {selectedTask.id === 0 ? "Create Task" : "Edit Task"}
                        </h2>

                        <div className="space-y-4">

                            {/* TITLE */ }
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Title
                                </label>

                                <input
                                    type="text"
                                    value={selectedTask.title}
                                    onChange={(e) => setSelectedTask({...selectedTask,title: e.target.value}) }
                                    className="w-full rounded border px-3 py-2"
                                />
                            </div>

                            {/* DESCRIPTION */ }
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Description
                                </label>

                                <textarea
                                    rows={4}
                                    value={selectedTask.description || ""}
                                    onChange={(e) => setSelectedTask({...selectedTask,description: e.target.value})}
                                    className="w-full rounded border px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Priority
                                </label>

                                <select
                                    value={selectedTask.priority}
                                    onChange={(e) =>setSelectedTask({...selectedTask, priority: e.target.value as "Low" | "Medium" | "High"})}
                                    className="w-full rounded border px-3 py-2"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Status
                                </label>

                                <select
                                    value={selectedTask.status}
                                    onChange={(e) => setSelectedTask({...selectedTask, status: e.target.value as Status})}
                                    className="w-full rounded border px-3 py-2"
                                >
                                    {statuses.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Assign To
                                </label>

                                <select
                                    value={selectedTask.assignedUserId}
                                    onChange={(e) => {  
                                        setSelectedTask({ ...selectedTask, assignedUserId: e.target.value === "" ? null : e.target.value });
                                    }}
                                    className="w-full rounded border p-2"
                                >
                                    <option value="">Unassigned</option>

                                    {(project?.members ?? []).map((member) => (
                                        <option key={member.userId} value={member.userId}>
                                            {member.userName} ({member.role})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-between">
                            {/* Save button that create task if the task does not exits, otherwise edit task*/ }
                            <button onClick={async () => {
                                if (selectedTask.id === 0) await createTask(Number(projectId), selectedTask);
                                else await updateTask(Number(projectId), selectedTask.id, selectedTask);
                                    
                                await loadTasks();
                                setIsTaskModalOpen(false);
                                setSelectedTask(null);
                                }}

                                className="rounded bg-green-600 px-4 py-2 text-white"
                            >
                                Save
                            </button>

                            {/* Delete button that shows only when you click on the task*/ }
                            {selectedTask.id !== 0 && (
                                <button onClick={async () => {
                                    await deleteTask(Number(projectId), selectedTask.id);

                                    await loadTasks();

                                    setIsTaskModalOpen(false);
                                    setSelectedTask(null);
                                    }}

                                    className="rounded bg-red-600 px-4 py-2 text-white"
                                >
                                    Delete
                                </button>
                            )}

                            <button
                                onClick={() => {
                                    setIsTaskModalOpen(false);
                                    setSelectedTask(null);
                                }}
                                className="rounded bg-slate-300 px-4 py-2"
                            >
                                Cancel
                            </button>

                        </div>
                    </div>
                </div>
                )}
            </>
        );
}  

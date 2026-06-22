import { useState, useEffect } from "react";
import { getProject, updateProject, deleteProject } from "../services/projectService";
import { useParams, useNavigate } from "react-router-dom";
import { type Task, type Status } from "../interfaces/ITask";
import { type Project, type Member } from "../interfaces/IProject";
import { getTasks, createTask, updateTask, deleteTask } from "../services/taskService";
import { findUserByEmail } from "../services/userService";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Input from "../components/InputForm";

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

    const loadTasks = async () => {
        if (!projectId) return;

        try {
            const data = await getTasks(Number(projectId));
            setTasks(data);
        } catch (error) {
            console.error("Failed to load tasks:", error);
        }
    };

    // ===================== DRAG LOGIC =====================
    const handleDropColumn = async (newStatus: Status) => {
        if (!draggedTask) return;

        const updatedTask = {...draggedTask,status: newStatus,};

        setTasks(tasks => tasks.map(t => t.id === updatedTask.id ? updatedTask : t));

        await updateTask(Number(projectId),updatedTask.id,updatedTask);
    };

    // ===================== SAVE PROJECT Details =====================
    const handleSave = async () => {
        if (!editProject) return;

        try {
            const updated = await updateProject(editProject.id, {
                name: editProject.name,
                description: editProject.description ?? "",
                status: editProject.status,
                members: editMembers});

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
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            alert("Failed to delete project");
        }
    };

    const closeTaskModal = async () => {
        await loadTasks();
        setIsTaskModalOpen(false);
        setSelectedTask(null);
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
                                <div className="flex flex-col">
                                    {/* Title */}
                                    <div className="flex items-center gap-3">
                                        <h1> {project?.name} </h1>

                                        <Badge variant={project?.status === "Active" ? "active" : "default"}>
                                            {project?.status}
                                        </Badge>
                                    </div>

                                    {/* Description */}
                                    <div className="flex">
                                        <p>{project?.description}</p>
                                    </div>

                                    {/* Members */}
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {members.map((m) => (
                                            <Badge key={m.userId} variant={m.role === "Owner" ? "priority1" : m.role === "Admin" ? "priority2" : "priority3"}>
                                                {m.userName} ({m.role})
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Edit and Delete button*/ }
                                {myRole === "Owner" ? (
                                    <div className="flex items-center gap-2">
                                        <Button onClick={() => {
                                            setEditProject(project);
                                            setIsEditingProject(true);
                                        }}
                                                variant="primary"
                                        >
                                            Edit
                                        </Button>

                                        <Button onClick={handleDelete} variant="danger">
                                            Delete
                                        </Button>
                                    </div>

                                ) : null}
                            </div>
                        ) : (
                            <div className="space-y-4">

                                {/* Title */}
                                <Input label="Title"
                                    value={editProject?.name || ""}
                                    onChange={(value) => setEditProject((prev) => prev ? { ...prev, name: value } : prev)} />


                                {/* Description */}
                                <label>Description</label>
                                <textarea value={editProject?.description || ""}
                                    onChange={(e) => setEditProject((prev) => prev ? { ...prev, description: e.target.value } : prev)}
                                    className="w-full border p-2 rounded"
                                />

                                {/* Status */}
                                <div className="flex items-center gap-2">
                                    <label> Status </label>

                                    <select value={editProject?.status ?? "Active"}
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
                                        <Badge key={m.userId} variant={m.role === "Owner" ? "priority1" : m.role === "Admin" ? "priority2" : "priority3"}>
                                            {m.userName}

                                            {/* CHANGE ROLE */}
                                            <select value={m.role}
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
                                                <button onClick={() => { setEditMembers(prev => prev.filter(member => member.userId !== m.userId)); }}
                                                    className="text-red-500"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </Badge>
                                    ))}
                                </div>

                                {/* ADD MEMBER INPUT */}
                                <div className="flex gap-2 mb-4">
                                    <Input type="email" placeholder="Add member by email" value={newEmail} onChange={(value) => setNewEmail(value)} />

                                    <Button onClick={async () => {
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

                                            setEditMembers(prev => { const exists = prev.some(m => m.userId === user.id);
                                                if (exists) return prev;

                                                return [...prev, newMember];
                                            });

                                            setNewEmail("");
                                            setLoadingAdd(false);
                                        }}
                                        disabled={loadingAdd}
                                           variant="success"
                                    >
                                        {loadingAdd ? "..." : "Add"}
                                    </Button>
                                </div>

                                {/* BUTTONS */}
                                <div className="flex gap-2">
                                    <Button onClick={handleSave} variant="success">
                                        Save
                                    </Button>

                                    <Button onClick={() => setIsEditingProject(false)} variant="secondary">
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* NEW TASK BUTTON */}
                    {(myRole === "Admin" || myRole === "Owner") && (
                        <div className="flex justify-center mb-3">
                            <Button onClick={() => {
                                    setSelectedTask({
                                        id: 0,
                                        title: "",
                                        description: "",
                                        status: "Todo",
                                        priority: "High",
                                        dueDate: undefined,
                                        assignedUsers: []
                                    });

                                    setIsTaskModalOpen(true);
                                }}
                            >
                                + New Task
                            </Button>
                        </div>
                    )}

                    {/* KANBAN */}
                    <div className="grid grid-cols-4 gap-4">
                        {statuses.map((status) => (
                            <div key={status}
                                className="min-h-[400px] rounded bg-white p-4 shadow"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => handleDropColumn(status)}
                            >
                                <h2 className={`mb-3 rounded px-3 py-2 font-bold text-white
                                    ${status === "In Progress" ? "bg-blue-100" : status === "Review" ? "bg-purple-100"
                                        : status === "Done" ? "bg-green-100" : "bg-slate-100"}`}
                                >
                                    {status}
                                </h2>

                                {tasks.filter((t) => t.status === status)
                                    .sort((a, b) => {
                                        const priorityOrder = {
                                            High: 3,
                                            Medium: 2,
                                            Low: 1
                                        };

                                        return priorityOrder[b.priority] - priorityOrder[a.priority];
                                    })
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
                                            {/* Title + Priority */}
                                            <div className="mt-3 flex items-center">
                                                {/* LEFT spacer */}
                                                <div className="w-10" />

                                                {/* CENTER title */}
                                                <h3 title={task.title}
                                                    className="flex-1 min-w-0 text-center font-medium text-slate-800 truncate"
                                                >
                                                    {task.title}
                                                </h3>

                                                {/* RIGHT badge */}
                                                <Badge variant={task.priority === "High" ? "priority1" : task.priority === "Medium" ? "priority2" : "priority3"}>
                                                    {task.priority}
                                                </Badge>
                                            </div>

                                            {/* Assigned Member */}
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                {(task.assignedUsers ?? []).length > 0 ? (
                                                    task.assignedUsers.map((u) => (
                                                        <Badge key={u.userId} variant="active">
                                                            {u.userName}
                                                        </Badge>
                                                    ))
                                                ) : null }
                                            </div>

                                            {task.dueDate && (
                                                <p className="mt-2">
                                                    Due Date: {new Date(task.dueDate).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ============================== TASK MODAL ================================= */}
            {isTaskModalOpen && selectedTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                        <div className="space-y-4">

                            {/* TITLE */}
                            <Input label="Title"
                                value={selectedTask.title}
                                type = "text"
                                onChange={(value) => setSelectedTask(prev => prev ? { ...prev, title: value } : prev)} />

                            {/* DESCRIPTION */ }
                            <>
                                <label>
                                    Description
                                </label>

                                 <textarea rows={4}
                                        value={selectedTask.description || ""}
                                        onChange={(e) => setSelectedTask({...selectedTask,description: e.target.value})}
                                        className="w-full rounded border px-3 py-2"
                                    />
                            </>

                            {/* DROPDOWN ROWS (same row layout) */}
                            <div className="grid grid-cols-2 gap-4">

                                {/* PRIORITY */}
                                <div>
                                    <label>
                                        Priority
                                    </label>

                                    <select
                                        value={selectedTask.priority}
                                        onChange={(e) => setSelectedTask({
                                                ...selectedTask,
                                                priority: e.target.value as "Low" | "Medium" | "High"
                                        })}
                                        className="w-full rounded border px-3 py-2"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>

                                {/* DUE DATE */}
                                <Input label="Due Date"
                                    type="date"
                                    value={selectedTask.dueDate? new Date(selectedTask.dueDate).toLocaleDateString("sv-SE") : ""}
                                    onChange={(value) => setSelectedTask({ ...selectedTask, dueDate: value ? new Date(value) : undefined })}
                                />                               
                            </div>

                            <label>Assignees</label>
                            <div className="flex flex-wrap gap-2">
                                {project?.members.map((m) => {
                                    return (
                                        <Badge key={m.userId}
                                            variant={(selectedTask?.assignedUsers ?? []).some( u => u.userId === m.userId) ? "active": "default"}
                                            className="cursor-pointer transition hover:opacity-80"
                                            onClick={() => setSelectedTask(prev => {
                                                if (!prev) return prev;

                                                const exists = (prev.assignedUsers ?? []).some(u => u.userId === m.userId);

                                                return { ...prev, assignedUsers : exists ? (prev.assignedUsers ?? []).filter( u => u.userId !== m.userId)
                                                    : [...(prev.assignedUsers ?? []),
                                                        {
                                                            userId: m.userId,
                                                            userName: m.userName
                                                        }
                                                    ]};
                                            })}
                                        >
                                            {m.userName}
                                        </Badge>
                                    );
                                })}
                            </div>
                        </div>


                        <div className="mt-6 flex justify-between">
                            {/* Save button that create task if the task does not exits, otherwise edit task*/ }
                            <Button onClick={async () => {
                                    if (selectedTask.id === 0) await createTask(Number(projectId), selectedTask);
                                    else await updateTask(Number(projectId), selectedTask.id, selectedTask);

                                    closeTaskModal();
                                    }}
                                    variant="success"
                            >
                                Save
                            </Button>

                            {/* Delete button that shows only when you click on the task*/ }
                                {selectedTask.id !== 0 && (myRole === "Admin" || myRole === "Owner") ? (
                                <Button onClick={async () => {
                                        await deleteTask(Number(projectId), selectedTask.id);

                                        closeTaskModal();
                                }}

                                        variant="danger"
                                >
                                    Delete
                                </Button>
                            ): null }

                            <Button onClick={closeTaskModal} variant="secondary">
                                Cancel
                            </Button>

                        </div>
                    </div>
                </div>
                )}
        </>
    );
}  

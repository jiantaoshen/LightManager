// This component displays a badge indicating the status of a project (Active or Archived). Used in the Dashboard and Kanbanboard pages.

export default function ProjectStatusBadge({ status }: { status: "Active" | "Archived" }) {
    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
            {status}
        </span>
    );
}
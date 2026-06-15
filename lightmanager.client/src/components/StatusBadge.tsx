// This component displays a badge indicating the status of a project (Active or Archived). Used in the Dashboard and Kanbanboard pages.

export default function ProjectStatusBadge({ status }: { status: "Active" | "Archived" }) {
    return (
        <span className={`status-badge ${status === "Active" ? "status-active" : "status-archived"}`}>
            {status}
        </span>
    );
}
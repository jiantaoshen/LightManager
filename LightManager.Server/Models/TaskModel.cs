using LightManager.Server.Data;

namespace LightManager.Server.Models
{
    public class TaskModel
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string Status { get; set; } = "ToDo";

        public string Priority { get; set; } = "Medium";

        public DateTime? DueDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int ProjectId { get; set; }

        public ProjectModel Project { get; set; } = null!;

        public string? AssignedUserId { get; set; }

        public ApplicationUser? AssignedUser { get; set; }
    }
}

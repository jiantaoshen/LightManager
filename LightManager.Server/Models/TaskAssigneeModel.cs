using LightManager.Server.Data;

namespace LightManager.Server.Models
{
    public class TaskAssigneeModel
    {
        public int TaskId { get; set; }
        public TaskModel Task { get; set; } = null!;

        public string UserId { get; set; }
        public ApplicationUser User { get; set; } = null!;

        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    }
}

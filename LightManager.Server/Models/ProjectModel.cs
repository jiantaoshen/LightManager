using LightManager.Server.Data;
namespace LightManager.Server.Models
{
    public class ProjectModel
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string Status { get; set; } = "Active";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string CreatedByUserId { get; set; } = string.Empty;

        public ApplicationUser? CreatedByUser { get; set; }

        public ICollection<ProjectMemberModel> Members { get; set; } = new List<ProjectMemberModel>();

        public ICollection<TaskModel> Tasks { get; set; } = new List<TaskModel>();
    }
}

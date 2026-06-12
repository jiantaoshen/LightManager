using LightManager.Server.Data;

namespace LightManager.Server.Models
{
    public class ProjectMemberModel
    {
        public int ProjectId { get; set; }
        public ProjectModel Project { get; set; } = null!;

        public string UserId { get; set; }
        public ApplicationUser User { get; set; } = null!;

        public string Role { get; set; } = "Member";
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
    }
}

using LightManager.Server.Models;
using Microsoft.AspNetCore.Identity;
namespace LightManager.Server.Data;

// Add profile data for application users by adding properties to the ApplicationUser class
public class ApplicationUser : IdentityUser
{

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<ProjectModel> CreatedProjects { get; set; }
        = new List<ProjectModel>();

    public ICollection<ProjectMemberModel> ProjectMembers { get; set; }
        = new List<ProjectMemberModel>();

    public ICollection<TaskModel> AssignedTasks { get; set; }
        = new List<TaskModel>();
}

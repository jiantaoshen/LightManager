/*
 * File: Data/ApplicationUser.cs
 * Purpose: Extends ASP.NET Identity users with display name, creation time, and owned tasks.
 * Type: ApplicationUser.
 */

using LightManager.Server.Models;
using Microsoft.AspNetCore.Identity;

namespace LightManager.Server.Data;

public class ApplicationUser : IdentityUser
{
    public string DisplayName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<TaskModel> Tasks { get; set; } = new List<TaskModel>();
}

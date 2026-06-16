using LightManager.Server.Data;

namespace LightManager.Server.Models
{
    public class TaskModel
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Status { get; set; } = "ToDo";

        public string Priority { get; set; } = "Medium";

        public DateTime? DueDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign key to the project this task belongs to
        public int ProjectId { get; set; }

        public ProjectModel Project { get; set; } = null!;


        //Multiple users can be assigned to a task, so we use a many-to-many relationship
        public List<TaskAssigneeModel> AssignedUsers { get; set; } = new(); 
    }
}

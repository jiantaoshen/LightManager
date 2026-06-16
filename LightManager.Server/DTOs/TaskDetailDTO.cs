namespace LightManager.Server.DTOs
{
    public class TaskDetailDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string Status { get; set; } = "Todo";

        public string Priority { get; set; } = "Medium";

        public List<TaskUserDTO> AssignedUsers { get; set; } = new();

        public DateTime? DueDate { get; set; }
    }

    public class TaskUserDTO
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
    }
}

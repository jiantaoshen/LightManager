namespace LightManager.Server.DTOs
{
    public class CreateTaskDTO
    {
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string Status { get; set; } = "Todo";

        public string Priority { get; set; } = "Medium";

        public string? AssignedUserId { get; set; }
    }
}

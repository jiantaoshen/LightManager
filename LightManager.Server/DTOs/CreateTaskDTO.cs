namespace LightManager.Server.DTOs
{
    public class CreateTaskDTO
    {
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Status { get; set; } = "Todo";

        public string Priority { get; set; } = "Medium";

        public List<string> AssignedUserIds { get; set; } = new();

        public DateTime? DueDate { get; set; } 
    }
}

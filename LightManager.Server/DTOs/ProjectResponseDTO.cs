namespace LightManager.Server.DTOs
{
    public class ProjectResponseDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

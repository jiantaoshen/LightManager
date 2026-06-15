namespace LightManager.Server.DTOs
{
    public class ProjectsDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public string Owner { get; set; }

        public string Status { get; set; }

        public DateTime CreatedAt { get; set; }

        public int TotalMembers { get; set; }
    }
}

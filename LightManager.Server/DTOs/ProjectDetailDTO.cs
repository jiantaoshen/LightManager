namespace LightManager.Server.DTOs
{
    public class ProjectDetailDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public string? Description { get; set; }

        public string? Owner { get; set; }

        public string Status { get; set; } = "Active";

        public DateTime CreatedAt { get; set; }

        public List<ProjectMemberDTO> Members { get; set; } = new();
    }

    public class ProjectMemberDTO
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string Role { get; set; }
    }
}

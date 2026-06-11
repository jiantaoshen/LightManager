namespace LightManager.Server.DTOs
{
    public class ProjectDetailsDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public string Description { get; set; } = string.Empty;

        public List<ProjectMemberDTO> Members { get; set; } = new();
    }

    public class ProjectMemberDTO
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string Role { get; set; }
    }
}

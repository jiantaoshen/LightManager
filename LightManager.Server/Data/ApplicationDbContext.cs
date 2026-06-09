using LightManager.Server.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace LightManager.Server.Data
{
    public class ApplicationDbContext : IdentityDbContext<LightManager.Server.Data.ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options): base(options)
        {
        }

        public DbSet<ProjectModel> Projects => Set<ProjectModel>();

        public DbSet<ProjectMemberModel> ProjectMembers => Set<ProjectMemberModel>();

        public DbSet<TaskModel> Tasks => Set<TaskModel>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ProjectMemberModel>()
                .HasKey(pm => new
                {
                    pm.ProjectId,
                    pm.UserId
                });

            modelBuilder.Entity<ProjectMemberModel>()
                .HasOne(pm => pm.Project)
                .WithMany(p => p.Members)
                .HasForeignKey(pm => pm.ProjectId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ProjectMemberModel>()
                .HasOne(pm => pm.User)
                .WithMany(u => u.ProjectMembers)
                .HasForeignKey(pm => pm.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}

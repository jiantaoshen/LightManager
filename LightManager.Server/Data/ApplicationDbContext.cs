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

        public DbSet<TaskAssigneeModel> TaskAssignees => Set<TaskAssigneeModel>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ProjectMemberModel>()
                .HasKey(pm => new{pm.ProjectId,pm.UserId});

            modelBuilder.Entity<ProjectMemberModel>()
                .HasOne(pm => pm.Project)
                .WithMany(p => p.Members)
                .HasForeignKey(pm => pm.ProjectId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<ProjectMemberModel>()
                .HasOne(pm => pm.User)
                .WithMany(u => u.ProjectMembers)
                .HasForeignKey(pm => pm.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<TaskAssigneeModel>()
                .HasKey(x => new { x.TaskId, x.UserId });

            modelBuilder.Entity<TaskAssigneeModel>()
                .HasOne(x => x.Task)
                .WithMany(t => t.AssignedUsers)
                .HasForeignKey(x => x.TaskId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<TaskAssigneeModel>()
                .HasOne(x => x.User)
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}

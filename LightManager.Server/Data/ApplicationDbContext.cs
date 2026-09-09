using LightManager.Server.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace LightManager.Server.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<TaskModel> Tasks => Set<TaskModel>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<TaskModel>(entity =>
        {
            entity.Property(task => task.Title)
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(task => task.Description)
                .HasMaxLength(4000);

            entity.Property(task => task.Status)
                .HasConversion<string>()
                .HasMaxLength(20);

            entity.Property(task => task.Priority)
                .HasConversion<string>()
                .HasMaxLength(20);

            entity.HasOne(task => task.User)
                .WithMany(user => user.Tasks)
                .HasForeignKey(task => task.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // These indexes support the main screens: Today, Inbox and Calendar.
            entity.HasIndex(task => new { task.UserId, task.DueDate });
            entity.HasIndex(task => new { task.UserId, task.Status });
        });
    }
}

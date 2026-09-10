using LightManager.Server.Data;
using LightManager.Server.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LightManager.Server.Controllers;

[AllowAnonymous]
[ApiController]
[Route("api/trial")]
public class TrialController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;

    public TrialController(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        IConfiguration configuration)
    {
        _context = context;
        _userManager = userManager;
        _configuration = configuration;
    }

    [HttpGet("tasks")]
    public async Task<ActionResult<List<TaskDetailDTO>>> GetTrialTasks()
    {
        var trialEmail =
            _configuration["TRIAL_USER_EMAIL"]
            ?? Environment.GetEnvironmentVariable("TRIAL_USER_EMAIL")
            ?? "1@test.se";

        var trialUser =
            await _userManager.FindByEmailAsync(trialEmail);

        if (trialUser is null)
        {
            return NotFound(new
            {
                message = "Trial account is not configured."
            });
        }

        var tasks = await _context.Tasks
            .AsNoTracking()
            .Where(task => task.UserId == trialUser.Id)
            .OrderBy(task => task.DueDate == null)
            .ThenBy(task => task.DueDate)
            .ThenByDescending(task => task.CreatedAt)
            .Select(task => new TaskDetailDTO
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status,
                Priority = task.Priority,
                DueDate = task.DueDate,
                CreatedAt = task.CreatedAt,
                UpdatedAt = task.UpdatedAt,
                CompletedAt = task.CompletedAt
            })
            .ToListAsync();

        return Ok(tasks);
    }
}
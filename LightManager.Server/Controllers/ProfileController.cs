/*
 * File: Controllers/ProfileController.cs
 * Purpose: Provides authenticated profile read, display-name update, and password-change endpoints.
 * Actions: GetProfile, UpdateDisplayName, ChangePassword.
 */

using LightManager.Server.Data;
using LightManager.Server.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace LightManager.Server.Controllers;

[Authorize]
[ApiController]
[Route("api/profile")]
public class ProfileController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;

    public ProfileController(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetProfile()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null) return Unauthorized();

        return Ok(new
        {
            user.Id,
            userName = user.DisplayName,
            fullName = user.DisplayName,
            user.Email,
            user.CreatedAt
        });
    }

    [HttpPut("username")]
    public async Task<IActionResult> UpdateDisplayName(UpdateProfileDTO dto)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null) return Unauthorized();

        var displayName = dto.FullName.Trim();
        if (displayName.Length == 0)
            return BadRequest(new { message = "Name is required." });

        user.DisplayName = displayName;
        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok(new { fullName = user.DisplayName });
    }

    [HttpPut("password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordDTO dto)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null) return Unauthorized();

        var result = await _userManager.ChangePasswordAsync(
            user,
            dto.CurrentPassword,
            dto.NewPassword);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return NoContent();
    }
}

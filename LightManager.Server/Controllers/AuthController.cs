/*
 * File: Controllers/AuthController.cs
 * Purpose: Handles account registration, login, health checks, and JWT creation.
 * Actions: Health, Register, Login.
 */

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LightManager.Server.Data;
using LightManager.Server.DTOs;
using LightManager.Server.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace LightManager.Server.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _configuration = configuration;
    }

    [HttpGet("health")]
    public IActionResult Health()
        => Ok(new { status = "ok" });

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDTO dto)
    {
        var email = dto.Email.Trim();
        var displayName = dto.FullName.Trim();

        if (email.Length == 0 || displayName.Length == 0)
            return BadRequest(new { message = "Name and email are required." });

        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            DisplayName = displayName,
            CreatedAt = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(user, dto.Password);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return StatusCode(StatusCodes.Status201Created, new
        {
            message = "User created successfully"
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDTO dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email.Trim());

        if (user is null || !await _userManager.CheckPasswordAsync(user, dto.Password))
            return Unauthorized(new { message = "Invalid email or password." });

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
            new Claim(ClaimTypes.Name, user.DisplayName)
        };

        var jwtKey = _configuration.GetRequiredSetting("JWT_KEY");
        var issuer = _configuration.GetRequiredSetting("JWT_ISSUER");
        var audience = _configuration.GetRequiredSetting("JWT_AUDIENCE");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: credentials);

        return Ok(new
        {
            token = new JwtSecurityTokenHandler().WriteToken(token),
            fullName = user.DisplayName,
            email = user.Email,
            userId = user.Id
        });
    }
}

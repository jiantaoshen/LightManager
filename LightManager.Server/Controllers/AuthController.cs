using LightManager.Server.Data;
using LightManager.Server.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;

    public AuthController(
        UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDTO dto)
    {
        var user = new ApplicationUser
        {
            UserName = dto.FullName,
            Email = dto.Email,
        };

        var result = await _userManager.CreateAsync(user, dto.Password);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return Ok("Registration successful.");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDTO dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);

        if (user == null)
            return Unauthorized("Invalid email or password.");

        var validPassword = await _userManager.CheckPasswordAsync(
            user,
            dto.Password);

        if (!validPassword)
            return Unauthorized("Invalid email or password.");

        return Ok(new
        {
            fullName = user.UserName,
            email = user.Email
        });
    }
}
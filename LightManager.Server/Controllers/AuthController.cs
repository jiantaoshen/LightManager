using LightManager.Server.Data;
using LightManager.Server.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;

    public AuthController(UserManager<ApplicationUser> userManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _configuration = configuration;
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

        var validPassword = await _userManager.CheckPasswordAsync(user, dto.Password);

        if (!validPassword)
            return Unauthorized("Invalid email or password.");

        var claims = new[]
        {
        new Claim(ClaimTypes.NameIdentifier, user.Id),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Name, user.UserName)
    };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: creds
        );

        return Ok(new
        {
            token = new JwtSecurityTokenHandler().WriteToken(token),
            fullName = user.UserName,
            email = user.Email
        });
    }
}
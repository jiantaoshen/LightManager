using LightManager.Server.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace LightManager.Server.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public UsersController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet("by-email")]
        public async Task<IActionResult> GetUserByEmail([FromQuery] string email)
        {
            Console.WriteLine("BY EMAIL HIT"); // 👈 add this

            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
                return NotFound("User not found");

            return Ok(new
            {
                id = user.Id,
                userName = user.UserName,
                email = user.Email
            });
        }

    }
}

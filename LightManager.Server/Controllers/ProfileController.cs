using LightManager.Server.Data;
using LightManager.Server.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace LightManager.Server.Controllers
{
    [ApiController]
    [Route("api/profile")]
    public class ProfileController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public ProfileController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        // GET current user
        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            var user = await _userManager.GetUserAsync(User);

            return Ok(new
            {
                user.Id,
                user.UserName,
                user.Email
            });
        }

        // UPDATE username
        [HttpPut("username")]
        public async Task<IActionResult> UpdateUsername(UpdateProfileDTO dto)
        {
            var user = await _userManager.GetUserAsync(User);

            user.UserName = dto.FullName;

            await _userManager.UpdateAsync(user);

            return Ok();
        }

        // CHANGE PASSWORD
        [HttpPut("password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDTO dto)
        {
            var user = await _userManager.GetUserAsync(User);

            var result = await _userManager.ChangePasswordAsync(
                user,
                dto.CurrentPassword,
                dto.NewPassword
            );

            if (!result.Succeeded)return BadRequest(result.Errors);

            return Ok();
        }
    }
}

/*
 * File: DTOs/LoginDTO.cs
 * Purpose: Defines the email and password request used by the login endpoint.
 * Type: LoginDTO.
 */

namespace LightManager.Server.DTOs;

public class LoginDTO
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

/*
 * File: DTOs/RegisterDTO.cs
 * Purpose: Defines the account registration request body.
 * Type: RegisterDTO.
 */

namespace LightManager.Server.DTOs;

public class RegisterDTO
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

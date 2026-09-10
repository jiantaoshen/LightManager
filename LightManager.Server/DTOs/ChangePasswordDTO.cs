/*
 * File: DTOs/ChangePasswordDTO.cs
 * Purpose: Defines the request body for an authenticated password change.
 * Type: ChangePasswordDTO.
 */

namespace LightManager.Server.DTOs;

public class ChangePasswordDTO
{
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}

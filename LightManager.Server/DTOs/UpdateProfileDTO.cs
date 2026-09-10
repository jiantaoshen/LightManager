/*
 * File: DTOs/UpdateProfileDTO.cs
 * Purpose: Defines the request body for updating a user's display name.
 * Type: UpdateProfileDTO.
 */

namespace LightManager.Server.DTOs;

public class UpdateProfileDTO
{
    public string FullName { get; set; } = string.Empty;
}

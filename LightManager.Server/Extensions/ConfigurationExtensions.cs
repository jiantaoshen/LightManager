/*
 * File: Extensions/ConfigurationExtensions.cs
 * Purpose: Centralizes required and fallback configuration access for controllers and application startup.
 * Functions: GetRequiredSetting, GetSettingOrDefault.
 */

namespace LightManager.Server.Extensions;

public static class ConfigurationExtensions
{
    public static string GetRequiredSetting(this IConfiguration configuration, string key)
        => configuration[key]
           ?? throw new InvalidOperationException($"Missing required configuration: {key}");

    public static string GetSettingOrDefault(
        this IConfiguration configuration,
        string key,
        string fallback)
        => configuration[key] ?? fallback;
}

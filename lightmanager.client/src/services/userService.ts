/**
 * File: services/userService.ts
 * Purpose: Wraps authenticated profile API calls.
 * Functions: getProfile, updateUsername, changePassword.
 */

import { apiRequest } from "../lib/api";

export type ProfileResponse = {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  createdAt: string;
};

export function getProfile(): Promise<ProfileResponse> {
  return apiRequest<ProfileResponse>("/api/profile", { auth: true });
}

export function updateUsername(data: { fullName: string }): Promise<{ fullName: string }> {
  return apiRequest<{ fullName: string }>("/api/profile/username", {
    method: "PUT",
    auth: true,
    json: true,
    body: JSON.stringify(data),
  });
}

export function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  return apiRequest<void>("/api/profile/password", {
    method: "PUT",
    auth: true,
    json: true,
    body: JSON.stringify(data),
  });
}

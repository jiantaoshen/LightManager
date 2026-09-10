/**
 * File: services/authService.ts
 * Purpose: Wraps public authentication API calls for registration and login.
 * Functions: registerUser, loginUser.
 */

import { apiRequest } from "../lib/api";

export type RegisterRequest = {
  fullName: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  fullName: string;
  email: string;
  userId: string;
};

export function registerUser(data: RegisterRequest) {
  return apiRequest<{ message: string }>("/api/auth/register", {
    method: "POST",
    json: true,
    body: JSON.stringify(data),
  });
}

export function loginUser(data: LoginRequest) {
  return apiRequest<LoginResponse>("/api/auth/login", {
    method: "POST",
    json: true,
    body: JSON.stringify(data),
  });
}

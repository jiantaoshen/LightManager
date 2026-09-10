/**
 * File: lib/api.ts
 * Purpose: Centralizes API URL creation, authentication headers, JSON handling, and API error parsing.
 * Functions: buildApiUrl, apiRequest.
 */

import { STORAGE_KEYS } from "./storage";

const API_BASE_URL = String(import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

type ApiRequestOptions = RequestInit & {
  auth?: boolean;
  json?: boolean;
};

function buildApiUrl(path: string): string {
  if (!API_BASE_URL) {
    throw new Error("VITE_API_URL is not configured.");
  }

  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function getApiErrorMessage(text: string, status: number): string {
  if (!text) {
    return `Request failed (${status})`;
  }

  try {
    const payload = JSON.parse(text) as
      | { message?: string; description?: string }
      | Array<{ description?: string }>;

    if (Array.isArray(payload)) {
      const descriptions = payload
        .map((item) => item.description)
        .filter(Boolean)
        .join(", ");

      return descriptions || `Request failed (${status})`;
    }

    return payload.message || payload.description || text;
  } catch {
    return text;
  }
}

export async function apiRequest<T>(
  path: string,
  { auth = false, json = false, headers, ...requestInit }: ApiRequestOptions = {},
): Promise<T> {
  const requestHeaders = new Headers(headers);

  if (json && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = localStorage.getItem(STORAGE_KEYS.authToken);

    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(buildApiUrl(path), {
    ...requestInit,
    headers: requestHeaders,
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(getApiErrorMessage(text, response.status));
  }

  if (!text || response.status === 204) {
    return undefined as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

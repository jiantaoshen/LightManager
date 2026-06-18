const API_URL = "/api/auth";

export async function registerUser(data: {
    fullName: string;
    email: string;
    password: string;
}) {
    const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const text = await response.text();

    if (!response.ok) {
        throw new Error(text || "Register failed");
    }

    // only parse JSON if it is valid
    try {
        return JSON.parse(text);
    } catch {
        return null; // backend returns empty response
    }
}

export async function loginUser(data: {email: string;password: string;}) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }

    return await response.json();
}
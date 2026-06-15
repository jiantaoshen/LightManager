const API_URL = "/api";

export async function findUserByEmail(email: string) {
    const token = localStorage.getItem("token");

    const res = await fetch(
        `${API_URL}/users/by-email?email=${encodeURIComponent(email)}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!res.ok) {
        throw new Error(await res.text());
    }

    return await res.json();
}
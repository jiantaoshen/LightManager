const API_URL = `${import.meta.env.VITE_API_URL}/api`;

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

export const getProfile = async () => {
    const res = await fetch(`${API_URL}/profile`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
    return res.json();
};

export const updateUsername = async (data: { fullName: string }) => {
    return await fetch(`${API_URL}/profile/username`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(data)
    });
};

export const changePassword = async (data: {currentPassword: string;newPassword: string;}) => {
    const res = await fetch(`${API_URL}/profile/password`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(
            Array.isArray(error)
                ? error.map(e => e.description).join(", ")
                : "Password change failed"
        );
    }

    return true;
};
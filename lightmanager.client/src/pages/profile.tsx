import { useEffect, useState } from "react";
import { getProfile, updateUsername, changePassword } from "../services/userService";
import { useAuth } from "../context/useAuth";

type Profile = {
    id: string;
    userName: string;
    email: string;
};

export default function Profile() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const { user, setUser } = useAuth();

    const [userName, setUserName] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [loading, setLoading] = useState(false);

    // ================= LOAD PROFILE =================
    useEffect(() => {
        const load = async () => {
            try {
                const data = await getProfile();
                setProfile(data);
                setUserName(data.userName);
            } catch (err) {
                console.error("Failed to load profile", err);
            }
        };

        load();
    }, []);

    // ================= UPDATE USERNAME =================
    const handleUpdateUsername = async () => {
        if (!profile) return;

        setLoading(true);
        try {
            await updateUsername({ fullName: userName });

            const updatedUser = {...user,fullName: userName};

            setUser(updatedUser);

            localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (err) {
            console.error(err);
            alert("Failed to update username");
        } finally {
            setLoading(false);
        }
    };

    // ================= CHANGE PASSWORD =================
    const handleChangePassword = async () => {
    try {
        await changePassword({
            currentPassword,
            newPassword
        });

        alert("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
    } catch (err) {
        alert(err.message || "Password change failed");
    }
};

    return (
        <div className="max-w-xl mx-auto p-6 space-y-8">

            <h1 className="text-2xl font-bold">Profile</h1>

            {/* ================= USER INFO ================= */}
            <div className="space-y-4 rounded border p-4 bg-white">

                {/* EMAIL (READ ONLY) */}
                <div>
                    <label className="text-sm font-medium">Email</label>
                    <input
                        value={profile?.email || ""}
                        disabled
                        className="w-full border p-2 bg-gray-100 rounded"
                    />
                </div>

                {/* USERNAME */}
                <div>
                    <label className="text-sm font-medium">Username</label>
                    <input
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full border p-2 rounded"
                    />

                    <button
                        onClick={handleUpdateUsername}
                        disabled={loading}
                        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Save Username
                    </button>
                </div>
            </div>

            {/* ================= PASSWORD ================= */}
            <div className="space-y-4 rounded border p-4 bg-white">

                <h2 className="font-semibold">Change Password</h2>

                <input
                    type="password"
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full border p-2 rounded"
                />

                <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border p-2 rounded"
                />

                <button
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    Change Password
                </button>
            </div>
        </div>
    );
}
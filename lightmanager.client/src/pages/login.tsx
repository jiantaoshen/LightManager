import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "https://localhost:7233/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            if (!response.ok) {
                const error = await response.text();
                alert(error);
                return;
            }

            const result = await response.json();

            localStorage.setItem("token", result.token);

            login({
                fullName: result.fullName,
                email: result.email,
                userId: result.userId
            });

            navigate("/"); // redirect after login
        } catch (error) {
            console.error(error);
            alert("Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="w-full max-w-sm">
                <h1 className="mb-8 text-center text-3xl font-bold text-black">
                    Login
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-black">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-black"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-black">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-black"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded bg-black py-2 text-white hover:bg-gray-800"
                    >
                        Login
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="font-medium text-black hover:underline"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
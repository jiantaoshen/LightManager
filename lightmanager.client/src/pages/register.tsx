import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, loginUser } from "../services/authService";
import { useAuth } from "../context/useAuth";
import Button from "../components/Button";

export default function Register() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { login } = useAuth();

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            await registerUser({fullName,email,password,});

            // Automatically log in the user after successful registration
            const loginResult = await loginUser({email,password,});

            localStorage.setItem("token", loginResult.token);

            login({
                fullName: loginResult.fullName,
                email: loginResult.email,
                userId: loginResult.userId,
            });

            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            alert(error.message || "Failed to register");
        }
    };

    return (
        <div className="flex justify-center pt-10 pb-10">
            <div className="w-full max-w-md rounded bg-white px-10 py-10">
                <h1 className="text-center text-3xl font-bold text-black">
                    Create Account
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Full Name
                        </label>

                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full rounded border border-gray-300 px-3 py-2"
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded border border-gray-300 px-3 py-2"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded border border-gray-300 px-3 py-2"
                            placeholder="Create a password"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>setConfirmPassword(e.target.value)}
                            className="w-full rounded border border-gray-300 px-3 py-2"
                            placeholder="Confirm password"
                            required
                        />
                    </div>

                    <Button type="submit" variant="primary" className = "w-full">
                        Register
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-black hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
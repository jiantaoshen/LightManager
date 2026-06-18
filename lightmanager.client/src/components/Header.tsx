import { Link, useNavigate} from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Button from "./Button";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="flex items-center bg-sky-50 justify-between border-b px-6 py-4 shadow-sm">
            {/* Left Side */}
            <div className="flex items-center gap-6">
                <Link to="/" className="text-xl font-bold text-blue-600">
                    LightManager
                </Link>
            </div>

            {/* Right */}
            <div className="flex items-center gap-6">
                {user ? (
                    <div className="flex items-center gap-3">
                        <Button onClick={() => navigate("/dashboard")} variant="ghost">
                            Dashboard
                        </Button>

                        <Button onClick={() => navigate("/profile")} variant="ghost">
                            {user.fullName}
                        </Button>

                        <Button onClick={() => {
                                logout();
                                localStorage.removeItem("token");
                                navigate("/login");
                            }}
                            variant="danger"
                        >
                            Logout
                        </Button>
                    </div>
                ) : (
                    <Button onClick={() => navigate("/login")}>
                        Login
                    </Button>
                )}
            </div>
        </nav>
    );
}
import { Link, useNavigate} from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { } from "react-router-dom";


export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm">
            {/* Left Side */}
            <div className="flex items-center gap-6">
                <p className="text-xl font-bold text-blue-600">
                    LightManager
                </p>

                <Link
                    to="/"
                    className="text-gray-700 hover:text-blue-600"
                >
                    Home
                </Link>
            </div>

            {/* Right */}
            <div>
                {user ? (
                    <div className="flex items-center gap-3">
                        <span className="text-gray-800 font-medium">
                            {user.fullName}
                        </span>

                        <button
                            onClick={() => {
                                logout();
                                localStorage.removeItem("token");
                                navigate("/login");
                            }}
                            className="rounded-md bg-red-500 px-3 py-2 text-white hover:bg-red-600"
                        >

                            Logout
                        </button>
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}
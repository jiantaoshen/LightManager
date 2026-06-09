import { Link } from "react-router-dom";

export default function Navbar() {
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

            {/* Right Side */}
            <div>
                <Link
                    to="/login"
                    className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Login
                </Link>
            </div>
        </nav>
    );
}
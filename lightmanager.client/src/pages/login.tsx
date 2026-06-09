export default function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="w-full max-w-sm">
                <h1 className="mb-8 text-center text-3xl font-bold text-black">
                    Login
                </h1>

                <form className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-black"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            className="w-full rounded border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-1 focus:ring-black"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-black"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            className="w-full rounded border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-1 focus:ring-black"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded bg-black py-2 text-white transition hover:bg-gray-800"
                    >
                        Login
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <a
                        href="/register"
                        className="font-medium text-black hover:underline"
                    >
                        Register
                    </a>
                </p>
            </div>
        </div>
    );
}
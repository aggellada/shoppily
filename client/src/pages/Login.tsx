import { Link } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2 } from "lucide-react";

function Login() {
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as unknown;

    login(data);
  };

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] flex justify-center items-center p-4 sm:p-8 ">
      <div className="w-full max-w-md bg-white p-8 rounded-4xl shadow-sm border border-gray-100">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-2">Enter your details to sign in to Shoppily.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            required
            placeholder="Username"
            className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          />

          <input
            type="password"
            name="password"
            required
            placeholder="Password"
            className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          />

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full mt-2 p-3.5 bg-gray-900 text-white rounded-xl text-sm font-semibold tracking-wide hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all hover:cursor-pointer"
          >
            {isLoggingIn ? <Loader2 className="animate-spin m-auto" /> : "Log in"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-gray-900 font-semibold hover:underline decoration-2 underline-offset-2 transition-all"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

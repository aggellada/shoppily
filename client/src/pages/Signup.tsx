import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";

function Signup() {
  const [userRole, setUserRole] = useState<string>("");

  const { signup, isSigningUp } = useAuthStore();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as unknown;

    await signup(data);
    navigate("/login");
  };

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] flex justify-center items-center p-4 sm:p-8 ">
      <div className="w-full max-w-md bg-white p-8 rounded-4xl shadow-sm border border-gray-100">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create an account</h1>
          <p className="text-sm text-gray-500 mt-2">Join Shoppily to start buying and selling.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              name="firstName"
              required
              placeholder="First Name"
              className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
            <input
              type="text"
              name="lastName"
              required
              placeholder="Last Name"
              className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
          </div>

          <input
            type="text"
            name="username"
            required
            placeholder="Username"
            className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          />

          <input
            type="email"
            name="email"
            required
            placeholder="Email Address"
            className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          />

          <input
            type="password"
            name="password"
            required
            placeholder="Password"
            className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          />

          <div className="relative">
            <select
              name="role"
              onChange={(e) => setUserRole(e.currentTarget.value)}
              className="w-full p-3.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="BUYER">I want to buy items</option>
              <option value="SELLER">I want to sell items</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {userRole === "SELLER" && (
            <input
              type="text"
              name="shopName"
              required
              placeholder="Name of your Shop"
              className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all animate-in fade-in slide-in-from-top-2 duration-300"
            />
          )}

          <button
            type="submit"
            disabled={isSigningUp}
            className="w-full mt-2 p-3.5 bg-gray-900 text-white rounded-xl text-sm font-semibold tracking-wide hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
          >
            {isSigningUp ? (
              <div className="flex m-auto gap-4">
                <Loader2 className="animate spin" />
                "Setting up your account..."
              </div>
            ) : (
              "Sign up"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;

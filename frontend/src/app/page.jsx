// app/page.jsx
"use client";
import { isAuthenticated } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    } else {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-700">
          Welcome to the MapUp
        </h1>
        <p className="mb-6 text-gray-700">
          Please log in to access the dashboard.
        </p>
        <button
          onClick={handleLogin}
          className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-all"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation"; // Import usePathname
import Link from "next/link"; // Import Next.js Link
import { FiMenu } from "react-icons/fi";
import { toast } from "react-toastify";
import { logoutUser } from "@/store/auth/authSlice";
import { isAuthenticated } from "@/utils/auth";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname(); // Get the current route
  const { role } = useSelector((state) => state.auth);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    const resultAction = await dispatch(logoutUser());

    if (logoutUser.fulfilled.match(resultAction)) {
      toast.success("Logout successful!");
      router.push("/login");
    } else {
      toast.error(resultAction.payload || "Logout failed. Please try again.");
      console.error("Logout failed:", resultAction.payload);
    }
  };

  if (!hydrated) {
    return null;
  }

  const linkClass = (path) =>
    `block p-2.5 hover:bg-indigo-700 rounded-lg ${
      pathname === path ? "bg-indigo-700" : ""
    }`;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="bg-indigo-800 text-white p-4 md:hidden flex justify-between items-center">
        <h1 className="text-2xl font-bold">{role || "Admin"} Panel</h1>{" "}
        {/* User Role */}
        <button onClick={toggleSidebar}>
          <FiMenu className="text-3xl" />
        </button>
      </div>

      <aside
        className={`fixed z-10 md:relative bg-indigo-800 text-white w-64 h-full md:h-auto transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">{role || "Admin"} Panel</h2>{" "}
          {/* User Role */}
          <nav className="space-y-2">
            <Link href="/dashboard" className={linkClass("/dashboard")}>
              Dashboard
            </Link>
            <Link href="/profile" className={linkClass("/profile")}>
              Profile
            </Link>
            <Link href="/trips" className={linkClass("/trips")}>
              Trips
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left block p-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
            >
              Logout
            </button>
          </nav>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <div className="flex-1 p-8 bg-gray-100">{children}</div>
    </div>
  );
}

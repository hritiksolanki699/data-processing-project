"use client";
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/store/auth/authSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify'; 

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    role: 'Admin',
    loginIdentifier: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(loginUser(formData));
  
    if (loginUser.fulfilled.match(resultAction)) {
      toast.success('Login successful!');
      router.push('/dashboard');
    } else {
      toast.error(resultAction.payload || 'Login failed. Please try again.');
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">MapUp Login</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Role Selector */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Select Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full text-gray-600 bg-gray-50 border border-gray-300 rounded-md shadow-sm p-2.5 focus:outline-none focus:ring focus:ring-indigo-500"
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="User">User</option>
            </select>
          </div>

          {/* Username/Email/Mobile */}
          <div>
            <label htmlFor="loginIdentifier" className="block text-sm font-medium text-gray-700">
              Email, Mobile, or Username
            </label>
            <input
              type="text"
              id="loginIdentifier"
              name="loginIdentifier"
              value={formData.loginIdentifier}
              onChange={handleChange}
              className="mt-1 block w-full text-gray-600 bg-gray-50 border border-gray-300 rounded-md shadow-sm p-2.5 focus:outline-none focus:ring focus:ring-indigo-500"
              placeholder="Enter email, mobile, or username"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full text-gray-600 bg-gray-50 border border-gray-300 rounded-md shadow-sm p-2.5 focus:outline-none focus:ring focus:ring-indigo-500"
              placeholder="Enter your password"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg shadow hover:bg-indigo-700 transition-all"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>

          {/* Error Message */}
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </form>
      </div>
    </div>
  );
}

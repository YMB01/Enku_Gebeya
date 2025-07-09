'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Accept onClose prop to close the modal
interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:7251/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Login failed: ${errorText}`);
      }

      const data = await res.json();
      console.log('Login response:', data); // Debug log

      const isAdmin = data?.IsAdmin === true || data?.isAdmin === true;
      if (!isAdmin) {
        setError('Only admins can log in.');
        return;
      }

      // Handle both 'Id' and 'id' for user ID
      const userId = data?.Id ?? data?.id;
      if (!userId) {
        throw new Error('User ID not found in response');
      }

      localStorage.setItem('userId', userId.toString());
      const adminData = {
        id: userId,
        username: data?.Username ?? data?.username,
        isAdmin: isAdmin,
      };
      console.log('Admin data retrieved:', adminData); // Debug log

      // Close the modal upon successful login
      onClose();

      // Attempt client-side navigation
      try {
        await router.push('/user-management');
        console.log('Navigation to /user-management successful'); // Debug log
      } catch (navError) {
        console.error('Navigation error:', navError);
        window.location.href = '/user-management'; // Fallback
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // The modal content itself, without the full-screen wrapper
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md relative">
      {/* Close button for the modal */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
        aria-label="Close modal"
      >
        &times;
      </button>

      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your username"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="********"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
      {/* You might want a registration link here as well, if applicable */}
    </div>
  );
}
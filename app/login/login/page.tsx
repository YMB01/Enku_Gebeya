'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

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

      const userId = data?.Id ?? data?.id;
      const role = data?.Role ?? data?.role;
      const isAdmin = data?.IsAdmin === true || data?.isAdmin === true;

      console.log('Parsed login data:', { userId, role, isAdmin }); // Debug log

      if (!userId || !role) {
        throw new Error('User ID or role not found in response');
      }

      localStorage.setItem('userId', userId.toString());
      localStorage.setItem('username', data?.Username ?? data?.username);
      localStorage.setItem('role', role);
      localStorage.setItem('isAdmin', isAdmin.toString());

      // Notify other components of login status change
      window.dispatchEvent(new Event('loginStatusChanged'));

      onClose();

      try {
        await router.push('/');
        console.log('Navigation to landing page (/) successful');
      } catch (navError) {
        console.error('Navigation error:', navError);
        window.location.href = '/';
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative border border-gray-100">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-[#FFA500] text-3xl transition-colors"
        aria-label="Close modal"
      >
        &times;
      </button>

      <div className="flex flex-col items-center mb-6">
        <div className="bg-[#FFF3E0] rounded-full p-3 mb-2">
          <svg className="w-8 h-8 text-[#FFA500]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 12A4 4 0 1 1 8 12a4 4 0 0 1 8 0Zm2 6a6 6 0 1 0-12 0h12Z" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Login</h2>
        <p className="text-gray-500 text-sm">Sign in to your dashboard</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFA500] focus:border-[#FFA500] transition"
            placeholder="Enter your username"
            required
            autoComplete="username"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFA500] focus:border-[#FFA500] transition"
            placeholder="********"
            required
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg text-white font-semibold text-lg shadow-md transition-all duration-150 ${
            loading
              ? 'bg-[#FFD699] cursor-not-allowed'
              : 'bg-gradient-to-r from-[#FFA500] to-[#FFB733] hover:from-[#FF9900] hover:to-[#FFC266]'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFA500]`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              Logging in...
            </span>
          ) : (
            'Login'
          )}
        </button>
      </form>
      {error && (
        <div className="mt-5 text-[#D14300] text-center bg-[#FFF3E0] border border-[#FFD699] rounded-lg py-2 px-4">
          {error}
        </div>
      )}
      <div className="mt-6 text-center">
        <span className="text-gray-500 text-sm">Not registered? </span>
        <a href="/" className="text-[#FFA500] hover:underline text-sm font-medium">
          Go back to home
        </a>
      </div>
    </div>
  );
}
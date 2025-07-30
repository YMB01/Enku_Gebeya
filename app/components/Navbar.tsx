'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LoginModal from '../login/login/page';


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const updateLoginStatus = () => {
    const userId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role');
    const storedIsAdmin = localStorage.getItem('isAdmin');

    console.log('Navbar updateLoginStatus:', { userId, storedUsername, storedRole, storedIsAdmin }); // Debug log

    if (userId && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setRole(storedRole);
      setIsAdmin(storedIsAdmin === 'true');
    } else {
      setIsLoggedIn(false);
      setUsername(null);
      setRole(null);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    // Initial check on mount
    updateLoginStatus();

    // Listen for login status changes
    const handleLoginStatusChange = () => {
      updateLoginStatus();
    };

    window.addEventListener('loginStatusChanged', handleLoginStatusChange);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('loginStatusChanged', handleLoginStatusChange);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openLoginModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoginModalOpen(true);
    setIsMenuOpen(false);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('isAdmin');
    setIsLoggedIn(false);
    setUsername(null);
    setRole(null);
    setIsAdmin(false);
    window.dispatchEvent(new Event('loginStatusChanged')); // Notify other components
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-lg z-50 transition-all ease-in-out duration-300">
      {/* Navbar Container */}
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center text-3xl font-extrabold text-green-600">
          <img
            src="/images/enku.png"
            alt="Logo"
            className="w-12 h-12 mr-3"
          />
          <span className="text-2xl text-gray-800">Enku Gebeya</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link href="/" className="text-gray-700 hover:text-orange-600 font-semibold transition duration-300 ease-in-out">
            Home
          </Link>
          <Link href="/products" className="text-gray-700 hover:text-orange-600 font-semibold transition duration-300 ease-in-out">
            Products
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-orange-600 font-semibold transition duration-300 ease-in-out">
            About
          </Link>
          {(role?.toLowerCase() === 'finance' || isAdmin) && (
            <Link href="/finance" className="text-gray-700 hover:text-orange-600 font-semibold transition duration-300 ease-in-out">
              Finance
            </Link>
          )}
          {(role?.toLowerCase() === 'inventory' || isAdmin) && (
            <Link href="/inventory" className="text-gray-700 hover:text-orange-600 font-semibold transition duration-300 ease-in-out">
              Inventory
            </Link>
          )}
          {isAdmin && (
            <Link href="/user-management" className="text-gray-700 hover:text-orange-600 font-semibold transition duration-300 ease-in-out">
              User Management
            </Link>
          )}
          {isLoggedIn ? (
            <div className="relative group">
              <button
                onClick={handleLogout}
                className="bg-[#FFA500] text-white px-6 py-2 rounded-lg hover:bg-orange-600 font-semibold transition duration-300 ease-in-out"
              >
                Logout
              </button>
              {username && (
                <span className="absolute hidden group-hover:block bg-gray-800 text-white text-sm rounded py-1 px-2 bottom-10 left-1/2 transform -translate-x-1/2">
                  {username}
                </span>
              )}
            </div>
          ) : (
            <button
              onClick={openLoginModal}
              className="bg-[#FFA500] text-white px-6 py-2 rounded-lg hover:bg-orange-600 font-semibold transition duration-300 ease-in-out"
            >
              Login
            </button>
          )}
        </div>
        {/* End Desktop Menu */}

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            className="w-7 h-7 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>
      {/* End Navbar Container */}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 transition-all ease-in-out duration-300">
          <div className="container mx-auto px-6 py-6 flex flex-col space-y-4">
            <Link
              href="/"
              className="text-gray-700 hover:text-green-600 font-semibold transition duration-300 ease-in-out"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-gray-700 hover:text-green-600 font-semibold transition duration-300 ease-in-out"
              onClick={toggleMenu}
            >
              Products
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-green-600 font-semibold transition duration-300 ease-in-out"
              onClick={toggleMenu}
            >
              About
            </Link>
            {(role?.toLowerCase() === 'finance' || isAdmin) && (
              <Link
                href="/finance"
                className="text-gray-700 hover:text-green-600 font-semibold transition duration-300 ease-in-out"
                onClick={toggleMenu}
              >
                Finance
              </Link>
            )}
            {(role?.toLowerCase() === 'inventory' || isAdmin) && (
              <Link
                href="/inventory"
                className="text-gray-700 hover:text-green-600 font-semibold transition duration-300 ease-in-out"
                onClick={toggleMenu}
              >
                Inventory
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/user-management"
                className="text-gray-700 hover:text-green-600 font-semibold transition duration-300 ease-in-out"
                onClick={toggleMenu}
              >
                User Management
              </Link>
            )}
            {isLoggedIn ? (
              <div className="relative group">
                <button
                  onClick={handleLogout}
                  className="bg-[#FFA500] text-white px-6 py-3 rounded-lg text-center hover:bg-orange-600 font-semibold transition duration-300 ease-in-out"
                >
                  Logout
                </button>
                {username && (
                  <span className="absolute hidden group-hover:block bg-gray-800 text-white text-sm rounded py-1 px-2 bottom-12 left-1/2 transform -translate-x-1/2">
                    {username}
                  </span>
                )}
              </div>
            ) : (
              <button
                onClick={openLoginModal}
                className="bg-[#FFA500] text-white px-6 py-3 rounded-lg text-center hover:bg-orange-600 font-semibold transition duration-300 ease-in-out"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
      {/* End Mobile Menu */}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300"
          style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.2)' }}
        >
          <LoginModal onClose={closeLoginModal} />
        </div>
      )}
      {/* End Login Modal */}
    </nav>
  );
}
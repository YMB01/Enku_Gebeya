'use client';

import { useState } from 'react';
import { Navbar } from './components/Navbar';
import Link from 'next/link';
import '../../app/globals.css'; // Import scoped globals.css
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <html lang="en">
      <body>
        {/* Wrap entire app content in .stock-management-app */}
        <div className="stock-management-app">
          <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Navbar />
            <nav
              className="fixed top-0 left-0 w-full bg-white shadow-lg z-[100] transition-all ease-in-out duration-300"
              style={{ boxSizing: 'border-box', marginBottom: '80px' }}
            >
              <div
                className="container mx-auto px-6 py-4 flex justify-between items-center"
                style={{ maxWidth: '1200px' }}
              >
                {/* Logo */}
                <Link
                  href="/"
                  className="flex items-center text-2xl font-extrabold text-green-600"
                  style={{ gap: '12px' }}
                >
                  <img
                    src="/images/enku.png"
                    alt="Logo"
                    style={{ width: '40px', height: '40px' }}
                  />
                  <span style={{ color: 'var(--black-text)', fontSize: '1.5rem' }}>
                    Enku Gebeya
                  </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center" style={{ gap: '24px' }}>
                  <Link
                    href="/"
                    className="text-gray-700 hover:text-[var(--primary-orange)] font-medium transition duration-300 ease-in-out"
                    style={{ fontSize: '1rem', padding: '8px 12px' }}
                  >
                    Home
                  </Link>
                  <Link
                    href="/products"
                    className="text-gray-700 hover:text-[var(--primary-orange)] font-medium transition duration-300 ease-in-out"
                    style={{ fontSize: '1rem', padding: '8px 12px' }}
                  >
                    Products
                  </Link>
                  <Link
                    href="/about"
                    className="text-gray-700 hover:text-[var(--primary-orange)] font-medium transition duration-300 ease-in-out"
                    style={{ fontSize: '1rem', padding: '8px 12px' }}
                  >
                    About
                  </Link>
                  <Link
                    href="/finance"
                    className="text-gray-700 hover:text-[var(--primary-orange)] font-medium transition duration-300 ease-in-out"
                    style={{ fontSize: '1rem', padding: '8px 12px' }}
                  >
                    Finance
                  </Link>
                  <Link
                    href="/inventory"
                    className="text-gray-700 hover:text-[var(--primary-orange)] font-medium transition duration-300 ease-in-out"
                    style={{ fontSize: '1rem', padding: '8px 12px' }}
                  >
                    Inventory
                  </Link>
                  <button
                    className="bg-[var(--primary-orange)] text-white rounded-lg hover:bg-orange-600 font-medium transition duration-300 ease-in-out"
                    style={{ padding: '10px 24px', fontSize: '1rem' }}
                  >
                    Login
                  </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                  className="md:hidden focus:outline-none"
                  onClick={toggleMenu}
                  aria-label="Toggle menu"
                  style={{ padding: '8px' }}
                >
                  <svg
                    className="w-6 h-6 text-gray-600"
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

              {/* Mobile Menu */}
              {isMenuOpen && (
                <div
                  className="md:hidden bg-white border-t border-gray-200 transition-all ease-in-out duration-300"
                  style={{ padding: '16px', boxShadow: 'var(--shadow)' }}
                >
                  <div className="container mx-auto flex flex-col" style={{ gap: '16px' }}>
                    <Link
                      href="/"
                      className="text-gray-700 hover:text-[var(--primary-orange)] font-medium transition duration-300 ease-in-out"
                      onClick={toggleMenu}
                      style={{ padding: '12px 16px', fontSize: '1rem' }}
                    >
                      Home
                    </Link>
                    <Link
                      href="/products"
                      className="text-gray-700 hover:text-[var(--primary-orange)] font-medium transition duration-300 ease-in-out"
                      onClick={toggleMenu}
                      style={{ padding: '12px 16px', fontSize: '1rem' }}
                    >
                      Products
                    </Link>
                    <Link
                      href="/about"
                      className="text-gray-700 hover:text-[var(--primary-orange)] font-medium transition duration-300 ease-in-out"
                      onClick={toggleMenu}
                      style={{ padding: '12px 16px', fontSize: '1rem' }}
                    >
                      About
                    </Link>
                    <Link
                      href="/finance"
                      className="text-gray-700 hover:text-[var(--primary-orange)] font-medium transition duration-300 ease-in-out"
                      onClick={toggleMenu}
                      style={{ padding: '12px 16px', fontSize: '1rem' }}
                    >
                      Finance
                    </Link>
                    <Link
                      href="/inventory"
                      className="text-gray-700 hover:text-[var(--primary-orange)] font-medium transition duration-300 ease-in-out"
                      onClick={toggleMenu}
                      style={{ padding: '12px 16px', fontSize: '1rem' }}
                    >
                      Inventory
                    </Link>
                    <button
                      className="bg-[var(--primary-orange)] text-white rounded-lg hover:bg-orange-600 font-medium transition duration-300 ease-in-out"
                      style={{ padding: '12px 16px', fontSize: '1rem' }}
                      onClick={toggleMenu}
                    >
                      Login
                    </button>
                  </div>
                </div>
              )}
            </nav>
            <div
              style={{
                flex: 1,
                padding: '20px',
                marginLeft: '250px',
              }}
            >
              <header
                style={{
                  background: 'var(--light-bg)',
                  padding: '20px',
                  borderRadius: '12px',
                  marginBottom: '50px',
                  textAlign: 'center',
                  boxShadow: 'var(--shadow)',
                }}
              >
         
              </header>
              <main className="container">{children}</main>
            </div>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 5000,
              style: {
                background: 'var(--white-bg)',
                color: 'var(--black-text)',
                border: '1px solid var(--white-accent)',
                borderRadius: '12px',
                padding: '16px 20px',
                boxShadow: 'var(--shadow)',
                fontSize: '16px',
                minWidth: '300px',
              },
              success: {
                style: {
                  borderLeft: '6px solid var(--primary-orange)',
                  background: '#fff8f1',
                },
                iconTheme: {
                  primary: 'var(--primary-orange)',
                  secondary: '#fff8f1',
                },
              },
              error: {
                style: {
                  borderLeft: '6px solid #e3342f',
                  background: '#fff8f1',
                },
                iconTheme: {
                  primary: '#e3342f',
                  secondary: '#fff8f1',
                },
              },
            }}
          />
        </div>
      </body>
    </html>
  );
}
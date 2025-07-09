'use client';

import { Navbar } from './components/Navbar';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Navbar />
          <div
            style={{
              flex: 1,
              padding: '20px',
              marginLeft: '250px', // Adjust for navbar width
            }}
          >
            <header
              style={{
                background: 'var(--light-bg)',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '20px',
                textAlign: 'center',
                boxShadow: 'var(--shadow)',
              }}
            >
              <h1>Stock Management</h1>
            </header>
            <main className="container">{children}</main>
          </div>
        </div>
  <Toaster
  position="top-right"
  toastOptions={{
    duration: 5000, // 5 seconds (default is 4 seconds)
    style: {
      background: 'var(--white-bg)',
      color: 'var(--black-text)',
      border: '1px solid var(--white-accent)',
      borderRadius: '12px',
      padding: '16px 20px', // Increased padding
      boxShadow: 'var(--shadow)',
      fontSize: '16px', // Larger text
      minWidth: '300px', // Wider toasts
    },
    success: {
      style: {
        borderLeft: '6px solid var(--primary-orange)', // Thicker border
        background: '#fff8f1', // Light orange background
      },
      iconTheme: {
        primary: 'var(--primary-orange)',
        secondary: '#fff8f1', // Matching background
      },
    },
    error: {
      style: {
        borderLeft: '6px solid #e3342f', // Thicker border
        background: '#fff8f1', // Light orange background for errors too
      },
      iconTheme: {
        primary: '#e3342f',
        secondary: '#fff8f1',
      },
    },
  }}
/>
      </body>
    </html>
  );
}
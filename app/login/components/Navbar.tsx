// components/Navbar.tsx
'use client';

import React from 'react';
import Link from 'next/link';

const Navbar: React.FC<{ activeSection: string; onSectionChange: (section: string) => void }> = ({
  activeSection,
  onSectionChange,
}) => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-6 text-indigo-400">Menu</h2>
      <ul className="space-y-4">
        <li>
          <button
            onClick={() => onSectionChange('users')}
            className={`w-full text-left p-2 rounded ${activeSection === 'users' ? 'bg-indigo-600' : 'hover:bg-gray-700'}`}
          >
            User Management
          </button>
        </li>
        <li>
          <button
            onClick={() => onSectionChange('roles')}
            className={`w-full text-left p-2 rounded ${activeSection === 'roles' ? 'bg-indigo-600' : 'hover:bg-gray-700'}`}
          >
            Role Management
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
'use client';

import React from 'react';
import { Users, Shield } from 'lucide-react';

const Navbar: React.FC<{ activeSection: string; onSectionChange: (section: string) => void }> = ({
  activeSection,
  onSectionChange,
}) => {
  return (
    <div
      className="w-64 h-screen text-white p-4"
      style={{
        background: `linear-gradient(to bottom, #f97316, #fcd9b6, #ffffff)`,
        color: '#fff',
      }}
    >
      <h2 className="text-2xl font-bold mb-6 text-orange-900">Menu</h2>
      <ul className="space-y-4">
        <li>
          <button
            onClick={() => onSectionChange('users')}
            className={`w-full flex items-center gap-2 text-left p-3 rounded-lg text-base font-medium shadow-sm transition ${
              activeSection === 'users'
                ? 'bg-white text-orange-600 font-semibold'
                : 'hover:bg-orange-300 hover:text-orange-900'
            }`}
          >
            <Users className="w-5 h-5" />
            User Management
          </button>
        </li>
        <li>
          <button
            onClick={() => onSectionChange('roles')}
            className={`w-full flex items-center gap-2 text-left p-3 rounded-lg text-base font-medium shadow-sm transition ${
              activeSection === 'roles'
                ? 'bg-white text-orange-600 font-semibold'
                : 'hover:bg-orange-300 hover:text-orange-900'
            }`}
          >
            <Shield className="w-5 h-5" />
            Role Management
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;

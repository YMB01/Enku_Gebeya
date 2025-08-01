'use client';

import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';

interface User {
  Id: number;
  Username: string | null;
  PasswordHash: string;
  RoleId: number;
  Email: string | null;
  IsAdmin: boolean;
  CreatedAt: string;
}

interface Role {
  Id: number;
  Name: string;
}

interface UserInRole {
  UserId: number;
  RoleId: number;
  RoleName: string;
}

interface UserManagementProps {
  users: User[];
  roles: Role[];
  userInRoles: UserInRole[];
  onCreateUser: (user: any) => Promise<void>;
  onDeleteUser: (id: number) => Promise<void>;
  onUpdateUser: (id: number, user: any) => Promise<void>;
  getUserRoleName: (userId: number) => string;
  getUserRoleMapping: (userId: number) => UserInRole | undefined;
  onAssignRole: (userId: number, roleId: number, roleName: string) => Promise<void>;
  onRemoveRole: (userId: number, roleId: number) => Promise<void>;
  loading: boolean;
  rolesLoading: boolean;
  error: string | null;
  success: string | null;
  setNewUser: Dispatch<SetStateAction<{ username: string; passwordHash: string; roleId: number; email: string; isAdmin: boolean }>>;
  setEditUser: Dispatch<SetStateAction<any | null>>;
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
}

export default function UserManagement({
  users,
  roles,
  userInRoles,
  onCreateUser,
  onDeleteUser,
  onUpdateUser,
  getUserRoleName,
  getUserRoleMapping,
  onAssignRole,
  onRemoveRole,
  loading,
  rolesLoading,
  error,
  success,
  setNewUser,
  setEditUser,
  searchTerm,
  setSearchTerm,
}: UserManagementProps) {
  console.log('Users received in UserManagement:', users);
  console.log('Roles received in UserManagement:', roles);

  const [newUser, setLocalNewUser] = useState({ username: '', password: '', roleId: 0, email: '', isAdmin: false });
  const [editUser, setLocalEditUser] = useState<any | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 3; // 3 users per page as shown in the image

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    (user.Username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.Email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle create user
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateUser({ ...newUser, passwordHash: newUser.password }); // Pass password as passwordHash
    setLocalNewUser({ username: '', password: '', roleId: 0, email: '', isAdmin: false });
    setIsAddUserOpen(false);
  };

  // Handle edit user
  const handleEditUser = (user: User) => {
    const mapping = getUserRoleMapping(user.Id);
    setLocalEditUser({
      id: user.Id,
      username: user.Username || '',
      password: '', // Password will be entered anew
      roleId: mapping ? mapping.RoleId : 0,
      email: user.Email || '',
      isAdmin: user.IsAdmin || false,
    });
  };

const handleSaveEditUser = async (e: React.FormEvent) => {
  e.preventDefault();
  if (editUser) {
    const updatedUser = { ...editUser };
    if (!updatedUser.password) {
      delete updatedUser.password; // Don’t update password if empty
      updatedUser.passwordHash = users.find(u => u.Id === editUser.id)?.PasswordHash || ''; // Keep existing hash
    } else {
      // Password provided, will be hashed via rehash-password endpoint
      updatedUser.passwordHash = ''; // Will be set in handleUpdateUser
    }
    await onUpdateUser(editUser.id, updatedUser);
    setLocalEditUser(null);
  }
};

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Search and Add User Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-1/3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Users"
            className="w-full p-2 pl-8 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <svg
            className="w-5 h-5 absolute left-2 top-2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1117.65 5.65 7.5 7.5 0 0116.65 16.65z"
            />
          </svg>
        </div>
        <button
          onClick={() => setIsAddUserOpen(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-gray-600 font-semibold">Full Name</th>
              <th className="p-4 text-gray-600 font-semibold">Email</th>
              <th className="p-4 text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              currentUsers.map((user) => (
                <tr key={user.Id} className="border-t">
                  <td className="p-4">{user.Username || 'N/A'}</td>
                  <td className="p-4">{user.Email || 'N/A'}</td>
                  <td className="p-4 flex space-x-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-green-500 hover:text-green-700 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteUser(user.Id)}
                      className="text-red-500 hover:text-red-700 font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Add User Popup */}
      {isAddUserOpen && (
        <div className="fixed inset-0 bg-opacity-100 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-100">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Add New User</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <input
                type="text"
                value={newUser.username}
                onChange={(e) => setLocalNewUser({ ...newUser, username: e.target.value })}
                placeholder="Full Name"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setLocalNewUser({ ...newUser, email: e.target.value })}
                // placeholder="Email"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setLocalNewUser({ ...newUser, password: e.target.value })}
                // placeholder="Password"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newUser.isAdmin}
                  onChange={(e) => setLocalNewUser({ ...newUser, isAdmin: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-gray-700">Is Admin</span>
              </label>
              <select
                value={newUser.roleId}
                onChange={(e) => setLocalNewUser({ ...newUser, roleId: parseInt(e.target.value) })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={rolesLoading}
              >
                <option value={0}>
                  {rolesLoading ? 'Loading roles...' : 'Select Role'}
                </option>
                {roles.map((role) => (
                  <option key={role.Id} value={role.Id}>
                    {role.Name || 'Unnamed Role'}
                  </option>
                ))}
              </select>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg text-white ${loading ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'}`}
                >
                  {loading ? 'Adding...' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Popup */}
      {editUser && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-100">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Edit User</h2>
            <form onSubmit={handleSaveEditUser} className="space-y-4">
              <input
                type="text"
                value={editUser.username}
                onChange={(e) => setLocalEditUser({ ...editUser, username: e.target.value })}
                placeholder="Full Name"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="email"
                value={editUser.email}
                onChange={(e) => setLocalEditUser({ ...editUser, email: e.target.value })}
                placeholder="Email"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="password"
                value={editUser.password}
                onChange={(e) => setLocalEditUser({ ...editUser, password: e.target.value })}
                placeholder="New Password"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editUser.isAdmin}
                  onChange={(e) => setLocalEditUser({ ...editUser, isAdmin: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-gray-700">Is Admin</span>
              </label>
              <select
                value={editUser.roleId}
                onChange={(e) => setLocalEditUser({ ...editUser, roleId: parseInt(e.target.value) })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={rolesLoading}
              >
                <option value={0}>
                  {rolesLoading ? 'Loading roles...' : 'Select Role'}
                </option>
                {roles.map((role) => (
                  <option key={role.Id} value={role.Id}>
                    {role.Name || 'Unnamed Role'}
                  </option>
                ))}
              </select>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setLocalEditUser(null)}
                  className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg text-white ${loading ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'}`}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import React, { useState, Dispatch, SetStateAction } from 'react';

interface Role {
  Id: number;
  Name: string;
}

interface RoleManagementProps {
  roles: Role[];
  onCreateRole: (role: any) => Promise<void>;
  onDeleteRole: (id: number) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: string | null;
  setNewRole: Dispatch<SetStateAction<{ name: string }>>;
}

export default function RoleManagement({
  roles,
  onCreateRole,
  onDeleteRole,
  loading,
  error,
  success,
  setNewRole,
}: RoleManagementProps) {
  console.log('Roles received in RoleManagement:', roles);

  const [newRole, setLocalNewRole] = useState({ name: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const rolesPerPage = 5;

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateRole(newRole);
    setLocalNewRole({ name: '' });
    setIsModalOpen(false);
  };

  // Calculate the indices for the current page
  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const currentRoles = roles.slice(indexOfFirstRole, indexOfLastRole);

  // Calculate total pages
  const totalPages = Math.ceil(roles.length / rolesPerPage);

  // Handle page changes
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-6">
      {(error || success) && (
        <div className={`mb-4 p-4 rounded ${error ? 'bg-red-500' : 'bg-green-500'} text-white text-lg font-semibold`}>
          {error || success}
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded"
        >
          Add New Role
        </button>
      </div>

      {/* Modal for Adding New Role */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold text-orange-500 mb-4">Add New Role</h2>
            <form onSubmit={handleCreateRole} className="space-y-4">
              <input
                type="text"
                value={newRole.name}
                onChange={(e) => setLocalNewRole({ ...newRole, name: e.target.value })}
                placeholder="Role Name"
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`py-2 px-4 ${loading ? 'bg-gray-600' : 'bg-orange-500 hover:bg-orange-600'} text-white font-semibold rounded`}
                >
                  {loading ? 'Adding...' : 'Add Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-3 border-b border-gray-700 text-white">Role Name</th>
              <th className="p-3 border-b border-gray-700 text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRoles.length === 0 ? (
              <tr>
                <td colSpan={2} className="p-3 text-center text-black-400">
                  No roles available
                </td>
              </tr>
            ) : (
              currentRoles.map((role) => (
                <tr key={role.Id} className="border-b border-gray-700">
                  <td className="p-3 text-black-300">{role.Name || 'Unnamed Role'}</td>
                  <td className="p-3">
                    <button
                      onClick={() => onDeleteRole(role.Id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4 text-white">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
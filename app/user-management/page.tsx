'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../login/components/Navbar';
import UserManagement from '../login/components/UserManagement';
import RoleManagement from '../login/components/RoleManagement';
import { User, Role, UserInRole } from '../login/types/index';

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [userInRoles, setUserInRoles] = useState<UserInRole[]>([]);
  const [newUser, setNewUser] = useState({ username: '', passwordHash: '', roleId: 0, email: '', isAdmin: false });
  const [newRole, setNewRole] = useState({ name: '' });
  const [editUser, setEditUser] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');
      console.log('Stored userId:', storedUserId);
      setUserId(storedUserId);
      setIsCheckingAuth(false);
    }
  }, []);

  useEffect(() => {
    if (isCheckingAuth) return;

    if (!userId) {
      console.log('No userId, redirecting to login');
      router.push('/login');
      return;
    }

    fetchUsers();
    fetchRoles();
    fetchUserInRoles();
  }, [userId, isCheckingAuth, router]);

  useEffect(() => {
    console.log('Updated users state:', users);
    console.log('Updated roles state:', roles);
  }, [users, roles]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:7251/api/users/get-all-users');
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch users: ${res.status} - ${errorText}`);
      }
      const data = await res.json();
      console.log('Fetched users response:', data);
      if (Array.isArray(data)) {
        const mappedUsers = data.map((user: any) => ({
          Id: user.id ?? user.Id ?? 0,
          Username: user.username ?? user.Username ?? null,
          PasswordHash: user.passwordHash ?? user.PasswordHash ?? '',
          RoleId: user.roleId ?? user.RoleId ?? 0,
          Email: user.email ?? user.Email ?? null,
          IsAdmin: user.isAdmin ?? user.IsAdmin ?? false,
          CreatedAt: user.createdAt ?? user.CreatedAt ?? '',
        }));
        setUsers(mappedUsers);
        if (mappedUsers.length === 0) {
          setError('No users found. Try adding a new user.');
        }
      } else {
        throw new Error('API returned invalid data format: expected an array');
      }
    } catch (err: any) {
      console.error('Fetch users error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    setRolesLoading(true);
    try {
      const res = await fetch('http://localhost:7251/api/users/get-all-roles');
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch roles: ${res.status} - ${errorText}`);
      }
      const data = await res.json();
      console.log('Fetched roles response:', data);
      if (Array.isArray(data)) {
        const mappedRoles = data.map((role: any) => ({
          Id: role.id ?? role.Id ?? 0,
          Name: role.name ?? role.Name ?? '',
        }));
        setRoles(mappedRoles);
        if (mappedRoles.length === 0) {
          setError('No roles found. Try adding a new role in the Roles section.');
        }
      } else {
        throw new Error('API returned invalid data format: expected an array');
      }
    } catch (err: any) {
      console.error('Fetch roles error:', err);
      setError(err.message);
    } finally {
      setRolesLoading(false);
    }
  };

  const fetchUserInRoles = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:7251/api/users/get-all-user-in-roles');
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch user-role mappings: ${res.status} - ${errorText}`);
      }
      const data = await res.json();
      console.log('Fetched userInRoles response:', data);
      if (Array.isArray(data)) {
        const mappedUserInRoles = data.map((mapping: any) => ({
          UserId: mapping.userId ?? mapping.UserId ?? 0,
          RoleId: mapping.roleId ?? mapping.RoleId ?? 0,
          RoleName: mapping.roleName ?? mapping.RoleName ?? '',
        }));
        setUserInRoles(mappedUserInRoles);
      } else {
        throw new Error('API returned invalid data format: expected an array');
      }
    } catch (err: any) {
      console.error('Fetch userInRoles error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (user: any) => {
    try {
      const res = await fetch('http://localhost:7251/api/users/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      if (!res.ok) throw new Error('Failed to create user');
      await fetchUsers();
      setSuccess('User created successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const res = await fetch(`http://localhost:7251/api/users/delete-user/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete user');
        await fetchUsers();
        await fetchUserInRoles();
        setSuccess('User deleted successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

const handleUpdateUser = async (id: number, user: any) => {
  try {
    let passwordHash = user.passwordHash || '';
    if (user.password && user.password.trim() !== '') {
      // Hash the new password if provided
      const res = await fetch('http://localhost:7251/api/users/rehash-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username, password: user.password }),
      });
      const hashResponse = await res.json();
      console.log('Rehash response:', hashResponse);
      if (!res.ok) {
        throw new Error(hashResponse.message || 'Failed to hash password');
      }
      passwordHash = hashResponse.message; // Extract the hashed password from the response
    }

    const payload = {
      id,
      username: user.username,
      passwordHash, // Use hashed value or existing hash
      roleId: user.roleId,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    const res = await fetch(`http://localhost:7251/api/users/update-user/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const responseData = await res.json();
    console.log('Update response:', responseData);

    if (!res.ok) {
      throw new Error(responseData.message || 'Failed to update user');
    }

    await fetchUsers();
    await fetchUserInRoles();
    setSuccess('User updated successfully!');
    setTimeout(() => setSuccess(null), 3000);
  } catch (err: any) {
    console.error('Error updating user:', err);
    setError(err.message);
  }
};

  const handleCreateRole = async (role: any) => {
    try {
      const res = await fetch('http://localhost:7251/api/users/create-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(role),
      });
      if (!res.ok) throw new Error('Failed to create role');
      await fetchRoles();
      setSuccess('Role created successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteRole = async (id: number) => {
    if (confirm('Are you sure you want to delete this role?')) {
      try {
        const res = await fetch(`http://localhost:7251/api/users/delete-role/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete role');
        await fetchRoles();
        await fetchUserInRoles();
        setSuccess('Role deleted successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleAssignRole = async (targetUserId: number, roleId: number, roleName: string) => {
    try {
      const res = await fetch('http://localhost:7251/api/users/create-user-in-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ CurrentUserId: userId, UserId: targetUserId, RoleId: roleId, RoleName: roleName }),
      });
      if (!res.ok) throw new Error('Failed to assign role');
      await fetchUsers();
      await fetchUserInRoles();
      setSuccess('Role assigned successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemoveRole = async (userId: number, roleId: number) => {
    try {
      const res = await fetch(`http://localhost:7251/api/users/delete-user-in-role?userId=${userId}&roleId=${roleId}&currentUserId=${userId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to remove role');
      await fetchUsers();
      await fetchUserInRoles();
      setSuccess('Role removed successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getUserRoleMapping = (userId: number) => {
    return userInRoles.find(m => m.UserId === userId);
  };

  const getUserRoleName = (userId: number) => {
    const mapping = getUserRoleMapping(userId);
    return mapping ? mapping.RoleName : 'N/A';
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userId');
    }
    router.push('/');
  };

  const [activeSection, setActiveSection] = useState('users');

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <Navbar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 p-6">
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 z-50">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {(error || success) && (
          <div className={`mb-4 p-4 rounded ${error ? 'bg-red-500' : 'bg-green-500'} text-white text-lg font-semibold`}>
            {error || success}
          </div>
        )}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800">User Management</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Logout
          </button>
        </div>
        {activeSection === 'users' ? (
          <UserManagement
            users={users}
            roles={roles}
            userInRoles={userInRoles}
            onCreateUser={handleCreateUser}
            onDeleteUser={handleDeleteUser}
            onUpdateUser={handleUpdateUser}
            getUserRoleName={getUserRoleName}
            getUserRoleMapping={getUserRoleMapping}
            onAssignRole={handleAssignRole}
            onRemoveRole={handleRemoveRole}
            loading={loading}
            rolesLoading={rolesLoading}
            error={error}
            success={success}
            setNewUser={setNewUser}
            setEditUser={setEditUser}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        ) : (
          <RoleManagement
            roles={roles}
            onCreateRole={handleCreateRole}
            onDeleteRole={handleDeleteRole}
            loading={loading}
            error={error}
            success={success}
            setNewRole={setNewRole}
          />
        )}
      </div>
    </div>
  );
}
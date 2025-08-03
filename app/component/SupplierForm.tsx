import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSearch } from 'react-icons/fa';

interface ApiSupplier {
  supplierID: number;
  name: string;
  address: string;
  phone: string;
  createdDate: string; // ISO string
}

interface SupplierFormData {
  name: string;
  address: string;
  phone: string;
}

const SupplierForm: React.FC = () => {
  const [suppliers, setSuppliers] = useState<ApiSupplier[]>([]);
  const [form, setForm] = useState<SupplierFormData>({
    name: '',
    address: '',
    phone: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const apiUrl = 'http://localhost:7251/api/Suppliers'; // Change as needed

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error('Failed to fetch suppliers');
      const data: ApiSupplier[] = await res.json();
      setSuppliers(data);
    } catch (error) {
      toast.error('Error loading suppliers');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error('Supplier name is required');
      return;
    }

    try {
      const body = {
        name: form.name,
        address: form.address,
        phone: form.phone,
      };

      let res: Response;
      if (editingId === null) {
        res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error('Failed to add supplier');
        toast.success('Supplier added successfully!');
      } else {
        res = await fetch(`${apiUrl}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error('Failed to update supplier');
        toast.success('Supplier updated successfully!');
      }

      setForm({
        name: '',
        address: '',
        phone: '',
      });
      setEditingId(null);
      loadSuppliers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleEdit = (id: number) => {
    const supplier = suppliers.find(s => s.supplierID === id);
    if (supplier) {
      setForm({
        name: supplier.name,
        address: supplier.address,
        phone: supplier.phone,
      });
      setEditingId(id);
    }
  };

  const confirmDelete = (id: number) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleDelete = async () => {
    if (deleteId === null) return;

    try {
      const res = await fetch(`${apiUrl}/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete supplier');
      toast.info('Supplier deleted!');
      setShowDeleteModal(false);
      setDeleteId(null);
      loadSuppliers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format ISO date string to readable format
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-[#F9F7F3] min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-2xl shadow-lg space-y-8 border border-gray-200"
        aria-label="Supplier Form"
      >
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          {editingId ? 'Edit Supplier' : 'Add Supplier'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Supplier Name */}
          <div>
            <label htmlFor="name" className="block mb-2 font-semibold text-gray-700">
              Supplier Name
            </label>
            <input
              id="name"
              name="name"
              placeholder="Supplier Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-xl shadow-sm text-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-indigo-500"
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block mb-2 font-semibold text-gray-700">
              Address
            </label>
            <input
              id="address"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-xl shadow-sm text-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-indigo-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block mb-2 font-semibold text-gray-700">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-xl shadow-sm text-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-indigo-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full md:w-auto bg-indigo-600 text-white text-xl font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-indigo-700 transition"
          aria-label={editingId ? 'Update Supplier' : 'Add Supplier'}
        >
          {editingId ? 'Update' : 'Submit'}
        </button>
      </form>

      <div className="mt-12 overflow-x-auto bg-white shadow-xl rounded-2xl border border-gray-200">
        {/* Search bar */}
        <div className="p-6 border-b bg-white flex justify-end">
          <div className="relative w-64">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-3 focus:ring-indigo-500 text-lg"
              aria-label="Search products by name"
            />
          </div>
        </div>

        {/* Table */}
        <table
          className="min-w-full divide-y divide-gray-200 bg-white rounded-b-2xl shadow-sm"
          role="table"
          aria-label="Suppliers List"
        >
         <thead className="bg-indigo-100 text-indigo-800 text-left text-lg">
  <tr>
    <th className="px-6 py-4 font-semibold">Name</th>
    <th className="px-6 py-4 font-semibold">Address</th>
    <th className="px-6 py-4 font-semibold">Phone</th>
    <th className="px-6 py-4 font-semibold">Created Date</th>
    <th className="px-6 py-4 font-semibold text-center">Actions</th>
  </tr>
</thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSuppliers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No suppliers found.
                </td>
              </tr>
            ) : (
              filteredSuppliers.map((supplier) => (
                <tr key={supplier.supplierID} className="hover:bg-indigo-50">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{supplier.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{supplier.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{supplier.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {formatDate(supplier.createdDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button
                      onClick={() => handleEdit(supplier.supplierID)}
                      className="text-indigo-600 hover:text-indigo-900 font-semibold"
                      aria-label={`Edit supplier ${supplier.name}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(supplier.supplierID)}
                      className="text-red-600 hover:text-red-900 font-semibold"
                      aria-label={`Delete supplier ${supplier.name}`}
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

      {/* Delete confirmation modal */}
      {showDeleteModal && (
       <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700/70 backdrop-blur-sm transition duration-300">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
            <h3 className="text-2xl font-bold text-gray-900">Confirm Delete</h3>
            <p className="text-gray-700">
              Are you sure you want to delete this supplier?
            </p>
            <div className="flex justify-center space-x-4">
               <button
                onClick={cancelDelete}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default SupplierForm;

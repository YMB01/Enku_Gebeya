import React, { Component, ChangeEvent, FormEvent } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
}

interface State {
  products: Product[];
  form: Omit<Product, 'id'>;
  editingId: number | null;
  showDeleteModal: boolean;
  deleteId: number | null;
}

export default class ProductForm extends Component<{}, State> {
  state: State = {
    products: [
      { id: 1, name: 'Product 1', price: '100', description: 'Product 1 description' },
      { id: 2, name: 'Product 2', price: '200', description: 'Product 2 description' },
      { id: 3, name: 'Product 3', price: '300', description: 'Product 3 description' },
    ],
    form: { name: '', price: '', description: '' },
    editingId: null,
    showDeleteModal: false,
    deleteId: null,
  };

  handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    this.setState(prev => ({
      form: { ...prev.form, [name]: value },
    }));
  };

  handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { products, form, editingId } = this.state;

    if (editingId === null) {
      const newProduct: Product = {
        id: Date.now(),
        ...form,
      };
      this.setState(
        { products: [...products, newProduct], form: { name: '', price: '', description: '' } },
        () => {
          toast.success('Product added successfully!');
        }
      );
    } else {
      const updated = products.map(p =>
        p.id === editingId ? { ...p, ...form } : p
      );
      this.setState(
        { products: updated, form: { name: '', price: '', description: '' }, editingId: null },
        () => {
          toast.success('Product updated successfully!');
        }
      );
    }
  };

  handleEdit = (id: number) => {
    const product = this.state.products.find(p => p.id === id);
    if (product) {
      this.setState({
        form: { name: product.name, price: product.price, description: product.description },
        editingId: id,
      });
    }
  };

  confirmDelete = (id: number) => {
    this.setState({ showDeleteModal: true, deleteId: id });
  };

  cancelDelete = () => {
    this.setState({ showDeleteModal: false, deleteId: null });
  };

  handleDelete = () => {
    const { deleteId, products } = this.state;
    if (deleteId !== null) {
      const filtered = products.filter(p => p.id !== deleteId);
      this.setState({ products: filtered, showDeleteModal: false, deleteId: null });
      toast.error('Product deleted!');
    }
  };

  render() {
    const { form, products, editingId, showDeleteModal } = this.state;

    return (
      <div className="max-w-6xl mx-auto p-6">
        <form onSubmit={this.handleSubmit} className="bg-white p-8 rounded-xl shadow-lg space-y-6 mb-8 border border-gray-200">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            {editingId ? 'Edit Product' : 'Add Product'}
          </h2>
          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-gray-700">Product Name</label>
              <input
                name="name"
                id="name"
                placeholder="Product Name"
                value={form.name}
                onChange={this.handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-lg font-medium text-gray-700">Price</label>
              <input
                name="price"
                id="price"
                placeholder="Price"
                value={form.price}
                onChange={this.handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-lg font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                id="description"
                placeholder="Description"
                value={form.description}
                onChange={this.handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm h-32 text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editingId ? 'Update' : 'Submit'}
          </button>
        </form>

        <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
          <table className="min-w-full text-left table-auto border-collapse">
            <thead className="bg-slate-600 text-white">
              <tr>
                <th className="py-4 px-6 text-sm font-semibold">Name</th>
                <th className="py-4 px-6 text-sm font-semibold">Price</th>
                <th className="py-4 px-6 text-sm font-semibold">Description</th>
                <th className="py-4 px-6 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {products.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-100">
                  <td className="py-4 px-6 text-gray-800">{p.name}</td>
                  <td className="py-4 px-6 text-gray-800">{p.price}</td>
                  <td className="py-4 px-6 text-gray-800">{p.description}</td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => this.handleEdit(p.id)}
                        className="px-4 py-2 text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg transition duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => this.confirmDelete(p.id)}
                        className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 px-6 text-center text-gray-500">
                    No products added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700/70 backdrop-blur-sm">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this product?</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={this.cancelDelete}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={this.handleDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    );
  }
}

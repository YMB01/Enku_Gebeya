import React, { Component, ChangeEvent, FormEvent } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Category {
  id: number;
  name: string;
  description: string;
}

interface State {
  categories: Category[];
  form: Omit<Category, 'id'>;
  editingId: number | null;
  showModal: boolean;
  deleteId: number | null;
}

export default class CategoryForm extends Component<{}, State> {
  state: State = {
    categories: [
      { id: 1, name: 'Groceries', description: 'Items bought for daily consumption' },
      { id: 2, name: 'Utilities', description: 'Electricity, Water, Internet bills' },
      { id: 3, name: 'Entertainment', description: 'Movies, Games, and Subscriptions' },
    ],
    form: { name: '', description: '' },
    editingId: null,
    showModal: false,
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
    const { categories, form, editingId } = this.state;

    if (!form.name || !form.description) {
      toast.error('All fields are required!');
      return;
    }

    if (editingId === null) {
      const newCategory: Category = {
        id: Date.now(),
        ...form,
      };
      this.setState({ categories: [...categories, newCategory], form: { name: '', description: '' } });
      toast.success('Category added!');
    } else {
      const updated = categories.map(c =>
        c.id === editingId ? { ...c, ...form } : c
      );
      this.setState({ categories: updated, form: { name: '', description: '' }, editingId: null });
      toast.info('Category updated!');
    }
  };

  handleEdit = (id: number) => {
    const category = this.state.categories.find(c => c.id === id);
    if (category) {
      this.setState({
        form: { name: category.name, description: category.description },
        editingId: id,
      });
    }
  };

  confirmDelete = (id: number) => {
    this.setState({ showModal: true, deleteId: id });
  };

  cancelDelete = () => {
    this.setState({ showModal: false, deleteId: null });
  };

  handleDelete = () => {
    const { deleteId, categories } = this.state;
    if (deleteId !== null) {
      const filtered = categories.filter(c => c.id !== deleteId);
      this.setState({ categories: filtered, showModal: false, deleteId: null });
      toast.warning('Category deleted!');
    }
  };

  render() {
    const { form, categories, editingId, showModal } = this.state;

    return (
      <div className="max-w-5xl mx-auto p-6">
        <ToastContainer position="top-right" />

        <form
          onSubmit={this.handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg space-y-6 mb-8 border border-gray-200"
        >
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            {editingId ? 'Edit Category' : 'Add Category'}
          </h2>

          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-gray-700">Category Name</label>
              <input
                name="name"
                id="name"
                placeholder="Enter category name"
                value={form.name}
                onChange={this.handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-lg font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                id="description"
                placeholder="Enter description"
                value={form.description}
                onChange={this.handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm text-lg text-gray-700 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
    type="submit"
    className="bg-sky-500 text-white px-8 py-4  rounded-full font-bold text-lg shadow-lg hover:bg-sky-600 hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sky-400 focus:ring-opacity-75 focus:ring-offset-2 focus:ring-offset-white min-w-48 max-w-xs"
  >
    {editingId ? 'Update' : 'Save'}
  </button>
        </form>

        <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
          <table className="min-w-full text-left table-auto border-collapse">
            <thead className="bg-slate-600 text-white">
              <tr>
                <th className="py-4 px-6 text-sm font-semibold">Category Name</th>
                <th className="py-4 px-6 text-sm font-semibold">Description</th>
                <th className="py-4 px-6 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {categories.map(c => (
                <tr key={c.id} className="border-b hover:bg-gray-100">
                  <td className="py-4 px-6 text-gray-800">{c.name}</td>
                  <td className="py-4 px-6 text-gray-800">{c.description}</td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => this.handleEdit(c.id)}
                        className="px-4 py-2 text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg transition duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => this.confirmDelete(c.id)}
                        className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-4 px-6 text-center text-gray-500">
                    No categories added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700/70 backdrop-blur-sm transition duration-300">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this category?</p>
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
      </div>
    );
  }
}

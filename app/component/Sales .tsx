import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSearch, FaPlus, FaTimes, FaEdit, FaTrash, FaEraser } from 'react-icons/fa';
import styles from './SalesForm.module.css';

// Define the interface for a Sales record
interface Sale {
  id: number;
  date: string;
  customerName: string;
  itemSold: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

// Define the DTO interface for sending data to the API
interface SaleDto {
  date: string;
  customerName: string;
  itemSold: string;
  quantity: number;
  unitPrice: number;
}

// Define the state interface
interface State {
  sales: Sale[];
  form: SaleDto;
  editingId: number | null;
  showDeleteModal: boolean;
  deleteId: number | null;
  searchTerm: string;
  showFormModal: boolean;
  isDeleteModalAnimating: boolean;
  isFormModalAnimating: boolean;
  currentPage: number;
  itemsPerPage: number;
  isLoading: boolean;
}

const API_BASE_URL = 'http://localhost:7251/api/Sales';

const SalesForm: React.FC = () => {
  const [state, setState] = useState<State>({
    sales: [],
    form: { date: '', customerName: '', itemSold: '', quantity: 0, unitPrice: 0 },
    editingId: null,
    showDeleteModal: false,
    deleteId: null,
    searchTerm: '',
    showFormModal: false,
    isDeleteModalAnimating: false,
    isFormModalAnimating: false,
    currentPage: 1,
    itemsPerPage: 5,
    isLoading: false,
  });

  const {
    sales,
    form,
    editingId,
    showDeleteModal,
    deleteId,
    searchTerm,
    showFormModal,
    isDeleteModalAnimating,
    isFormModalAnimating,
    currentPage,
    itemsPerPage,
    isLoading,
  } = state;

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: Sale[] = await response.json();
      const sortedData = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setState((prev) => ({ ...prev, sales: sortedData }));
    } catch (error: any) {
      console.error('Error fetching sales:', error);
      toast.error(`Failed to load sales data: ${error.message}`);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setState((prev) => ({
      ...prev,
      form: {
        ...prev.form,
        [name]: type === 'number' ? parseFloat(value) : value,
      },
    }));
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, searchTerm: e.target.value, currentPage: 1 }));
  };

  const clearSearch = () => {
    setState((prev) => ({ ...prev, searchTerm: '', currentPage: 1 }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.customerName || !form.itemSold || form.quantity <= 0 || form.unitPrice <= 0) {
      toast.error('Please fill in all fields with valid values!');
      return;
    }

    try {
      let response;
      let method: string;
      let url: string;

      if (editingId === null) {
        method = 'POST';
        url = API_BASE_URL;
        response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else {
        method = 'PUT';
        url = `${API_BASE_URL}/${editingId}`;
        response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, id: editingId }),
        });
      }

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API error! status: ${response.status}, message: ${errorData || response.statusText}`);
      }

      await fetchSales();
      setState((prev) => ({
        ...prev,
        form: { date: '', customerName: '', itemSold: '', quantity: 0, unitPrice: 0 },
        editingId: null,
        isFormModalAnimating: false,
        currentPage: editingId === null ? Math.ceil((sales.length + 1) / itemsPerPage) : prev.currentPage,
      }));
      setTimeout(() => {
        setState((prev) => ({ ...prev, showFormModal: false }));
        toast.success(method === 'POST' ? 'Sales record added successfully!' : 'Sales record updated successfully!');
      }, 300);
    } catch (error: any) {
      console.error('Error submitting sales data:', error);
      toast.error(`Failed to save sales record: ${error.message}`);
    }
  };

  const handleEdit = (id: number) => {
    const sale = sales.find((s) => s.id === id);
    if (sale) {
      setState((prev) => ({
        ...prev,
        form: {
          date: sale.date,
          customerName: sale.customerName,
          itemSold: sale.itemSold,
          quantity: sale.quantity,
          unitPrice: sale.unitPrice,
        },
        editingId: id,
        showFormModal: true,
        isFormModalAnimating: true,
      }));
    }
  };

  const confirmDelete = (id: number) => {
    setState((prev) => ({
      ...prev,
      showDeleteModal: true,
      deleteId: id,
      isDeleteModalAnimating: true,
    }));
  };

  const cancelDelete = () => {
    setState((prev) => ({ ...prev, isDeleteModalAnimating: false }));
    setTimeout(() => {
      setState((prev) => ({ ...prev, showDeleteModal: false, deleteId: null }));
    }, 300);
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      const response = await fetch(`${API_BASE_URL}/${deleteId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API error! status: ${response.status}, message: ${errorData || response.statusText}`);
      }
      await fetchSales();
      const totalPagesAfterDelete = Math.ceil((sales.length - 1) / itemsPerPage);
      let newCurrentPage = currentPage;
      if (currentPage > totalPagesAfterDelete && totalPagesAfterDelete > 0) {
        newCurrentPage = totalPagesAfterDelete;
      } else if (totalPagesAfterDelete === 0) {
        newCurrentPage = 1;
      }
      setState((prev) => ({ ...prev, isDeleteModalAnimating: false }));
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          showDeleteModal: false,
          deleteId: null,
          currentPage: newCurrentPage,
        }));
        toast.success('Sales record deleted!');
      }, 300);
    } catch (error: any) {
      console.error('Error deleting sales record:', error);
      toast.error(`Failed to delete sales record: ${error.message}`);
      cancelDelete();
    }
  };

  const closeFormModal = () => {
    setState((prev) => ({ ...prev, isFormModalAnimating: false }));
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        showFormModal: false,
        editingId: null,
        form: { date: '', customerName: '', itemSold: '', quantity: 0, unitPrice: 0 },
      }));
    }, 300);
  };

  const handlePageChange = (pageNumber: number) => {
    setState((prev) => ({ ...prev, currentPage: pageNumber }));
  };

  const filteredSales = sales.filter(
    (s) =>
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.itemSold.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.date.includes(searchTerm)
  );

  const totalSalesAmount = sales.reduce((sum, s) => sum + s.totalAmount, 0);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSales.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={`${styles.container} max-w-7xl mx-auto p-4 sm:p-6 md:p-8 bg-[#E6F0FA] min-h-screen font-sans`}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] text-center mb-4 sm:mb-6">
          Sales Tracking
        </h2>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="relative w-full sm:w-1/2 max-w-md">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-transform duration-200 group-hover:scale-110" />
            <input
              type="text"
              placeholder="Search by customer, item, or date..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={`${styles.searchInput} w-full pl-12 pr-10 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-3 focus:ring-indigo-500 text-base sm:text-lg transition duration-200 shadow-sm hover:shadow-md`}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600 transition duration-200"
                aria-label="Clear search"
              >
                <FaEraser size={18} />
              </button>
            )}
          </div>
          <button
            onClick={() =>
              setState((prev) => ({
                ...prev,
                editingId: null,
                form: { date: '', customerName: '', itemSold: '', quantity: 0, unitPrice: 0 },
                showFormModal: true,
                isFormModalAnimating: true,
              }))
            }
            className={`${styles.btnPrimary} flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg text-base sm:text-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-75 w-full sm:w-auto`}
          >
            <FaPlus />
            Add New Sale
          </button>
        </div>
      </div>

      <div className={`${styles.cardShadow} bg-white p-4 sm:p-6 rounded-2xl shadow-xl mb-6 text-center`}>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">Total Sales Revenue</h3>
        <p className="text-2xl sm:text-4xl font-extrabold text-[#4CAF50]">
          Birr {totalSalesAmount.toFixed(2)}
        </p>
      </div>

      {isLoading && (
        <div className="text-center py-4 text-indigo-600 font-semibold">
          Loading data...
        </div>
      )}

      {showDeleteModal && (
        <div
          className={`${styles.modalOverlay} fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
            isDeleteModalAnimating ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className={`${styles.modalContent} bg-white rounded-2xl p-6 sm:p-8 shadow-2xl max-w-[90%] sm:max-w-md w-full text-center transition-transform duration-300 ease-out ${
              isDeleteModalAnimating ? 'scale-100' : 'scale-95'
            }`}
          >
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this sales record? This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelDelete}
                className="bg-gray-300 hover:bg-gray-400 px-4 sm:px-6 py-2 rounded-xl text-gray-800 font-semibold transition duration-200 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 px-4 sm:px-6 py-2 rounded-xl text-white font-semibold transition duration-200 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showFormModal && (
        <div
          className={`${styles.modalOverlay} fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
            isFormModalAnimating ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className={`${styles.modalContent} bg-white w-full max-w-[95%] sm:max-w-3xl p-6 sm:p-8 rounded-2xl shadow-2xl relative transition-transform duration-300 ease-out ${
              isFormModalAnimating ? 'scale-100' : 'scale-95'
            } overflow-y-auto max-h-[90vh]`}
          >
            <button
              onClick={closeFormModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-1"
              aria-label="Close form"
            >
              <FaTimes size={24} />
            </button>
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center">
                {editingId ? 'Edit Sales Record' : 'Add New Sales Record'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm text-base sm:text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    id="customerName"
                    placeholder="e.g., ABC Corp, John Doe"
                    value={form.customerName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm text-base sm:text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="itemSold" className="block text-sm font-medium text-gray-700 mb-1">
                    Item/Service Sold
                  </label>
                  <input
                    type="text"
                    name="itemSold"
                    id="itemSold"
                    placeholder="e.g., Product A, Consulting Service"
                    value={form.itemSold}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm text-base sm:text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    id="quantity"
                    step="1"
                    min="1"
                    placeholder="e.g., 1, 10"
                    value={form.quantity > 0 ? form.quantity : ''}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm text-base sm:text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Unit Price (Birr)
                  </label>
                  <input
                    type="number"
                    name="unitPrice"
                    id="unitPrice"
                    step="0.01"
                    min="0.01"
                    placeholder="e.g., 50.00, 12.50"
                    value={form.unitPrice > 0 ? form.unitPrice : ''}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm text-base sm:text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-lg hover:bg-green-700 hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-75 focus:ring-offset-2 focus:ring-offset-white min-w-[150px] sm:min-w-[200px]"
                >
                  {editingId ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={`${styles.tableContainer} overflow-x-auto bg-white shadow-xl rounded-2xl border border-gray-200 mt-6`}>
        <div className="hidden sm:block">
          <table className="min-w-full">
            <thead className="bg-indigo-100 text-indigo-800 text-left text-base sm:text-lg">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold">Date</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold">Customer Name</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold">Item Sold</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-right">Qty</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-right">Unit Price</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-right">Total Amount</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((s) => (
                  <tr key={s.id} className="border-b last:border-b-0 border-gray-200">
                    <td className="px-4 sm:px-6 py-3 sm:py-4">{s.date}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">{s.customerName}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">{s.itemSold}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">{s.quantity}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">Birr {s.unitPrice.toFixed(2)}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right font-medium text-[#4CAF50]">
                      Birr {s.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleEdit(s.id)}
                          className={styles.editBtn}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => confirmDelete(s.id)}
                          className={styles.deleteBtn}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500 italic">
                    {searchTerm ? 'No matching sales records found.' : 'No sales records to display. Add a new sale!'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="block sm:hidden">
          {currentItems.length > 0 ? (
            currentItems.map((s) => (
              <div key={s.id} className={`${styles.card} border-b border-gray-200 p-4 last:border-b-0`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">Date: {s.date}</p>
                    <p className="text-gray-600">Customer: {s.customerName}</p>
                  </div>
                  <p className="font-medium text-right text-[#4CAF50]">
                    Birr {s.totalAmount.toFixed(2)}
                  </p>
                </div>
                <p className="text-gray-600 mb-2">Item: {s.itemSold}</p>
                <p className="text-gray-600 mb-2">Qty: {s.quantity}</p>
                <p className="text-gray-600 mb-2">Unit Price: Birr {s.unitPrice.toFixed(2)}</p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(s.id)}
                    className={styles.editBtn}
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => confirmDelete(s.id)}
                    className={styles.deleteBtn}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500 italic">
              {searchTerm ? 'No matching sales records found.' : 'No sales records to display. Add a new sale!'}
            </div>
          )}
        </div>
      </div>

      {filteredSales.length > itemsPerPage && (
        <div className={`${styles.paginationContainer} mt-6 flex flex-wrap justify-center gap-2 sm:gap-3`}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`${styles.paginationButton} px-3 py-2 text-sm sm:text-base`}
          >
            Previous
          </button>
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`${styles.paginationButton} px-3 py-2 text-sm sm:text-base ${
                currentPage === number ? styles.active : ''
              }`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`${styles.paginationButton} px-3 py-2 text-sm sm:text-base`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SalesForm;
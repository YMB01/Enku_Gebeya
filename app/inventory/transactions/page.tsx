'use client';

import { useEffect, useState } from 'react';
import { getTransactionHistory, deleteTransaction, getProducts, getWarehouses } from '../utils/api';
import { Transaction, Product, Warehouse } from '../types';
import { FormInput } from '../components/FormInput';
import styles from './page.module.css';
import tableStyles from '../components/table.module.css';
import toast from 'react-hot-toast';

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [filters, setFilters] = useState({
    productId: '',
    warehouseId: '',
    startDate: '',
    endDate: '',
    includeDeleted: false,
  });
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionData = await getTransactionHistory();
        const productData = await getProducts();
        const warehouseData = await getWarehouses();
        setTransactions(transactionData);
        setProducts(productData);
        setWarehouses(warehouseData);
      } catch (err) {
        setError('Failed to fetch data');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFilters({ ...filters, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value });
  };

  const handleFilterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const transactionData = await getTransactionHistory(
        filters.productId ? parseInt(filters.productId) : undefined,
        filters.warehouseId ? parseInt(filters.warehouseId) : undefined,
        filters.startDate,
        filters.endDate,
        filters.includeDeleted
      );
      setTransactions(transactionData);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.Error || 'Failed to fetch transactions');
    }
  };

  const handleDelete = async (transactionId: number) => {
    try {
      await deleteTransaction(transactionId);
      const transactionData = await getTransactionHistory();
      setTransactions(transactionData);
      setError('');
      toast.success('Transaction deleted successfully!');
    } catch (err: any) {
      setError(err.response?.data?.Error || 'Failed to delete transaction');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Transaction History</h2>
      <div className={styles.formWrapper}>
        <form onSubmit={handleFilterSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <FormInput
              label="Product"
              type="select"
              name="productId"
              value={filters.productId}
              onChange={handleFilterChange}
              options={[{ value: '', label: 'All Products' }, ...products.map((p) => ({ value: p.ProductID, label: p.ProductName }))]}
            />
          </div>
          <div className={styles.formGroup}>
            <FormInput
              label="Warehouse"
              type="select"
              name="warehouseId"
              value={filters.warehouseId}
              onChange={handleFilterChange}
              options={[{ value: '', label: 'All Warehouses' }, ...warehouses.map((w) => ({ value: w.WarehouseID, label: w.WarehouseName }))]}
            />
          </div>
          <div className={styles.formGroup}>
            <FormInput label="Start Date" type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
          </div>
          <div className={styles.formGroup}>
            <FormInput label="End Date" type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
          </div>
          <div className={styles.formGroup}>
            <label>
              <input type="checkbox" name="includeDeleted" checked={filters.includeDeleted} onChange={handleFilterChange} />
              Include Deleted
            </label>
          </div>
          <div className={styles.formGroup}>
            <button type="submit">Apply Filters</button>
          </div>
        </form>
      </div>
      <h3>Transaction List</h3> 
      <div className={`${tableStyles.table} ${tableStyles.transactions}`}>
        <div className={tableStyles.header}>ID</div>
        <div className={tableStyles.header}>Product ID</div>
        <div className={tableStyles.header}>Warehouse ID</div>
        <div className={tableStyles.header}>Quantity</div>
        <div className={tableStyles.header}>Type</div>
        <div className={tableStyles.header}>Remarks</div>
        <div className={tableStyles.header}>Date</div>
        <div className={tableStyles.header}>Actions</div>
        {transactions.map((transaction) => (
          <div key={transaction.TransactionID} className={tableStyles.row}>
            <div>{transaction.TransactionID}</div>
            <div>{transaction.ProductID}</div>
            <div>{transaction.WarehouseID}</div>
            <div>{transaction.Quantity}</div>
            <div>{transaction.TransactionType}</div>
            <div>{transaction.Remarks}</div>
            <div>{new Date(transaction.TransactionDate).toLocaleDateString()}</div>
            <div>
              <button className={tableStyles.deleteButton} onClick={() => handleDelete(transaction.TransactionID)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
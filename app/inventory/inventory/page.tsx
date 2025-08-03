'use client';

import { useEffect, useState } from 'react';
import { updateInventory, getProducts, getWarehouses } from '../utils/api';
import { UpdateInventoryRequest, Product, Warehouse } from '../types';
import { FormInput } from '../components/FormInput';
import styles from './page.module.css';
import toast from 'react-hot-toast';

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [formData, setFormData] = useState<UpdateInventoryRequest>({
    ProductID: 0,
    WarehouseID: 0,
    Quantity: 0,
    TransactionType: '',
    Remarks: '',
  });
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await getProducts();
        const warehouseData = await getWarehouses();
        setProducts(productData);
        setWarehouses(warehouseData);
      } catch (err) {
        toast.error('Failed to fetch products or warehouses');
        setError('Failed to fetch products or warehouses');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateInventory(formData);
      setFormData({ ProductID: 0, WarehouseID: 0, Quantity: 0, TransactionType: '', Remarks: '' });
      setError('');
      toast.success('Inventory updated successfully!');
    } catch (err: any) {
      const errorMessage = err.response?.data?.Error || 'Failed to update inventory';
      setError(errorMessage);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Update Inventory</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <FormInput
            label="Product"
            type="select"
            name="ProductID"
            value={formData.ProductID}
            onChange={handleInputChange}
            required
            options={products.map((p) => ({ value: p.ProductID, label: p.ProductName }))}
          />
        </div>
        <div className={styles.formGroup}>
          <FormInput
            label="Warehouse"
            type="select"
            name="WarehouseID"
            value={formData.WarehouseID}
            onChange={handleInputChange}
            required
            options={warehouses.map((w) => ({ value: w.WarehouseID, label: w.WarehouseName }))}
          />
        </div>
        <div className={styles.formGroup}>
          <FormInput
            label="Quantity"
            type="number"
            name="Quantity"
            value={formData.Quantity}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <FormInput
            label="Transaction Type"
            type="select"
            name="TransactionType"
            value={formData.TransactionType}
            onChange={handleInputChange}
            required
            options={[
              { value: 'IN', label: 'Stock In' },
              { value: 'OUT', label: 'Stock Out' },
            ]}
          />
        </div>
        <div className={styles.formGroup}>
          <FormInput
            label="Remarks"
            type="textarea"
            name="Remarks"
            value={formData.Remarks}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.formGroup}>
          <button type="submit" className={styles.btnPrimary}>
            Update Inventory
          </button>
        </div>
      </form>
    </div>
  );
}
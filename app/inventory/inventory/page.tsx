'use client';

import { useEffect, useState } from 'react';
import { updateInventory, getProducts, getWarehouses } from '../utils/api';
import { UpdateInventoryRequest, Product, Warehouse } from '../types';
import { FormInput } from '../components/FormInput';
import styles from './page.module.css';

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
        setError('Failed to fetch products or warehouses');
      }
    };
    fetchData();
  }, []);

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
    } catch (err: any) {
      setError(err.response?.data?.Error || 'Failed to update inventory');
    }
  };

  return (
    <div
      style={{
        maxWidth: '1240px',
        margin: '2rem auto',
        padding: '40px',
        background: 'var(--white-bg)',
        borderRadius: '16px',
        boxShadow: 'var(--shadow)',
        position: 'relative',
        overflow: 'hidden',
        animation: 'fadeIn 0.6s ease-out',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '4px',
          background: 'var(--primary-orange)',
          borderRadius: '16px 16px 0 0',
        }}
      />
      <h2
        style={{
          fontSize: '2rem',
          fontWeight: 500,
          color: 'var(--black-text)',
          textAlign: 'center',
          marginBottom: '1.5rem',
          position: 'relative',
        }}
      >
        Update Inventory
        <span
          style={{
            display: 'block',
            width: '60px',
            height: '3px',
            background: 'var(--primary-orange)',
            margin: '8px auto 0',
            borderRadius: '2px',
          }}
        />
      </h2>
      {error && (
        <p
          style={{
            color: 'var(--black-text)',
            fontSize: '0.95rem',
            background: 'var(--white-bg)',
            padding: '12px 16px',
            borderRadius: '8px',
            borderLeft: '4px solid var(--primary-orange)',
            marginBottom: '1.5rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow)',
          }}
        >
          {error}
        </p>
      )}
      <form
        onSubmit={handleSubmit}
        className={styles.form}
        style={{
          display: 'grid',
          gap: '1.5rem',
          maxWidth: '600px',
          margin: '0 auto',
          padding: '20px',
          background: 'var(--light-bg)',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(255, 98, 0, 0.05)',
        }}
      >
        <FormInput
          label="Product"
          type="select"
          name="ProductID"
          value={formData.ProductID}
          onChange={handleInputChange}
          required
          options={products.map((p) => ({ value: p.ProductID, label: p.ProductName }))}
        />
        <FormInput
          label="Warehouse"
          type="select"
          name="WarehouseID"
          value={formData.WarehouseID}
          onChange={handleInputChange}
          required
          options={warehouses.map((w) => ({ value: w.WarehouseID, label: w.WarehouseName }))}
        />
        <FormInput
          label="Quantity"
          type="number"
          name="Quantity"
          value={formData.Quantity}
          onChange={handleInputChange}
          required
        />
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
        <FormInput
          label="Remarks"
          type="textarea"
          name="Remarks"
          value={formData.Remarks}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          style={{
            background: 'var(--primary-orange)',
            color: 'var(--white-bg)',
            border: 'none',
            padding: '12px 28px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 600,
            boxShadow: 'var(--shadow)',
            transition: 'all 0.3s ease',
            display: 'block',
            margin: '0 auto',
            textAlign: 'center',
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.background = 'var(--dark-orange)')
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background = 'var(--primary-orange)')
          }
        >
          Update Inventory
        </button>
      </form>
    </div>
  );
}
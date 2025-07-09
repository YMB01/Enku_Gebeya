'use client';

import { useEffect, useState } from 'react';
import { createWarehouse, updateWarehouse, getWarehouses, deleteWarehouse } from '../utils/api';
import { CreateWarehouseRequest, Warehouse } from '../types';
import { FormInput } from '../components/FormInput';
import styles from './page.module.css';
import tableStyles from '../components/table.module.css';
import toast from 'react-hot-toast';

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [formData, setFormData] = useState<CreateWarehouseRequest>({ WarehouseName: '', Location: '' });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const warehouseData = await getWarehouses();
        setWarehouses(warehouseData);
      } catch (err) {
        toast.error('Failed to fetch warehouses');
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateWarehouse(editId, formData);
        toast.success('Warehouse updated successfully!');
        setEditId(null);
      } else {
        await createWarehouse(formData);
        toast.success('Warehouse created successfully!');
      }
      setFormData({ WarehouseName: '', Location: '' });
      const warehouseData = await getWarehouses();
      setWarehouses(warehouseData);
    } catch (err: any) {
      toast.error(err.response?.data?.Error || 'Failed to save warehouse');
    }
  };

  const handleEdit = (warehouse: Warehouse) => {
    setEditId(warehouse.WarehouseID);
    setFormData({ WarehouseName: warehouse.WarehouseName, Location: warehouse.Location || '' });
  };

  const handleDelete = async (warehouseId: number) => {
    try {
      await deleteWarehouse(warehouseId);
      const warehouseData = await getWarehouses();
      setWarehouses(warehouseData);
      toast.success('Warehouse deleted successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.Error || 'Failed to delete warehouse');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Manage Warehouses</h2>
      <div className={styles.formWrapper}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <FormInput label="Warehouse Name" type="text" name="WarehouseName" value={formData.WarehouseName} onChange={handleInputChange} required />
          </div>
          <div className={styles.formGroup}>
            <FormInput label="Location" type="text" name="Location" value={formData.Location} onChange={handleInputChange} />
          </div>
          <div className={styles.formGroup}>
            <button type="submit">{editId ? 'Update Warehouse' : 'Create Warehouse'}</button>
          </div>
        </form>
      </div>
      <h3>Warehouse List</h3>
      <div className={`${tableStyles.table} ${tableStyles.warehouse}`}>
        <div className={tableStyles.header}>ID</div>
        <div className={tableStyles.header}>Name</div>
        <div className={tableStyles.header}>Location</div>
        <div className={tableStyles.header}>Actions</div>
        {warehouses.map((warehouse) => (
          <div key={warehouse.WarehouseID} className={tableStyles.row}>
            <div>{warehouse.WarehouseID}</div>
            <div>{warehouse.WarehouseName}</div>
            <div>{warehouse.Location}</div>
            <div>
              <button onClick={() => handleEdit(warehouse)}>Edit</button>
              <button onClick={() => handleDelete(warehouse.WarehouseID)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
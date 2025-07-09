'use client';

import { useEffect, useState } from 'react';
import { createProduct, updateProduct, getProducts, deleteProduct, getWarehouses } from '../utils/api';
import { CreateProductRequest, Product, Warehouse } from '../types';
import { FormInput } from '../components/FormInput';
import styles from './page.module.css';
import tableStyles from '../components/table.module.css';
import toast from 'react-hot-toast';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [formData, setFormData] = useState<CreateProductRequest>({
    ProductName: '',
    SKU: '',
    Description: '',
    UnitPrice: 0,
    QTY: 0,
    WarehouseID: undefined,
    Photo: '',
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number | undefined = value;

    if (name === 'UnitPrice') {
      parsedValue = value ? parseFloat(value) : 0;
    } else if (name === 'QTY') {
      parsedValue = value ? parseInt(value, 10) : 0;
    } else if (name === 'WarehouseID') {
      parsedValue = value ? parseInt(value, 10) : undefined;
    }

    setFormData({ ...formData, [name]: parsedValue });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64String = result.split(',')[1]; // Remove 'data:image/png;base64,' prefix
        setFormData({ ...formData, Photo: base64String || '' });
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, Photo: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateProduct(editId, formData);
        toast.success('Product updated successfully');
        setEditId(null);
      } else {
        await createProduct(formData);
        toast.success('Product created successfully');
      }
      setFormData({ ProductName: '', SKU: '', Description: '', UnitPrice: 0, QTY: 0, WarehouseID: undefined, Photo: '' });
      const productData = await getProducts();
      setProducts(productData);
      setError('');
    } catch (err: any) {
      const message = err.response?.data?.Error || 'Failed to save product';
      toast.error(message);
      setError(message);
    }
  };

  const handleEdit = (product: Product) => {
    setEditId(product.ProductID);
    setFormData({
      ProductName: product.ProductName,
      SKU: product.SKU,
      Description: product.Description || '',
      UnitPrice: product.UnitPrice,
      QTY: product.QTY,
      WarehouseID: product.WarehouseID,
      Photo: product.Photo || '',
    });
  };

  const handleDelete = async (productId: number) => {
    try {
      await deleteProduct(productId);
      const productData = await getProducts();
      setProducts(productData);
      toast.success('Product deleted successfully');
      setError('');
    } catch (err: any) {
      const message = err.response?.data?.Error || 'Failed to delete product';
      toast.error(message);
      setError(message);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Manage Products</h2>
      <div className={styles.formWrapper}>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <FormInput label="Product Name" type="text" name="ProductName" value={formData.ProductName} onChange={handleInputChange} required />
          </div>
          <div className={styles.formGroup}>
            <FormInput label="SKU" type="text" name="SKU" value={formData.SKU} onChange={handleInputChange} required />
          </div>
          <div className={styles.formGroup}>
            <FormInput label="Unit Price" type="number" name="UnitPrice" value={formData.UnitPrice} onChange={handleInputChange} required />
          </div>
          <div className={styles.formGroup}>
            <FormInput label="Quantity" type="number" name="QTY" value={formData.QTY} onChange={handleInputChange} required />
          </div>
          <div className={styles.formGroup}>
            <FormInput
              label="Warehouse"
              type="select"
              name="WarehouseID"
              value={formData.WarehouseID || ''}
              onChange={handleInputChange}
              options={warehouses.map((w) => ({ value: w.WarehouseID, label: w.WarehouseName }))}
            />
          </div>
          <div className={styles.formGroup}>
            <FormInput label="Description" type="textarea" name="Description" value={formData.Description} onChange={handleInputChange} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="Photo" className={styles.photoLabel}>Photo</label>
            <input
              type="file"
              id="Photo"
              name="Photo"
              accept="image/*"
              onChange={handlePhotoChange}
              className={styles.fileInput}
            />
            {/* <button
              type="button"
              className={styles.uploadButton}
              onClick={() => document.getElementById('Photo')?.click()}
            >
              Upload Photo
            </button> */}
            
            {formData.Photo && (
              <img src={`data:image/png;base64,${formData.Photo}`} alt="Preview" className={styles.photoPreview} />
            )}
          </div>
          <div className={styles.formGroup}>
            <button type="submit">{editId ? 'Update Product' : 'Create Product'}</button>
          </div>
        </form>
      </div>
      <h3>Product List</h3>
      <div className={`${tableStyles.table} ${tableStyles.products}`}>
        <div className={tableStyles.header}>ID</div>
        <div className={tableStyles.header}>Name</div>
        <div className={tableStyles.header}>SKU</div>
        <div className={tableStyles.header}>Description</div>
        <div className={tableStyles.header}>Unit Price</div>
        <div className={tableStyles.header}>Quantity</div>
        <div className={tableStyles.header}>Photo</div>
        <div className={tableStyles.header}>Actions</div>
        {products.map((product) => (
          <div key={product.ProductID} className={tableStyles.row}>
            <div>{product.ProductID}</div>
            <div>{product.ProductName}</div>
            <div>{product.SKU}</div>
            <div>{product.Description}</div>
            <div>{product.UnitPrice}</div>
            <div>{product.QTY}</div>
            <div>
              {product.Photo ? (
                <img
                  src={`data:image/png;base64,${product.Photo}`}
                  alt={product.ProductName}
                  style={{ maxWidth: '50px', maxHeight: '50px', cursor: 'pointer' }}
                  onClick={() => setSelectedImage(product.Photo)}
                />
              ) : (
                'No Photo'
              )}
            </div>
            <div>
              <button onClick={() => handleEdit(product)}>Edit</button>
              <button onClick={() => handleDelete(product.ProductID)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {selectedImage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={`data:image/png;base64,${selectedImage}`}
            alt="Full-size preview"
            style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '8px' }}
          />
        </div>
      )}
    </div>
  );
}
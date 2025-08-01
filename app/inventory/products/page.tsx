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
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await getProducts();
        setProducts(productData);
        setWarehouses(await getWarehouses());
      } catch (err) {
        setError('Failed to fetch products or warehouses');
      }
    };
    fetchData();
  }, []);

  // Utility function to clean base64 string (remove data URI prefix if present)
  const cleanBase64 = (base64: string | null | undefined): string | null => {
    if (!base64) return null;
    // Remove data URI prefix if present (e.g., "data:image/png;base64,")
    return base64.replace(/^data:image\/[a-z]+;base64,/, '');
  };

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
        setShowPopup(false);
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
    setShowPopup(true); // Show the popup for editing
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button onClick={() => setShowPopup(true)} className={styles.addButton}>
          Add New
        </button>
      </div>
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
                  src={`data:image/jpeg;base64,${cleanBase64(product.Photo)}`}
                  alt={product.ProductName}
                  style={{ maxWidth: '50px', maxHeight: '50px', cursor: 'pointer' }}
                  onClick={() => setSelectedImage(cleanBase64(product.Photo))}
                  onError={() => console.error('Failed to load image for product:', product.ProductID)}
                />
              ) : (
                'No Photo'
              )}
            </div>
            <div>
              <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => handleEdit(product)}>Edit</button>
              <button onClick={() => handleDelete(product.ProductID)}>Delete</button>
            </div>
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
            src={`data:image/jpeg;base64,${cleanBase64(selectedImage)}`}
            alt="Full-size preview"
            style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '8px' }}
            onError={() => console.error('Failed to load full-size image')}
          />
        </div>
      )}
      {showPopup && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPopup(false);
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '90%',
              maxWidth: '700px',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            <h3>{editId ? 'Edit Product' : 'Add New Product'}</h3>
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
                {formData.Photo && (
                  <img
                    src={`data:image/jpeg;base64,${cleanBase64(formData.Photo)}`}
                    alt="Preview"
                    className={styles.photoPreview}
                    onError={() => console.error('Failed to load image preview')}
                  />
                )}
              </div>
              <div className={styles.formGroup}>
                <button type="submit">{editId ? 'Update Product' : 'Create Product'}</button>
                <button type="button" onClick={() => setShowPopup(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
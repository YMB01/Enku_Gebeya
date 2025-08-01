import axios from 'axios';
import { UpdateInventoryRequest, CreateProductRequest, UpdateProductRequest, CreateWarehouseRequest, UpdateWarehouseRequest } from '../types';

const API_BASE_URL = 'http://localhost:7251/api/stockmanagement';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inventory APIs
export const updateInventory = async (data: UpdateInventoryRequest) => {
  const response = await api.post('/inventory/transaction', data);
  return response.data;
};

export const getInventoryStatus = async (warehouseId?: number, includeDeleted: boolean = false) => {
  const response = await api.get('/inventory/status', { params: { warehouseId, includeDeleted } });
  return response.data;
};

export const getLowStock = async (threshold: number = 10, warehouseId?: number) => {
  const response = await api.get('/inventory/lowstock', { params: { threshold, warehouseId } });
  return response.data;
};

// Products APIs
export const createProduct = async (data: CreateProductRequest) => {
  const response = await api.post('/products', data);
  return response.data;
};

export const updateProduct = async (productId: number, data: UpdateProductRequest) => {
  const response = await api.put(`/products/${productId}`, data);
  return response.data;
};

export const getProducts = async (productId?: number, includeDeleted: boolean = false) => {
  const response = await api.get('/products', { params: { productId, includeDeleted } });
  return response.data;
};

export const deleteProduct = async (productId: number) => {
  const response = await api.put(`/products/${productId}/delete`);
  return response.data;
};

// Warehouses APIs
export const createWarehouse = async (data: CreateWarehouseRequest) => {
  const response = await api.post('/warehouses', data);
  return response.data;
};

export const updateWarehouse = async (warehouseId: number, data: UpdateWarehouseRequest) => {
  const response = await api.put(`/warehouses/${warehouseId}`, data);
  return response.data;
};

export const getWarehouses = async (warehouseId?: number, includeDeleted: boolean = false) => {
  const response = await api.get('/warehouses', { params: { warehouseId, includeDeleted } });
  return response.data;
};

export const deleteWarehouse = async (warehouseId: number) => {
  const response = await api.put(`/warehouses/${warehouseId}/delete`);
  return response.data;
};

// Transactions APIs
export const getTransactionHistory = async (
  productId?: number,
  warehouseId?: number,
  startDate?: string,
  endDate?: string,
  includeDeleted: boolean = false
) => {
  const response = await api.get('/transactions/history', {
    params: { productId, warehouseId, startDate, endDate, includeDeleted },
  });
  return response.data;
};

export const deleteTransaction = async (transactionId: number) => {
  const response = await api.put(`/transactions/${transactionId}/delete`);
  return response.data;
};
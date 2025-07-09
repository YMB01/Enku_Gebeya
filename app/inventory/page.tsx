'use client';

import { useEffect, useState } from 'react';
import { getInventoryStatus, getLowStock } from './utils/api';
import { InventoryStatus } from './types';
import tableStyles from './components/table.module.css';

export default function InventoryDashboard() {
  const [inventory, setInventory] = useState<InventoryStatus[]>([]);
  const [lowStock, setLowStock] = useState<InventoryStatus[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inventoryData = await getInventoryStatus();
        const lowStockData = await getLowStock(10);
        setInventory(inventoryData);
        setLowStock(lowStockData);
      } catch (err) {
        setError('Failed to fetch dashboard data');
      }
    };
    fetchData();
  }, []);

  // Prepare data for Inventory Table
  const warehouses = [...new Set(inventory.map(item => item.WarehouseName))];
  const products = [...new Set(inventory.map(item => item.ProductName))];

  // Calculate summary metrics
  const totalInventory = inventory.reduce((sum, item) => sum + item.Quantity, 0);
  const lowStockCount = lowStock.length;
  const uniqueProducts = products.length;
  const uniqueWarehouses = warehouses.length;

  return (
    <div className="page">
      <main className="main">
        <div className={tableStyles.invContainer}>
          <h2 className={tableStyles.invMainHeader}>Inventory Dashboard</h2>
          {error && <p className={tableStyles.error}>{error}</p>}

          {/* Summary Cards */}
          <div className={tableStyles.invSummaryCards}>
            <div className={tableStyles.invCard}>
              <h4>Total Inventory</h4>
              <p className={tableStyles.invCardValue}>{totalInventory} units</p>
            </div>
            <div className={tableStyles.invCard}>
              <h4>Low Stock Items</h4>
              <p className={tableStyles.invCardValue}>{lowStockCount} products</p>
            </div>
            <div className={tableStyles.invCard}>
              <h4>Unique Products</h4>
              <p className={tableStyles.invCardValue}>{uniqueProducts}</p>
            </div>
            <div className={tableStyles.invCard}>
              <h4>Warehouses</h4>
              <p className={tableStyles.invCardValue}>{uniqueWarehouses}</p>
            </div>
          </div>

          {/* Inventory by Product and Warehouse Table */}
          <div className={tableStyles.invSection}>
            <h3 className={tableStyles.invSectionHeader}>Inventory by Product and Warehouse</h3>
            {inventory.length === 0 ? (
              <p style={{ color: 'var(--black-text)', padding: '15px' }}>No inventory data available</p>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `minmax(150px, 2fr) repeat(${warehouses.length}, minmax(100px, 1fr)) minmax(100px, 1fr)`,
                  width: '100%',
                  maxWidth: '100%',
                  marginTop: '20px',
                  background: 'var(--white-bg)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow)',
                  border: '1px solid var(--white-accent)',
                  overflowX: 'auto',
                }}
              >
                {/* Header */}
                <div style={{ display: 'contents' }}>
                  <div
                    style={{
                      padding: '15px',
                      textAlign: 'left',
                      borderBottom: '1px solid rgba(255, 98, 0, 0.1)',
                      borderRight: '1px solid rgba(255, 98, 0, 0.05)',
                      background: 'var(--primary-orange)',
                      color: 'var(--black-text)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    Product
                  </div>
                  {warehouses.map((warehouse, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '15px',
                        textAlign: 'left',
                        borderBottom: '1px solid rgba(255, 98, 0, 0.1)',
                        borderRight: '1px solid rgba(255, 98, 0, 0.05)',
                        background: 'var(--primary-orange)',
                        color: 'var(--black-text)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                      }}
                    >
                      {warehouse}
                    </div>
                  ))}
                  <div
                    style={{
                      padding: '15px',
                      textAlign: 'left',
                      borderBottom: '1px solid rgba(255, 98, 0, 0.1)',
                      borderRight: '1px solid rgba(255, 98, 0, 0.05)',
                      background: 'var(--primary-orange)',
                      color: 'var(--black-text)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    Total
                  </div>
                </div>

                {/* Rows */}
                {products.map((product, index) => {
                  const productTotal = inventory
                    .filter(item => item.ProductName === product)
                    .reduce((sum, item) => sum + item.Quantity, 0);
                  return (
                    <div key={index} style={{ display: 'contents' }}>
                      <div
                        style={{
                          padding: '15px',
                          textAlign: 'left',
                          borderBottom: '1px solid rgba(255, 98, 0, 0.1)',
                          borderRight: '1px solid rgba(255, 98, 0, 0.05)',
                          color: 'var(--black-text)',
                          fontSize: '0.95rem',
                          background: index % 2 === 0 ? 'var(--light-bg)' : 'transparent',
                        }}
                      >
                        {product}
                      </div>
                      {warehouses.map((warehouse, wIndex) => {
                        const item = inventory.find(
                          i => i.ProductName === product && i.WarehouseName === warehouse
                        );
                        return (
                          <div
                            key={wIndex}
                            style={{
                              padding: '15px',
                              textAlign: 'left',
                              borderBottom: '1px solid rgba(255, 98, 0, 0.1)',
                              borderRight: '1px solid rgba(255, 98, 0, 0.05)',
                              color: 'var(--black-text)',
                              fontSize: '0.95rem',
                              background: index % 2 === 0 ? 'var(--light-bg)' : 'transparent',
                            }}
                          >
                            {item ? item.Quantity : 0}
                          </div>
                        );
                      })}
                      <div
                        style={{
                          padding: '15px',
                          textAlign: 'left',
                          borderBottom: '1px solid rgba(255, 98, 0, 0.1)',
                          borderRight: '1px solid rgba(255, 98, 0, 0.05)',
                          color: 'var(--primary-orange)',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          background: index % 2 === 0 ? 'var(--light-bg)' : 'transparent',
                        }}
                      >
                        {productTotal}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Low Stock Details Table */}
          <div className={tableStyles.invSection}>
            <h3 className={tableStyles.invSectionHeader}>Low Stock Details (Threshold: 10)</h3>
            {lowStock.length === 0 ? (
              <p style={{ color: 'var(--black-text)', padding: '15px' }}>No low stock items available</p>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(150px, 2fr) minmax(150px, 2fr) minmax(100px, 1fr)',
                  width: '100%',
                  maxWidth: '100%',
                  marginTop: '20px',
                  background: 'var(--white-bg)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow)',
                  border: '1px solid var(--white-accent)',
                  overflowX: 'auto',
                }}
              >
                {/* Header */}
                <div style={{ display: 'contents' }}>
                  <div
                    style={{
                      padding: '15px',
                      textAlign: 'left',
                      borderBottom: '1px solid rgba(255, 98, 0, 0.1)',
                      borderRight: '1px solid rgba(255, 98, 0, 0.05)',
                      background: 'var(--primary-orange)',
                      color: 'var(--black-text)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    Product Name
                  </div>
                  <div
                    style={{
                      padding: '15px',
                      textAlign: 'left',
                      borderBottom: '1px solid rgba(255, 98, 0, 0.1)',
                      borderRight: '1px solid rgba(255, 98, 0, 0.05)',
                      background: 'var(--primary-orange)',
                      color: 'var(--black-text)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    Warehouse
                  </div>
                  <div
                    style={{
                      padding: '15px',
                      textAlign: 'left',
                      borderBottom: '1px solid rgba(255, 98, 0, 0.1)',
                      borderRight: '1px solid rgba(255, 98, 0, 0.05)',
                      background: 'var(--primary-orange)',
                      color: 'var(--black-text)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    Quantity
                  </div>
                </div>

                {/* Rows */}
                {lowStock
                  .sort((a, b) => a.Quantity - b.Quantity)
                  .map((item, index) => (
                    <div key={index} style={{ display: 'contents' }}>
                      <div
                        style={{
                          padding: '15px',
                          textAlign: 'left',
                          borderBottom: '1px solid rgba(255, 98, 0, 0.1)',
                          borderRight: '1px solid rgba(255, 98, 0, 0.05)',
                          color: 'var(--black-text)',
                          fontSize: '0.95rem',
                          background: index % 2 === 0 ? 'var(--light-bg)' : 'transparent',
                        }}
                      >
                        {item.ProductName}
                      </div>
                      <div
                        style={{
                          padding: '15px',
                          textAlign: 'left',
                          borderBottom: '1px solid rgba(255, 98, 0, 0.1)',
                          borderRight: '1px solid rgba(255, 98, 0, 0.05)',
                          color: 'var(--black-text)',
                          fontSize: '0.95rem',
                          background: index % 2 === 0 ? 'var(--light-bg)' : 'transparent',
                        }}
                      >
                        {item.WarehouseName}
                      </div>
                      <div
                        style={{
                          padding: '15px',
                          textAlign: 'left',
                          borderBottom: '1px solid rgba(255, 98, 0, 0.1)',
                          borderRight: '1px solid rgba(255, 98, 0, 0.05)',
                          color: 'var(--primary-orange)',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          background: index % 2 === 0 ? 'var(--light-bg)' : 'transparent',
                        }}
                      >
                        {item.Quantity}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="footer">
        {/* Add footer content if needed, e.g., <a href="/about">About</a> */}
      </footer>
    </div>
  );
}
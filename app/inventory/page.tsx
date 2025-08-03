
'use client';

import { useEffect, useState } from 'react';
import { getInventoryStatus, getLowStock } from './utils/api';
import { InventoryStatus } from './types';
import tableStyles from './components/table.module.css';
import Link from 'next/link';

export default function InventoryDashboard() {
  const [inventory, setInventory] = useState<InventoryStatus[]>([]);
  const [lowStock, setLowStock] = useState<InventoryStatus[]>([]);
  const [error, setError] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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

  const warehouses = [...new Set(inventory.map(item => item.WarehouseName))];
  const products = [...new Set(inventory.map(item => item.ProductName))];

  const totalInventory = inventory.reduce((sum, item) => sum + item.Quantity, 0);
  const lowStockCount = lowStock.length;
  const uniqueProducts = products.length;
  const uniqueWarehouses = warehouses.length;

  return (
    <div className="page" style={{ minHeight: '100vh' }}>
      {/* Navigation Bar */}
      <nav
        className="fixed top-0 left-0 w-full bg-white shadow-lg z-[100] transition-all ease-in-out duration-300"
        style={{ boxSizing: 'border-box' }}
      >
        <div
          className="container mx-auto px-6 py-4 flex justify-between items-center"
          style={{ maxWidth: '1200px' }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center text-2xl font-extrabold text-green-600"
            style={{ gap: '12px' }}
          >
            <img
              src="/images/enku.png"
              alt="Logo"
              style={{ width: '40px', height: '40px' }}
            />
            <span style={{ color: 'var(--black-text)', fontSize: '1.5rem' }}>
              Enku Gebeya
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center" style={{ gap: '24px' }}>
            <Link
              href="/"
              className="text-gray-700 hover:text-[var(--primary-orange)] font-medium transition duration-300 ease-in-out"
              style={{ fontSize: '1rem', padding: '8px 12px' }}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-gray-700 hover:text-[var(--primary-orange)] font-medium transition duration-300 ease-in-out"
              style={{ fontSize: '1rem', padding: '8px 12px' }}
            >
              Products
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-[var(--primary-orange)] font-medium transition duration-300 ease-in-out"
              style={{ fontSize: '1rem', padding: '8px 12px' }}
            >
              About
            </Link>
            <Link
              href="/finance"
              className="text-gray-700 hover:text-[var(--primary-orange)] font-medium transition duration-300 ease-in-out"
              style={{ fontSize: '1rem', padding: '8px 12px' }}
            >
              Finance
            </Link>
            <Link
              href="/inventory"
              className="text-gray-700 hover:text-[var(--primary-orange)] font-medium transition duration-300 ease-in-out"
              style={{ fontSize: '1rem', padding: '8px 12px' }}
            >
              Inventory
            </Link>
            <button
              className="bg-[var(--primary-orange)] text-white rounded-lg hover:bg-orange-600 font-medium transition duration-300 ease-in-out"
              style={{ padding: '10px 24px', fontSize: '1rem' }}
            >
              Login
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            style={{ padding: '8px' }}
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className="md:hidden bg-white border-t border-gray-200 transition-all ease-in-out duration-300"
            style={{ padding: '16px', boxShadow: 'var(--shadow)' }}
          >
            <div className="container mx-auto flex flex-col" style={{ gap: '16px' }}>
              <Link
                href="/"
                className="text-gray-700 hover:text-[var(--primary-orange)] font-medium transition duration-300 ease-in-out"
                onClick={toggleMenu}
                style={{ padding: '12px 16px', fontSize: '1rem' }}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-gray-700 hover:text-[var(--primary-orange)] font-medium transition duration-300 ease-in-out"
                onClick={toggleMenu}
                style={{ padding: '12px 16px', fontSize: '1rem' }}
              >
                Products
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-[var(--primary-orange)] font-medium transition duration-300 ease-in-out"
                onClick={toggleMenu}
                style={{ padding: '12px 16px', fontSize: '1rem' }}
              >
                About
              </Link>
              <Link
                href="/finance"
                className="text-gray-700 hover:text-[var(--primary-orange)] font-medium transition duration-300 ease-in-out"
                onClick={toggleMenu}
                style={{ padding: '12px 16px', fontSize: '1rem' }}
              >
                Finance
              </Link>
              <Link
                href="/inventory"
                className="text-gray-700 hover:text-[var(--primary-orange)] font-medium transition duration-300 ease-in-out"
                onClick={toggleMenu}
                style={{ padding: '12px 16px', fontSize: '1rem' }}
              >
                Inventory
              </Link>
              <button
                className="bg-[var(--primary-orange)] text-white rounded-lg hover:bg-orange-600 font-medium transition duration-300 ease-in-out"
                style={{ padding: '12px 16px', fontSize: '1rem' }}
                onClick={toggleMenu}
              >
                Login
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div
        className="content-container"
        style={{
          padding: '80px 20px 20px 20px', // Top padding for nav
          boxSizing: 'border-box',
          maxWidth: '100%',
          overflowX: 'auto',
        }}
      >
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
                <p style={{ color: 'var(--black-text)', padding: '15px' }}>
                  No inventory data available
                </p>
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
                        top: '64px',
                        zIndex: 10,
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
                          top: '64px',
                          zIndex: 10,
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
                        top: '64px',
                        zIndex: 10,
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
                <p style={{ color: 'var(--black-text)', padding: '15px' }}>
                  No low stock items available
                </p>
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
                        top: '64px',
                        zIndex: 10,
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
                        top: '64px',
                        zIndex: 10,
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
                        top: '64px',
                        zIndex: 10,
                      }}
                    >
                      Quantity
                    </div>
                  </div>
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
        <footer className="footer" style={{ padding: '20px', textAlign: 'center', color: 'var(--black-text)' }}>
          <p>&copy; 2025 Enku Gebeya. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

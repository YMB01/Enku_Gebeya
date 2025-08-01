'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './navbar.module.css';

export function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const toggleDropdown = (menu: string) => {
    setDropdownOpen(dropdownOpen === menu ? null : menu);
  };

  return (
    <nav className={`${styles.sidebar} ${styles.open}`}>
      <ul className={styles.menu} style={{ marginTop: '50px' }}>
        <li>
          <Link href="/inventory" className={styles.menuItem}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
            </svg>
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link href="/inventory/products" className={styles.menuItem}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
              <path d="M20 7h-9M14 17H5M17 12H5" />
            </svg>
            <span>Products</span>
          </Link>
        </li>
        <li>
          <Link href="/inventory/warehouses" className={styles.menuItem}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
              <path d="M4 4h16v16H4z" />
            </svg>
            <span>Stocks</span>
          </Link>
        </li>
        <li>
          <button onClick={() => toggleDropdown('inventory')} className={styles.menuItem}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
              <path d="M12 2v20M2 12h20" />
            </svg>
            <span>Inventory</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" className={dropdownOpen === 'inventory' ? styles.rotate : ''}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {dropdownOpen === 'inventory' && (
            <ul className={styles.dropdown}>
              <li>
                <Link href="/inventory/inventory" className={styles.dropdownItem}>Update Inventory</Link>
              </li>
              <li>
                <Link href="/inventory/transactions" className={styles.dropdownItem}>Transaction History</Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
}
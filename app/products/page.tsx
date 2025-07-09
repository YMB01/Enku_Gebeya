"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { XCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

// Product Interface
interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  imageUrl: string;
}

// Sample Product Data
const ALL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Enku Gebya prodact 1',
    price: '$249.99',
    description: 'A sleek and powerful smartwatch with advanced health tracking, long-lasting battery life, and seamless smartphone integration. Stay connected and on top of your fitness goals with style.',
    imageUrl: 'https://placehold.co/600x400/FFA500/FFFFFF?text=Enku Gebeya photo 1',
  },
  {
    id: 2,
    name: 'Enku Gebya prodact 2',
    price: '$199.99',
    description: 'Immerse yourself in pure sound with these comfortable, over-ear headphones. Featuring industry-leading noise cancellation and crystal-clear audio for an unparalleled listening experience.',
    imageUrl: 'https://placehold.co/600x400/FFA500/FFFFFF?text=Enku Gebeya photo 2',
  },
  {
    id: 3,
    name: 'Enku Gebya prodact 3',
    price: '$79.99',
    description: 'Take your music anywhere with this compact and durable Bluetooth speaker. Delivers surprisingly rich bass and clear highs, perfect for outdoor adventures or indoor relaxation.',
    imageUrl: 'https://placehold.co/600x400/FFA500/FFFFFF?text=Enku Gebeya photo 3',
  },
  {
    id: 4,
    name: 'Enku Gebya prodact 4',
    price: '$59.99',
    description: 'Gain the competitive edge with this ergonomic gaming mouse. Customizable RGB lighting, precise tracking, and programmable buttons for an optimized gaming setup.',
    imageUrl: 'https://placehold.co/600x400/FFA500/FFFFFF?text=Enku Gebeya photo 4',
  },
  {
    id: 5,
    name: 'Enku Gebya prodact 5',
    price: '$129.99',
    description: 'Control all your smart devices from one central hub. Compatible with various protocols, this hub simplifies your smart home experience and enhances security.',
    imageUrl: 'https://placehold.co/600x400/FFA500/FFFFFF?text=Enku Gebeya photo 5',
  },
  {
    id: 6,
    name: 'Enku Gebya prodact 6',
    price: '$349.99',
    description: 'Designed for ultimate comfort and support during long working hours. Fully adjustable to fit your body, promoting good posture and reducing strain.',
    imageUrl: 'https://placehold.co/600x400/FFA500/FFFFFF?text=Enku Gebeya photo 6',
  },
  {
    id: 7,
    name: 'Enku Gebya prodact 7',
    price: '$499.99',
    description: 'Experience stunning visuals with this 4K Ultra HD monitor. Perfect for gaming, graphic design, and immersive entertainment.',
    imageUrl: 'https://placehold.co/600x400/FFA500/FFFFFF?text=Enku Gebeya photo 7',
  },
  {
    id: 8,
    name: 'Enku Gebya prodact 8',
    price: '$119.99',
    description: 'Durable and responsive mechanical keyboard for typing enthusiasts and gamers. Enjoy tactile feedback and customizable backlighting.',
    imageUrl: 'https://placehold.co/600x400/FFA500/FFFFFF?text=Enku Gebeya photo 8',
  },
  {
    id: 9,
    name: 'Enku Gebya prodact 9',
    price: '$99.99',
    description: 'Fast and reliable 1TB portable solid-state drive. Ideal for quick data transfers and expanding storage for all your files.',
    imageUrl: 'https://placehold.co/600x400/FFA500/FFFFFF?text=Enku Gebeya photo 9',
  },
  {
    id: 10,
    name: 'Enku Gebya prodact 10',
    price: '$299.99',
    description: 'Effortlessly clean your home with this smart robot vacuum. Features intelligent navigation, strong suction, and app control.',
    imageUrl: 'https://placehold.co/600x400/FFA500/FFFFFF?text=Enku Gebeya photo 10',
  },
];

// Reusable Button Component
const Button: React.FC<{ onClick: () => void; children: React.ReactNode; primary?: boolean; disabled?: boolean; }> = ({ onClick, children, primary = true, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`py-3 px-8 rounded-full shadow-lg transition-all duration-300 ease-in-out text-lg font-bold
      ${primary ? 'bg-[#FFA500] text-white hover:bg-orange-600 hover:shadow-xl transform hover:-translate-y-1' : 'bg-white text-[#FFA500] border border-[#FFA500] hover:bg-gray-50'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `}
  >
    {children}
  </button>
);

// Hero Section Component
const HeroSection: React.FC<{ product: Product; openProductModal: (product: Product) => void }> = ({ product, openProductModal }) => (
  <section className="relative bg-gradient-to-r from-[#FFA500] to-orange-400 text-white py-20 sm:py-24 lg:py-32 overflow-hidden">
    <div className="absolute top-0 left-0 w-48 h-48 bg-white bg-opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
    <div className="absolute bottom-0 right-0 w-64 h-64 bg-white bg-opacity-10 rounded-full translate-x-1/2 translate-y-1/2"></div>

    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
      <div className="text-center md:text-left md:w-1/2">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg">
          {product.name}
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl mb-6 opacity-90 drop-shadow-md">
          {product.description.substring(0, 150)}...
        </p>
        <p className="text-3xl sm:text-4xl font-bold mb-8 drop-shadow-lg">
          
        </p>
        <Button onClick={() => openProductModal(product)} primary={false}>
          Learn More
        </Button>
      </div>
      <div className="md:w-1/2 flex justify-center md:justify-end">
        <div className="relative w-full max-w-md h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  </section>
);

// Product Card Component
const ProductCard: React.FC<{ product: Product; openProductModal: (product: Product) => void }> = ({ product, openProductModal }) => (
  <div key={product.id} className="bg-gray-50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
    <div className="w-full h-48 overflow-hidden rounded-t-2xl bg-opacity-0">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="p-6">
      <h3 className="text-2xl font-semibold mb-2 text-gray-900">{product.name}</h3>
      <p className="text-gray-600 mb-6 line-clamp-3">{product.description}</p>
      <Button onClick={() => openProductModal(product)}>
        Learn More
      </Button>
    </div>
  </div>
);

// Product Detail Modal Component
const ProductDetailModal: React.FC<{ product: Product; onClose: () => void }> = ({ product, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 animate-fade-in">
    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 relative animate-scale-in flex flex-col md:flex-row gap-8">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors duration-200"
        aria-label="Close product details"
      >
        <XCircle size={32} />
      </button>

      <div className="w-full md:w-1/2 flex-shrink-0">
        <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden border-4 border-[#FFA500] shadow-lg">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-between">
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h3>
          
          <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
        </div>
      </div>
    </div>
  </div>
);

// Main Product Page Component
export default function ProductPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage: number = 6;

  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const openProductModal = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  const closeProductModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const paginate = useCallback((pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  }, [totalPages]);

  const featuredProduct = ALL_PRODUCTS.length > 0 ? ALL_PRODUCTS[0] : null;

  return (
     <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', color: '#374151', fontFamily: 'sans-serif', paddingTop: '4rem' }}>
          <Navbar />
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      {/* Hero Section */}
      {featuredProduct && (
        <HeroSection product={featuredProduct} openProductModal={openProductModal} />
      )}

      {/* Products Grid Section */}
      <section className="py-16 sm:py-24 px-6 bg-white">
        <h2 className="text-4xl font-bold text-center mb-10 text-gray-900">Our Products</h2>

        {/* Search Input */}
        <div className="max-w-xl mx-auto mb-12">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-4 border border-gray-300 rounded-full shadow-sm text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FFA500] transition-all duration-300"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Product Cards */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} openProductModal={openProductModal} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 text-xl py-10">
              No products found matching your search.
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-16">
            <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`w-10 h-10 rounded-full font-bold transition-colors duration-300 ${
                  currentPage === i + 1 ? 'bg-[#FFA500] text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <Button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        )}
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal product={selectedProduct} onClose={closeProductModal} />
      )}

      {/* Tailwind CSS Custom Animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
    </div>
  );
}
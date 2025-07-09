'use client'; // This directive marks the component as a Client Component

import { Wallet, ArrowUpRight, ArrowDownLeft, PiggyBank } from "lucide-react";
import Navbar from "../components/Navbar"; // Assuming this path is correct
import FinanceReport from "../component/finance-report"; // Assuming this path is correct
import React from 'react'; // Explicitly import React if using JSX

export default function FinanceHomePage() {
  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Added a div with mt-16 to push the content down from the fixed Navbar */}
      <div className="mt-16">
        <FinanceReport />
      </div>

      {/* Page Header (if you still want it, it was in your original code, but removed in the snippet you provided for fixing) */}
      {/* If you want this back, uncomment and adjust its position relative to Navbar and FinanceReport */}
      {/*
      <div className="bg-white rounded-2xl shadow-md p-8 mb-8 text-center mt-4">
        <div className="flex justify-center items-center mb-4">
          <Wallet className="w-10 h-10 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Your Finance Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Monitor your money, track expenses, and stay financially healthy.
        </p>
      </div>
      */}
    </div>
  );
}

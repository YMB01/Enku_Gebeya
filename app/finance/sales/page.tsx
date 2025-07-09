// app/income/page.tsx or whatever your IncomeFormPage is named
'use client';
import Navbar from '@/app/components/Navbar';     // Assuming this is correct path
import SaleForm from '@/app/component/Sales ';
import React from 'react';

const SaleFormPage: React.FC = () => {
  return (
    <>
      <Navbar />
      {/* Added a div with mt-16 to push the content down from the fixed Navbar */}
      <div className="mt-16">
        <SaleForm />
      </div>
    </>
  );
};

export default SaleFormPage;
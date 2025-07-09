// app/income/page.tsx or whatever your IncomeFormPage is named
'use client';
import IncomeForm from '@/app/component/Incomes'; // Assuming this is correct path
import Navbar from '@/app/components/Navbar';     // Assuming this is correct path
import React from 'react';

const IncomeFormPage: React.FC = () => {
  return (
    <>
      <Navbar />
      {/* Added a div with mt-16 to push the content down from the fixed Navbar */}
      <div className="mt-16">
        <IncomeForm />
      </div>
    </>
  );
};

export default IncomeFormPage;
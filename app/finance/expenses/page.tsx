// app/income/page.tsx or whatever your IncomeFormPage is named
'use client';
import ExpenseForm from '@/app/component/Expenses';
import Navbar from '@/app/components/Navbar';     
import React from 'react';

const ExpenseFormPage: React.FC = () => {
  return (
    <>
      <Navbar />
      {/* Added a div with mt-16 to push the content down from the fixed Navbar */}
      <div className="mt-16">
        <ExpenseForm />
      </div>
    </>
  );
};

export default ExpenseFormPage;
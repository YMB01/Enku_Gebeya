import FinanceReport from '@/app/component/finance-report';
import Navbar from '@/app/components/Navbar';
import React from 'react';


const FinanceReporttPage: React.FC = () => {
  return  (
    <>
  <Navbar />
        {/* Added a div with mt-16 to push the content down from the fixed Navbar */}
        <div className="mt-16">
          <FinanceReport />
        </div>
        </>
  )
};

export default FinanceReporttPage;

import { ArrowDown, ArrowUp, Wallet } from "lucide-react";

export default function FinancePage() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Finance Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-2xl p-4">
          <div className="flex items-center space-x-4">
            <Wallet className="text-blue-500 w-8 h-8" />
            <div>
              <p className="text-gray-500 text-sm">Total Balance</p>
              <p className="text-xl font-semibold text-gray-800">$12,450.00</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-4">
          <div className="flex items-center space-x-4">
            <ArrowDown className="text-green-500 w-8 h-8" />
            <div>
              <p className="text-gray-500 text-sm">Income</p>
              <p className="text-xl font-semibold text-gray-800">$3,200.00</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-4">
          <div className="flex items-center space-x-4">
            <ArrowUp className="text-red-500 w-8 h-8" />
            <div>
              <p className="text-gray-500 text-sm">Expenses</p>
              <p className="text-xl font-semibold text-gray-800">$1,850.00</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Description</th>
                <th className="py-2 px-4">Category</th>
                <th className="py-2 px-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 px-4">2025-05-15</td>
                <td className="py-2 px-4">Grocery Shopping</td>
                <td className="py-2 px-4">Food</td>
                <td className="py-2 px-4 text-red-500">- $85.00</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4">2025-05-14</td>
                <td className="py-2 px-4">Freelance Payment</td>
                <td className="py-2 px-4">Income</td>
                <td className="py-2 px-4 text-green-500">+ $1,200.00</td>
              </tr>
              <tr>
                <td className="py-2 px-4">2025-05-13</td>
                <td className="py-2 px-4">Electricity Bill</td>
                <td className="py-2 px-4">Utilities</td>
                <td className="py-2 px-4 text-red-500">- $150.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

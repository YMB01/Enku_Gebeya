import Sidebar from "../Sidebar";

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar: fixed height */}
      <Sidebar />

      {/* Main content: fills remaining space and scrolls if too tall */}
      <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
        {children}
      </main>
    </div>
  );
}

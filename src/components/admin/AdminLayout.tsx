import { useState } from 'react';
import { Sidebar, type AdminTab } from './Sidebar';
import { DashboardContent } from './DashboardContent';

export const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('manada');

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans antialiased text-slate-900">
      {/* Sidebar - Fixed Position */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content - Pushed by Sidebar width */}
      {/* Default padding to 20 (w-20 is 80px) to match collapsed state. Margin left is applied relative to sidebar state if needed, or we just rely on padding to clear it. For a fixed sidebar, adding a left margin is standard. */}
      <main className="flex-1 ml-20 transition-all duration-300 min-h-screen relative z-0">
        <DashboardContent activeTab={activeTab} />
      </main>
    </div>
  );
};

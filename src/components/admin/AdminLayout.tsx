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
      <main className="flex-1 ml-64 min-h-screen relative z-0">
        <DashboardContent activeTab={activeTab} />
      </main>
    </div>
  );
};

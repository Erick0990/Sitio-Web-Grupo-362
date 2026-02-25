import type { AdminTab } from './Sidebar';
import { SectionTab } from './section/SectionTab';
import { JuntaTab } from './junta/JuntaTab';
import { AnnouncementsTab } from './AnnouncementsTab';
import { ActivitiesTab } from './ActivitiesTab';

export const DashboardContent = ({ activeTab }: { activeTab: AdminTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'manada':
        return <SectionTab section="manada" />;
      case 'tropa':
        return <SectionTab section="tropa" />;
      case 'junta':
        return <JuntaTab />;
      case 'avisos':
        return <AnnouncementsTab />;
      case 'actividades':
        return <ActivitiesTab />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full bg-slate-50 min-h-screen">
      {renderContent()}
    </div>
  );
};

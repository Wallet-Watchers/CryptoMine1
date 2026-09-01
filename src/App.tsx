import React from 'react';
import { InvestigationProvider, useInvestigation } from './context/InvestigationContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { NotificationToastContainer } from './components/common/NotificationToast';

import { Login } from './pages/Login';
import { Overview } from './pages/Overview';
import { Cases } from './pages/Cases';
import { CaseDetail } from './pages/CaseDetail';
import { CreateCase } from './pages/CreateCase';
import { ComplaintAnalysis } from './pages/ComplaintAnalysis';
import { FundFlowGraph } from './pages/FundFlowGraph';
import { Monitoring } from './pages/Monitoring';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { AdminDatabase } from './pages/AdminDatabase';

const AppContent: React.FC = () => {
  const { isAuthenticated, activePage, currentRole } = useInvestigation();

  if (!isAuthenticated) {
    return <Login />;
  }

  const isAdmin = currentRole === 'Supervisor';

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Overview />;
      case 'cases':
        return <Cases />;
      case 'case-detail':
        return <CaseDetail />;
      case 'create-case':
        return <CreateCase />;
      case 'complaint-analysis':
        return <ComplaintAnalysis />;
      case 'network':
        return <FundFlowGraph />;
      case 'monitoring':
        return <Monitoring />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      case 'admin':
        return isAdmin ? <AdminDatabase /> : <Overview />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f5f3ee]">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {renderActivePage()}
          </div>
        </main>
      </div>

      {/* Toast Notifications */}
      <NotificationToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <InvestigationProvider>
      <AppContent />
    </InvestigationProvider>
  );
}

import React, { createContext, useContext, useState } from 'react';
import { 
  ActivePage, 
  CaseTab,
  CaseItem, 
  WalletEntity, 
  TransactionItem, 
  CampaignItem, 
  VASPEntity, 
  AlertItem 
} from '../types';
import { 
  MOCK_CASES, 
  MOCK_WALLETS, 
  MOCK_TRANSACTIONS, 
  MOCK_CAMPAIGN, 
  MOCK_VASP, 
  MOCK_ALERTS, 
  MOCK_MONITORED_NODES 
} from '../data/mockData';

export interface ToastInfo {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'alert';
}

interface InvestigationContextType {
  isAuthenticated: boolean;
  login: (id: string, pass: string) => boolean;
  logout: () => void;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  activeCaseTab: CaseTab;
  setActiveCaseTab: (tab: CaseTab) => void;
  navigateTo: (page: ActivePage, params?: { caseId?: string; tab?: CaseTab; wallet?: string; alertId?: string }) => void;
  
  selectedCaseId: string;
  setSelectedCaseId: (id: string) => void;
  selectedCase: CaseItem;
  
  selectedWalletAddress: string;
  setSelectedWalletAddress: (address: string) => void;
  selectedWallet: WalletEntity;
  
  selectedAlertId: string | null;
  setSelectedAlertId: (id: string | null) => void;
  
  cases: CaseItem[];
  wallets: Record<string, WalletEntity>;
  transactions: TransactionItem[];
  campaign: CampaignItem;
  vasp: VASPEntity;
  selectedCampaign?: CampaignItem;
  selectedVasp?: VASPEntity;
  caseTransactions: TransactionItem[];
  caseAlerts: AlertItem[];
  caseWallets: WalletEntity[];
  alerts: AlertItem[];
  monitoredNodes: typeof MOCK_MONITORED_NODES;
  
  isMonitoringActive: boolean;
  toggleMonitoring: () => void;
  
  toasts: ToastInfo[];
  showToast: (title: string, message: string, type?: ToastInfo['type']) => void;
  removeToast: (id: string) => void;
  
  addNewCase: (newCase: CaseItem) => void;
  markAlertRead: (id: string) => void;
}

const InvestigationContext = createContext<InvestigationContextType | undefined>(undefined);
const CREATED_CASES_STORAGE_KEY = 'cryptomine.createdCases';

const loadCreatedCases = (): CaseItem[] => {
  if (typeof window === 'undefined') return [];

  try {
    const storedCases = JSON.parse(window.localStorage.getItem(CREATED_CASES_STORAGE_KEY) || '[]');
    if (!Array.isArray(storedCases)) return [];

    const mockCaseIds = new Set(MOCK_CASES.map(caseItem => caseItem.id));
    const seenCaseIds = new Set<string>();

    return storedCases.filter((caseItem): caseItem is CaseItem => {
      if (!caseItem || typeof caseItem.id !== 'string' || !caseItem.title || mockCaseIds.has(caseItem.id) || seenCaseIds.has(caseItem.id)) {
        return false;
      }
      seenCaseIds.add(caseItem.id);
      return true;
    });
  } catch {
    return [];
  }
};

export const InvestigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [activeCaseTab, setActiveCaseTab] = useState<CaseTab>('overview');
  
  const [selectedCaseId, setSelectedCaseId] = useState<string>('CM-2026-0017');
  const [selectedWalletAddress, setSelectedWalletAddress] = useState<string>('TX9f81ka94jLp27Kp2');
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  
  const [cases, setCases] = useState<CaseItem[]>(() => [...loadCreatedCases(), ...MOCK_CASES]);
  const [wallets, setWallets] = useState<Record<string, WalletEntity>>(MOCK_WALLETS);
  const [transactions] = useState<TransactionItem[]>(MOCK_TRANSACTIONS);
  const [campaign] = useState<CampaignItem>(MOCK_CAMPAIGN);
  const [vasp] = useState<VASPEntity>(MOCK_VASP);
  const [alerts, setAlerts] = useState<AlertItem[]>(MOCK_ALERTS);
  const [monitoredNodes] = useState(MOCK_MONITORED_NODES);
  
  const [isMonitoringActive, setIsMonitoringActive] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const showToast = (title: string, message: string, type: ToastInfo['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const login = (_id: string, _pass: string) => {
    setIsAuthenticated(true);
    setActivePage('dashboard');
    setActiveCaseTab('overview');
    setSelectedAlertId(null);
    showToast('Session Authenticated', 'Active Session: A. Mehta (Cyber Fraud Unit)', 'success');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActivePage('dashboard');
    setActiveCaseTab('overview');
    setSelectedCaseId('CM-2026-0017');
    setSelectedWalletAddress('TX9f81ka94jLp27Kp2');
    setSelectedAlertId(null);
    showToast('Session Ended', 'Logged out of investigation desk.', 'info');
  };

  const navigateTo = (page: ActivePage, params?: { caseId?: string; tab?: CaseTab; wallet?: string; alertId?: string }) => {
    if (params?.caseId) setSelectedCaseId(params.caseId);
    if (params?.tab) setActiveCaseTab(params.tab);
    if (params?.wallet) setSelectedWalletAddress(params.wallet);
    if (params?.alertId !== undefined) setSelectedAlertId(params.alertId);
    
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedCase = cases.find(c => c.id === selectedCaseId) || cases[0];
  const selectedWallet = wallets[selectedWalletAddress] || wallets['TX9f81ka94jLp27Kp2'] || Object.values(wallets)[0];
  const selectedCampaign = selectedCase.campaignId === campaign.id ? campaign : undefined;
  const selectedVasp = selectedCase.vaspClusterId === vasp.clusterId ? vasp : undefined;
  const caseTransactions = transactions.filter(transaction => transaction.caseId === selectedCase.id);
  const caseAlerts = alerts.filter(alert => alert.caseId === selectedCase.id);
  const caseWallets = Object.values(wallets).filter(wallet => wallet.associatedCases.includes(selectedCase.id));

  const toggleMonitoring = () => {
    setIsMonitoringActive(prev => !prev);
    if (isMonitoringActive) {
      showToast('Monitoring Suspended', 'Surveillance polling paused.', 'warning');
    } else {
      showToast('Monitoring Resumed', 'Surveillance active across scope addresses.', 'success');
    }
  };

  const addNewCase = (newCase: CaseItem) => {
    const nextCaseNumber = Math.max(
      ...cases.map(caseItem => Number(caseItem.id.split('-').pop()) || 0)
    ) + 1;
    const createdCase = {
      ...newCase,
      id: `CM-2026-${String(nextCaseNumber).padStart(4, '0')}`
    };
    const persistedCases = [
      createdCase,
      ...loadCreatedCases().filter(caseItem => caseItem.id !== createdCase.id)
    ];
    window.localStorage.setItem(CREATED_CASES_STORAGE_KEY, JSON.stringify(persistedCases));
    setCases(prev => [createdCase, ...prev]);
    setSelectedCaseId(createdCase.id);
    setActiveCaseTab('overview');
    setActivePage('case-detail');
    showToast('Investigation Initialized', `Case ${createdCase.id} created and evidence indexed.`, 'success');
  };

  const markAlertRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true, status: 'Reviewed' } : a));
  };

  return (
    <InvestigationContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        activePage,
        setActivePage,
        activeCaseTab,
        setActiveCaseTab,
        navigateTo,
        selectedCaseId,
        setSelectedCaseId,
        selectedCase,
        selectedWalletAddress,
        setSelectedWalletAddress,
        selectedWallet,
        selectedAlertId,
        setSelectedAlertId,
        cases,
        wallets,
        transactions,
        campaign,
        vasp,
        selectedCampaign,
        selectedVasp,
        caseTransactions,
        caseAlerts,
        caseWallets,
        alerts,
        monitoredNodes,
        isMonitoringActive,
        toggleMonitoring,
        toasts,
        showToast,
        removeToast,
        addNewCase,
        markAlertRead
      }}
    >
      {children}
    </InvestigationContext.Provider>
  );
};

export const useInvestigation = () => {
  const context = useContext(InvestigationContext);
  if (!context) {
    throw new Error('useInvestigation must be used within an InvestigationProvider');
  }
  return context;
};

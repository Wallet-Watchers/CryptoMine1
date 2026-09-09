export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';

export type EvidenceClassification = 'FACT' | 'OBSERVATION' | 'DERIVED' | 'INFERENCE' | 'POSSIBLE';

export type BlockchainType = 'TRON' | 'Ethereum' | 'Bitcoin';

export type FraudType = 
  | 'Investment Scam'
  | 'Task-Based Fraud'
  | 'Phishing'
  | 'Romance Scam'
  | 'Pig Butchering'
  | 'Other';

export type CaseStatus = 
  | 'Under Investigation'
  | 'Monitoring'
  | 'Flagged'
  | 'Reviewed'
  | 'Escalated'
  | 'Closed';

export type CaseTab = 
  | 'overview'
  | 'fund-flow'
  | 'connections'
  | 'vasp'
  | 'monitoring'
  | 'report';

export interface EvidenceSignalItem {
  id: string;
  title: string;
  description: string;
  classification: EvidenceClassification;
  confidence?: number;
  source?: string;
  timestamp?: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  time?: string;
  title: string;
  description: string;
  classification: EvidenceClassification;
  actor?: string;
  hashOrAddress?: string;
}

export interface RiskContributor {
  factor: string;
  points: number;
  category: string;
  evidence: string;
  severity: RiskLevel;
}

export interface BehaviouralIndicator {
  id: string;
  name: string;
  description: string;
  severity: RiskLevel;
  observedMetric: string;
  baselineMetric?: string;
}

export interface WalletEntity {
  address: string;
  shortAddress: string;
  label?: string;
  role: 'Victim / Source' | 'Primary Suspect' | 'Intermediary A' | 'Intermediary B' | 'Intermediary C' | 'Collector / Destination' | 'Counterparty' | 'Unclassified';
  blockchain: BlockchainType;
  riskScore: number;
  riskLevel: RiskLevel;
  receivedAmount: string;
  sentAmount: string;
  transactionCount: number;
  uniqueCounterparties: number;
  intermediaryCount?: number;
  firstSeen: string;
  lastActivity: string;
  isMonitored?: boolean;
  associatedCases: string[];
  indicators: BehaviouralIndicator[];
  riskContributors: RiskContributor[];
  evidenceSignals: EvidenceSignalItem[];
}

export interface TransactionItem {
  hash: string;
  shortHash: string;
  timestamp: string;
  fromAddress: string;
  fromLabel?: string;
  toAddress: string;
  toLabel?: string;
  amount: string;
  asset: string;
  blockchain: BlockchainType;
  riskLevel: RiskLevel;
  status: 'Flagged' | 'Observed' | 'Reviewed' | 'Cleared';
  caseId: string;
  layerHop?: number;
  notes?: string;
  gasFee?: string;
  evidenceClassification: EvidenceClassification;
}

export interface CaseItem {
  id: string;
  title: string;
  fraudType: FraudType;
  riskLevel: RiskLevel;
  riskScore: number;
  blockchain: BlockchainType;
  asset: string;
  reportedAmount: string;
  sentAmount: string;
  tracedAmount: string;
  retainedAmount: string;
  primaryWallet: string;
  status: CaseStatus;
  reportStatus?: ReportStatus;
  leadInvestigator: string;
  unit: string;
  createdAt: string;
  updatedAt: string;
  complaintText: string;
  contactMethod: string;
  campaignId?: string;
  vaspClusterId?: string;
  walletsIdentified: number;
  transactionsCount: number;
  intermediaryCount: number;
  connectedCasesCount: number;
  timeline: TimelineEvent[];
  evidenceSignals: EvidenceSignalItem[];
  riskContributors: RiskContributor[];
}

export interface CampaignItem {
  id: string;
  name: string;
  confidence: number;
  status: string;
  fraudType: FraudType;
  primaryInfrastructure: string;
  connectedCases: string[];
  totalReportedLoss: string;
  totalTracedFunds: string;
  firstObserved: string;
  lastActive: string;
  connectionReasons: {
    title: string;
    description: string;
    classification: EvidenceClassification;
  }[];
}

export interface VASPEntity {
  id: string;
  name: string;
  type: string;
  blockchain: BlockchainType;
  clusterId: string;
  riskLevel: RiskLevel;
  confidence: number;
  status: string;
  evidence: string;
  knownAddresses: string[];
  candidateAddresses: string[];
  depositPatterns: string;
  relatedCases: string[];
  relatedWallets: string[];
  jurisdiction: string;
  complianceContactAvailable: boolean;
  attributionSignals: {
    title: string;
    classification: EvidenceClassification;
    description: string;
  }[];
}

export interface AlertItem {
  id: string;
  priority: RiskLevel;
  timestamp: string;
  title: string;
  description: string;
  subject: string;
  subjectType: 'wallet' | 'case' | 'tx';
  caseId?: string;
  whatHappened: string;
  whyItMatters: string;
  evidenceClassification: EvidenceClassification;
  recommendedAction: string;
  isRead: boolean;
  status: 'Open' | 'Reviewed';
}

export interface ExtractedComplaintIntelligence {
  fraudType: FraudType;
  contactMethod: string;
  amount: string;
  asset: string;
  blockchain: BlockchainType;
  suspectWallet: string;
  txHash?: string;
  confidence: number;
  extractedEntities: {
    entity: string;
    value: string;
    confidence: number;
    category: 'FACT' | 'DERIVED' | 'EXTRACTED';
  }[];
}

export type ActivePage = 
  | 'dashboard'
  | 'cases'
  | 'case-detail'
  | 'create-case'
  | 'complaint-analysis'
  | 'network'
  | 'monitoring'
  | 'reports'
  | 'settings'
  | 'admin';

export type UserRole = 'Investigator' | 'Admin' | 'User';

export type ReportStatus = 'Draft' | 'Finalized' | 'Submitted';

export interface VASPDatabaseEntry {
  id: string;
  name: string;
  type: string;
  blockchain: BlockchainType;
  knownWalletCluster: string;
  evidenceSource: string;
  lastVerified: string;
  confidence: number;
}

export interface KnownRiskAddress {
  id: string;
  wallet: string;
  shortAddress: string;
  riskCategory: string;
  source: string;
  dateAdded: string;
  reason: string;
}

export interface ExtractedField {
  key: string;
  label: string;
  value: string;
  verified: boolean;
}

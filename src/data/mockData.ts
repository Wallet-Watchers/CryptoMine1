import {
  CaseItem, 
  WalletEntity, 
  TransactionItem, 
  CampaignItem, 
  CrossPlatformCorrelation,
  ExchangeAccountTrace,
  VASPEntity, 
  AlertItem,
  UserRole,
  ExtractedField,
  VASPDatabaseEntry,
  KnownRiskAddress
} from '../types';

export const CURRENT_INVESTIGATOR = {
  name: "A. Mehta",
  badgeId: "A.MEHTA",
  unit: "Cyber Fraud Unit",
  rank: "Lead Financial Crimes Investigator",
  accessLevel: "Investigator / Read-Write",
  role: "Investigator" as UserRole,
  sessionStarted: "2026-08-27T09:00:00Z"
};

export const ROLE_DEFINITIONS: { role: UserRole; description: string; permissions: string[] }[] = [
  {
    role: 'User',
    description: 'Read-Only — review cases, graphs, and reports without making changes.',
    permissions: ['View cases', 'View fund flow & network', 'View reports', 'Read-only evidence']
  },
  {
    role: 'Investigator',
    description: 'Read-Write — full investigation workflow on assigned cases.',
    permissions: ['Create cases', 'Edit evidence', 'Run tracing', 'Manage monitoring', 'Draft reports']
  },
  {
    role: 'Admin',
    description: 'Admin — reassign cases across investigators, review and finalize reports, access intelligence database.',
    permissions: ['All Investigator permissions', 'Reassign cases', 'Approve / finalize reports', 'Admin intelligence database']
  }
];

export const MOCK_COMPLAINT = {
  id: 'CMP-FILE-2026-0421',
  dateFiled: '25 Aug 2026',
  source: 'Uploaded file · complaint_0421.pdf',
  text: "I invested 50,000 USDT with a group on Telegram called @GoldenAlphaYield after they promised guaranteed monthly returns of 15%. The administrator 'Alex' directed me to transfer USDT on the TRON network to wallet TX9f81ka94jLp27Kp2. After I made my first deposit on 24 August they showed fake profit screenshots and asked me to deposit more. When I tried to withdraw my principal they blocked me. All communication was through the Telegram channel and private DMs from the account @alex_ga. The fraudulent website they referenced was goldenyield-invest.com."
};

export const MOCK_EXTRACTED_FIELDS: ExtractedField[] = [
  { key: 'fraudType', label: 'Fraud Type', value: 'Investment Scam', verified: true },
  { key: 'amount', label: 'Amount', value: '50,000 USDT', verified: false },
  { key: 'contactMethod', label: 'Contact Method', value: 'Telegram (@GoldenAlphaYield / @alex_ga)', verified: true },
  { key: 'website', label: 'Website / Platform', value: 'goldenyield-invest.com', verified: false },
  { key: 'walletAddress', label: 'Wallet Address', value: 'TX9f81ka94jLp27Kp2', verified: false },
  { key: 'date', label: 'Date', value: '24 Aug 2026', verified: false }
];

export const MOCK_VASP_DATABASE: VASPDatabaseEntry[] = [
  { id: 'V-018', name: 'Binance', type: 'Centralized Exchange', blockchain: 'TRON', knownWalletCluster: 'TND2uCqGfN4rW6Vv8YmYh99a...', evidenceSource: 'Verified LEIR responses + on-chain cluster', lastVerified: '26 Aug 2026', confidence: 91 },
  { id: 'V-021', name: 'KuCoin', type: 'Centralized Exchange', blockchain: 'TRON', knownWalletCluster: 'TKo8Qn...', evidenceSource: 'Open-source cluster research', lastVerified: '12 Aug 2026', confidence: 78 },
  { id: 'V-034', name: 'OKX', type: 'Centralized Exchange', blockchain: 'Ethereum', knownWalletCluster: '0x6cc5...', evidenceSource: 'Exchange disclosure (cold)', lastVerified: '02 Aug 2026', confidence: 84 },
  { id: 'V-041', name: 'Bybit', type: 'Centralized Exchange', blockchain: 'TRON', knownWalletCluster: 'TRkY9...', evidenceSource: 'OSINT + tagged feeds', lastVerified: '30 Jul 2026', confidence: 66 }
];

export const MOCK_KNOWN_RISK_ADDRESSES: KnownRiskAddress[] = [
  { id: 'KRA-001', wallet: 'TX9f81ka94jLp27Kp2', shortAddress: 'TX9f...7Kp2', riskCategory: 'High-Risk Fraud Suspect', source: 'Case CM-2026-0017', dateAdded: '25 Aug 2026', reason: 'Direct recipient of confirmed fraud proceeds; rapid layering behaviour.' },
  { id: 'KRA-002', wallet: 'TE5r9024lkj18Nz', shortAddress: 'TE5r...18Nz', riskCategory: 'Multi-Case Collector', source: 'Campaign CMP-004', dateAdded: '26 Aug 2026', reason: 'Shared consolidation node across 3 independent complaints.' },
  { id: 'KRA-003', wallet: '0x71Fa98319e0A91C', shortAddress: '0x71...91C', riskCategory: 'Known Drainer', source: 'Partner Intel Feed', dateAdded: '22 Aug 2026', reason: 'Observed in phishing drainer clusters across EVM chains.' },
  { id: 'KRA-004', wallet: 'TB7x3910amv29Lm', shortAddress: 'TB7x...29Lm', riskCategory: 'Layering Relay', source: 'Case CM-2026-0017', dateAdded: '25 Aug 2026', reason: 'Zero-balance transit node in fraud layering path.' }
];

export const MOCK_CASES: CaseItem[] = [
  {
    id: "CM-2026-0017",
    title: "Investment Scam — Suspect Wallet Analysis",
    fraudType: "Investment Scam",
    riskLevel: "HIGH",
    riskScore: 87,
    blockchain: "TRON",
    asset: "USDT",
    reportedAmount: "50,000 USDT",
    sentAmount: "47,200 USDT",
    tracedAmount: "43,700 USDT",
    retainedAmount: "2,800 USDT",
    primaryWallet: "TX9f81ka94jLp27Kp2",
    status: "Under Investigation",
    reportStatus: "Draft",
    leadInvestigator: "A. Mehta",
    unit: "Cyber Fraud Unit",
    createdAt: "25 Aug 2026, 10:15",
    updatedAt: "26 Aug 2026, 14:32",
    complaintText: "The victim was contacted through Telegram and promised guaranteed investment returns. The victim transferred 50,000 USDT to the reported wallet address. The suspect then instructed the victim to make additional deposits.",
    contactMethod: "Telegram Channel (@GoldenAlphaYield)",
    campaignId: "CMP-004",
    vaspClusterId: "V-018",
    walletsIdentified: 18,
    transactionsCount: 42,
    intermediaryCount: 3,
    connectedCasesCount: 2,
    timeline: [
      {
        id: "T-01",
        date: "25 Aug 2026",
        time: "10:15",
        title: "Complaint received",
        description: "Official statement filed detailing 50,000 USDT transfer to suspect wallet.",
        classification: "FACT",
        actor: "Cybercrime Desk",
        hashOrAddress: "CM-2026-0017"
      },
      {
        id: "T-02",
        date: "25 Aug 2026",
        time: "11:20",
        title: "Suspect wallet identified",
        description: "Wallet TX9f...7Kp2 confirmed on TRON network as direct recipient.",
        classification: "FACT",
        actor: "A. Mehta",
        hashOrAddress: "TX9f81ka94jLp27Kp2"
      },
      {
        id: "T-03",
        date: "25 Aug 2026",
        time: "14:45",
        title: "Transactions analyzed",
        description: "42 ledger transactions analyzed across 14-day window.",
        classification: "OBSERVATION",
        actor: "Forensic Analyzer"
      },
      {
        id: "T-04",
        date: "25 Aug 2026",
        time: "16:30",
        title: "Intermediary wallets detected",
        description: "Three transit hops (TB7x...29Lm, TC8m...81Qa, TE5r...18Nz) identified in fund dispersal.",
        classification: "OBSERVATION",
        actor: "Layering Detection Engine"
      },
      {
        id: "T-05",
        date: "26 Aug 2026",
        time: "09:15",
        title: "Connected fraud pattern identified",
        description: "Shared collector TE5r...18Nz matches active infrastructure in cases CM-2026-0014 and CM-2026-0009.",
        classification: "DERIVED",
        actor: "Correlation Engine",
        hashOrAddress: "TE5r9024lkj18Nz"
      },
      {
        id: "T-06",
        date: "26 Aug 2026",
        time: "14:32",
        title: "Possible VASP attribution",
        description: "Downstream batching aligns with Binance deposit cluster V-018 (89% confidence).",
        classification: "POSSIBLE",
        actor: "VASP Matcher",
        hashOrAddress: "V-018"
      },
      {
        id: "T-07",
        date: "26 Aug 2026",
        time: "15:00",
        title: "Monitoring enabled",
        description: "Continuous telemetry tracking active across suspect and intermediary nodes.",
        classification: "OBSERVATION",
        actor: "Monitoring Desk"
      }
    ],
    evidenceSignals: [
      {
        id: "SIG-01",
        title: "Rapid fund movement observed",
        description: "Outbound transfer of 12,400 USDT executed within 8 minutes of deposit.",
        classification: "FACT",
        source: "TRON Ledger",
        timestamp: "26 Aug 2026, 14:31"
      },
      {
        id: "SIG-02",
        title: "Funds moved through three intermediaries",
        description: "Sequential hopping through TB7x...29Lm, TC8m...81Qa, and TE5r...18Nz.",
        classification: "OBSERVATION",
        source: "Fund Flow Graph"
      },
      {
        id: "SIG-03",
        title: "Layered routing consistent with money laundering",
        description: "Tranches split and reconsolidated to obscure origin trail.",
        classification: "INFERENCE",
        confidence: 87
      },
      {
        id: "SIG-04",
        title: "Possible VASP attribution: Binance (V-018)",
        description: "Probabilistic match based on address clustering and sweep intervals.",
        classification: "POSSIBLE",
        confidence: 89
      }
    ],
    riskContributors: [
      {
        factor: "Rapid fund movement",
        points: 20,
        category: "Velocity",
        evidence: "Outbound tranche of 12,400 USDT moved onward within 8 minutes of the 50,000 USDT deposit.",
        severity: "HIGH"
      },
      {
        factor: "Multiple wallet splitting",
        points: 18,
        category: "Layering",
        evidence: "Incoming funds split across multiple downstream addresses before relay.",
        severity: "HIGH"
      },
      {
        factor: "High-risk connections",
        points: 25,
        category: "Network",
        evidence: "Direct interaction with a fraud-flagged counterparty cluster (shared collector TE5r...18Nz).",
        severity: "HIGH"
      },
      {
        factor: "Repeated consolidation",
        points: 14,
        category: "Dispersal",
        evidence: "Split tranches re-merged into a single collector wallet across repeated hops.",
        severity: "MEDIUM"
      },
      {
        factor: "Known suspicious cluster",
        points: 10,
        category: "Correlation",
        evidence: "Address overlaps a flagged cluster recorded in the intelligence database.",
        severity: "MEDIUM"
      }
    ]
  },
  {
    id: "CM-2026-0014",
    title: "Task Scam — Shared Collector Review",
    fraudType: "Task-Based Fraud",
    riskLevel: "HIGH",
    riskScore: 82,
    blockchain: "TRON",
    asset: "USDT",
    reportedAmount: "31,800 USDT",
    sentAmount: "31,800 USDT",
    tracedAmount: "28,500 USDT",
    retainedAmount: "3,300 USDT",
    primaryWallet: "TW6p3910bc5Hs4",
    status: "Under Investigation",
    reportStatus: "Finalized",
    leadInvestigator: "A. Mehta",
    unit: "Cyber Fraud Unit",
    createdAt: "23 Aug 2026, 16:40",
    updatedAt: "26 Aug 2026, 12:20",
    complaintText: "Victim promised commissions on simulated luxury product ratings. Sent 31,800 USDT before account was locked.",
    contactMethod: "Telegram Bot",
    campaignId: "CMP-004",
    vaspClusterId: "V-018",
    walletsIdentified: 12,
    transactionsCount: 34,
    intermediaryCount: 2,
    connectedCasesCount: 2,
    timeline: [],
    evidenceSignals: [],
    riskContributors: []
  },
  {
    id: "CM-2026-0009",
    title: "Investment Scam — Campaign Linkage",
    fraudType: "Investment Scam",
    riskLevel: "MEDIUM",
    riskScore: 68,
    blockchain: "TRON",
    asset: "USDT",
    reportedAmount: "22,600 USDT",
    sentAmount: "22,600 USDT",
    tracedAmount: "19,800 USDT",
    retainedAmount: "2,800 USDT",
    primaryWallet: "TV2k9102bc8Lm1",
    status: "Monitoring",
    reportStatus: "Submitted",
    leadInvestigator: "A. Mehta",
    unit: "Cyber Fraud Unit",
    createdAt: "19 Aug 2026, 09:45",
    updatedAt: "25 Aug 2026, 16:15",
    complaintText: "Victim lured into high-frequency forex arbitrage group. Deposited 22,600 USDT over 5 days.",
    contactMethod: "Instagram DM to Telegram",
    campaignId: "CMP-004",
    vaspClusterId: "V-018",
    walletsIdentified: 9,
    transactionsCount: 22,
    intermediaryCount: 1,
    connectedCasesCount: 2,
    timeline: [],
    evidenceSignals: [],
    riskContributors: []
  },
  {
    id: "CM-2026-0015",
    title: "Task Scam — Deposit Routing Review",
    fraudType: "Task-Based Fraud",
    riskLevel: "MEDIUM",
    riskScore: 64,
    blockchain: "TRON",
    asset: "USDT",
    reportedAmount: "18,400 USDT",
    sentAmount: "14,200 USDT",
    tracedAmount: "14,200 USDT",
    retainedAmount: "4,200 USDT",
    primaryWallet: "TY4m8291kj2Qa8",
    status: "Monitoring",
    reportStatus: "Finalized",
    leadInvestigator: "S. Rao",
    unit: "Cyber Fraud Unit",
    createdAt: "24 Aug 2026, 14:20",
    updatedAt: "26 Aug 2026, 10:11",
    complaintText: "Victim recruited via WhatsApp to complete rating tasks. Required to deposit 18,400 USDT to unlock funds.",
    contactMethod: "WhatsApp Group",
    walletsIdentified: 7,
    transactionsCount: 19,
    intermediaryCount: 1,
    connectedCasesCount: 0,
    timeline: [],
    evidenceSignals: [],
    riskContributors: []
  },
  {
    id: "CM-2026-0011",
    title: "Phishing — Recovery Wallet Trace",
    fraudType: "Phishing",
    riskLevel: "HIGH",
    riskScore: 79,
    blockchain: "Ethereum",
    asset: "ETH",
    reportedAmount: "12.8 ETH",
    sentAmount: "12.8 ETH",
    tracedAmount: "12.8 ETH",
    retainedAmount: "0.0 ETH",
    primaryWallet: "0x71Fa98319e0A91C",
    status: "Under Investigation",
    reportStatus: "Draft",
    leadInvestigator: "K. Sharma",
    unit: "Cyber Fraud Unit",
    createdAt: "22 Aug 2026, 11:30",
    updatedAt: "25 Aug 2026, 18:40",
    complaintText: "Victim clicked malicious link disguised as a decentralized finance airdrop. Unauthorized permit approval drained 12.8 ETH.",
    contactMethod: "Phishing Link",
    walletsIdentified: 6,
    transactionsCount: 14,
    intermediaryCount: 2,
    connectedCasesCount: 0,
    timeline: [],
    evidenceSignals: [],
    riskContributors: []
  },
  {
    id: "CM-2026-0019",
    title: "Task-Based Fraud — Pending On-Chain Analysis",
    fraudType: "Task-Based Fraud",
    riskLevel: "MEDIUM",
    riskScore: 0,
    blockchain: "TRON",
    asset: "USDT",
    reportedAmount: "68,000 USDT",
    sentAmount: "68,000 USDT",
    tracedAmount: "Pending analysis",
    retainedAmount: "Pending analysis",
    primaryWallet: "TT4w2910am7Qz2",
    status: "Under Investigation",
    reportStatus: "Draft",
    leadInvestigator: "A. Mehta",
    unit: "Cyber Fraud Unit",
    createdAt: "27 Aug 2026, 09:10",
    updatedAt: "27 Aug 2026, 09:10",
    complaintText: "Victim completed simulated product-rating tasks via a Telegram bot and was promised escalating commissions. Deposited 68,000 USDT over three days before withdrawal was blocked.",
    contactMethod: "Telegram Bot",
    walletsIdentified: 1,
    transactionsCount: 0,
    intermediaryCount: 0,
    connectedCasesCount: 0,
    timeline: [
      {
        id: "T-01",
        date: "27 Aug 2026",
        time: "09:10",
        title: "Complaint filed & analyzed",
        description: "Complaint intake recorded; on-chain evidence analysis is pending.",
        classification: "FACT"
      }
    ],
    evidenceSignals: [
      {
        id: "SIG-01",
        title: "Primary wallet submitted",
        description: "Wallet TT4w...7Qz2 submitted as direct recipient; no downstream path indexed yet.",
        classification: "OBSERVATION"
      }
    ],
    riskContributors: [
      { factor: "Initial complaint received", points: 0, category: "Intake", evidence: "Awaiting on-chain analysis.", severity: "LOW" }
    ]
  }
];

export const MOCK_WALLETS: Record<string, WalletEntity> = {
  "TT4w2910am7Qz2": {
    address: "TT4w2910am7Qz2",
    shortAddress: "TT4w...7Qz2",
    label: "Primary Suspect Wallet (Pending)",
    role: "Primary Suspect",
    blockchain: "TRON",
    riskScore: 0,
    riskLevel: "MEDIUM",
    receivedAmount: "68,000 USDT",
    sentAmount: "Pending analysis",
    transactionCount: 0,
    uniqueCounterparties: 0,
    firstSeen: "27 Aug 2026, 09:10",
    lastActivity: "Pending on-chain confirmation",
    associatedCases: ["CM-2026-0019"],
    indicators: [],
    riskContributors: [],
    evidenceSignals: [
      {
        id: "WSIG-01",
        title: "Reported recipient wallet",
        description: "Wallet submitted in complaint as direct receiving address.",
        classification: "OBSERVATION",
        source: "Complaint CM-2026-0019"
      }
    ]
  },
  "TX9f81ka94jLp27Kp2": {
    address: "TX9f81ka94jLp27Kp2",
    shortAddress: "TX9f...7Kp2",
    label: "Primary Suspect Wallet",
    role: "Primary Suspect",
    blockchain: "TRON",
    riskScore: 87,
    riskLevel: "HIGH",
    receivedAmount: "50,000 USDT",
    sentAmount: "47,200 USDT",
    transactionCount: 42,
    uniqueCounterparties: 18,
    intermediaryCount: 3,
    firstSeen: "25 Aug 2026, 08:30",
    lastActivity: "2 min ago",
    isMonitored: true,
    associatedCases: ["CM-2026-0017"],
    indicators: [
      {
        id: "IND-01",
        name: "Rapid fund movement",
        description: "Funds moved onward shortly after receipt (avg velocity: 8.4 mins).",
        severity: "HIGH",
        observedMetric: "8.4 min hold time",
        baselineMetric: "> 72 hours"
      },
      {
        id: "IND-02",
        name: "Multiple intermediary wallets",
        description: "Funds passed through three intermediary wallets connecting to the primary path.",
        severity: "HIGH",
        observedMetric: "3 distinct hops",
        baselineMetric: "0 - 1 hops"
      },
      {
        id: "IND-03",
        name: "High transaction frequency",
        description: "42 transactions observed during the active analysis window.",
        severity: "MEDIUM",
        observedMetric: "14 tx / day",
        baselineMetric: "< 1 tx / day"
      },
      {
        id: "IND-04",
        name: "Fund splitting",
        description: "Incoming funds divided across multiple downstream addresses.",
        severity: "MEDIUM",
        observedMetric: "4 outgoing splits",
        baselineMetric: "Direct transfer"
      }
    ],
    riskContributors: [
      {
        factor: "Rapid fund movement",
        points: 20,
        category: "Velocity",
        evidence: "Funds moved onward within minutes of receipt.",
        severity: "HIGH"
      },
      {
        factor: "Multiple wallet splitting",
        points: 18,
        category: "Layering",
        evidence: "Incoming funds split across multiple downstream addresses.",
        severity: "HIGH"
      },
      {
        factor: "High-risk connections",
        points: 25,
        category: "Network",
        evidence: "Interaction with a fraud-flagged counterparty cluster.",
        severity: "HIGH"
      },
      {
        factor: "Repeated consolidation",
        points: 14,
        category: "Dispersal",
        evidence: "Split tranches re-merged into a single collector wallet.",
        severity: "MEDIUM"
      },
      {
        factor: "Known suspicious cluster",
        points: 10,
        category: "Correlation",
        evidence: "Overlaps a flagged intelligence-database cluster.",
        severity: "MEDIUM"
      }
    ],
    evidenceSignals: [
      {
        id: "WSIG-01",
        title: "Victim Deposit 50,000 USDT Received",
        description: "Direct on-chain confirmation from victim funding wallet.",
        classification: "FACT",
        source: "TRON Block #6491028"
      },
      {
        id: "WSIG-02",
        title: "Dispersal to TB7x...29Lm",
        description: "12,400 USDT transferred in tx 0x7e4a...91cd.",
        classification: "FACT",
        source: "Tx 0x7e4a...91cd"
      }
    ]
  },
  "TB7x3910amv29Lm": {
    address: "TB7x3910amv29Lm",
    shortAddress: "TB7x...29Lm",
    label: "Intermediary A",
    role: "Intermediary A",
    blockchain: "TRON",
    riskScore: 81,
    riskLevel: "HIGH",
    receivedAmount: "12,400 USDT",
    sentAmount: "12,400 USDT",
    transactionCount: 8,
    uniqueCounterparties: 4,
    firstSeen: "25 Aug 2026, 12:10",
    lastActivity: "18 min ago",
    isMonitored: true,
    associatedCases: ["CM-2026-0017"],
    indicators: [
      {
        id: "IND-TB-1",
        name: "Zero-balance relay node",
        description: "Maintains zero steady-state balance; acts strictly as transit relay.",
        severity: "HIGH",
        observedMetric: "0.00 USDT balance"
      }
    ],
    riskContributors: [],
    evidenceSignals: []
  },
  "TC8m1982bcn81Qa": {
    address: "TC8m1982bcn81Qa",
    shortAddress: "TC8m...81Qa",
    label: "Intermediary B",
    role: "Intermediary B",
    blockchain: "TRON",
    riskScore: 74,
    riskLevel: "MEDIUM",
    receivedAmount: "24,100 USDT",
    sentAmount: "24,100 USDT",
    transactionCount: 16,
    uniqueCounterparties: 7,
    firstSeen: "24 Aug 2026, 18:00",
    lastActivity: "42 min ago",
    isMonitored: true,
    associatedCases: ["CM-2026-0017"],
    indicators: [
      {
        id: "IND-TC-1",
        name: "Aggregation & forwarding",
        description: "Aggregates smaller tranches and relays onward to collector.",
        severity: "MEDIUM",
        observedMetric: "2:1 aggregation"
      }
    ],
    riskContributors: [],
    evidenceSignals: []
  },
  "TE5r9024lkj18Nz": {
    address: "TE5r9024lkj18Nz",
    shortAddress: "TE5r...18Nz",
    label: "Intermediary C / Shared Collector",
    role: "Collector / Destination",
    blockchain: "TRON",
    riskScore: 76,
    riskLevel: "HIGH",
    receivedAmount: "148,500 USDT",
    sentAmount: "142,000 USDT",
    transactionCount: 94,
    uniqueCounterparties: 32,
    firstSeen: "12 Aug 2026",
    lastActivity: "1 hr ago",
    isMonitored: true,
    associatedCases: ["CM-2026-0017", "CM-2026-0014", "CM-2026-0009"],
    indicators: [
      {
        id: "IND-TE-1",
        name: "Multi-case collector nexus",
        description: "Receives deposits from 3 distinct fraud complaints.",
        severity: "HIGH",
        observedMetric: "3 connected cases"
      }
    ],
    riskContributors: [],
    evidenceSignals: []
  }
};

export const MOCK_TRANSACTIONS: TransactionItem[] = [
  {
    hash: "0x7e4a839fbc7189ad91cd",
    shortHash: "0x7e4a...91cd",
    timestamp: "26 Aug 2026, 14:31",
    fromAddress: "TX9f81ka94jLp27Kp2",
    fromLabel: "TX9f...7Kp2 (Suspect)",
    toAddress: "TB7x3910amv29Lm",
    toLabel: "TB7x...29Lm (Intermediary A)",
    amount: "12,400 USDT",
    asset: "USDT",
    blockchain: "TRON",
    riskLevel: "HIGH",
    status: "Flagged",
    caseId: "CM-2026-0017",
    layerHop: 1,
    notes: "Direct high-velocity outward transfer following victim deposit.",
    gasFee: "14.2 TRX",
    evidenceClassification: "FACT"
  },
  {
    hash: "0x3c19f8a0021bca7bf",
    shortHash: "0x3c19...a7bf",
    timestamp: "26 Aug 2026, 13:55",
    fromAddress: "TB7x3910amv29Lm",
    fromLabel: "TB7x...29Lm (Intermediary A)",
    toAddress: "TC8m1982bcn81Qa",
    toLabel: "TC8m...81Qa (Intermediary B)",
    amount: "8,200 USDT",
    asset: "USDT",
    blockchain: "TRON",
    riskLevel: "HIGH",
    status: "Observed",
    caseId: "CM-2026-0017",
    layerHop: 2,
    notes: "Transit hop splitting tranche.",
    gasFee: "12.8 TRX",
    evidenceClassification: "OBSERVATION"
  },
  {
    hash: "0x91abe49810afbe221",
    shortHash: "0x91ab...e221",
    timestamp: "26 Aug 2026, 12:44",
    fromAddress: "TC8m1982bcn81Qa",
    fromLabel: "TC8m...81Qa (Intermediary B)",
    toAddress: "TE5r9024lkj18Nz",
    toLabel: "TE5r...18Nz (Shared Collector)",
    amount: "15,900 USDT",
    asset: "USDT",
    blockchain: "TRON",
    riskLevel: "MEDIUM",
    status: "Reviewed",
    caseId: "CM-2026-0017",
    layerHop: 3,
    notes: "Consolidation transfer into shared collector node.",
    gasFee: "13.4 TRX",
    evidenceClassification: "DERIVED"
  }
];

export const MOCK_CAMPAIGN: CampaignItem = {
  id: "CMP-004",
  name: "Operation Golden Yield",
  confidence: 91,
  status: "Active Correlation",
  fraudType: "Investment Scam",
  primaryInfrastructure: "TE5r9024lkj18Nz",
  connectedCases: ["CM-2026-0017", "CM-2026-0014", "CM-2026-0009"],
  totalReportedLoss: "104,400 USDT",
  totalTracedFunds: "92,000 USDT",
  firstObserved: "12 Aug 2026",
  lastActive: "26 Aug 2026, 14:32",
  connectionReasons: [
    {
      title: "Shared wallet infrastructure",
      description: "The same intermediary collector wallet (TE5r...18Nz) appears across cases.",
      classification: "FACT"
    },
    {
      title: "Similar routing behaviour",
      description: "Funds follow an identical multi-hop transit schema before aggregation.",
      classification: "OBSERVATION"
    },
    {
      title: "Similar timing patterns",
      description: "Transactions occur within correlated time windows with rapid onward forwarding (< 30 min).",
      classification: "OBSERVATION"
    }
  ]
};

export const MOCK_CROSS_PLATFORM_CORRELATIONS: CrossPlatformCorrelation[] = [
  {
    id: 'XPC-001',
    platform: 'Telegram',
    platformHandle: '@GoldenAlphaYield',
    channelType: 'Telegram Group / Channel',
    evidenceSource: 'Complaint / Contact-vector records',
    relationship: 'Shared contact vector',
    linkedCaseIds: ['CM-2026-0017', 'CM-2026-0014'],
    connection: 'Same Telegram group/channel',
    description: 'Complaint and contact-vector records associate both investigations with the same Telegram group/channel.',
    classification: 'DERIVED'
  }
];

export const MOCK_VASP: VASPEntity = {
  id: "V-018",
  name: "Binance",
  type: "Exchange / VASP",
  blockchain: "TRON",
  clusterId: "V-018",
  riskLevel: "MEDIUM",
  confidence: 89,
  status: "Requires Independent Verification",
  evidence: "Destination cluster overlap, observed deposit patterns and entity intelligence.",
  knownAddresses: [
    "TND2uCqGfN4rW6Vv8YmYh99a... (Hot Wallet 14)",
    "TPYm92kLo81vCa7Nx21980... (Deposit Sweeper 03)"
  ],
  candidateAddresses: [
    "TD9x7a82mN94LmQ (Binance Deposit Address / Cluster V-018)"
  ],
  depositPatterns: "Batched sweep executed when threshold exceeds 10,000 USDT.",
  relatedCases: ["CM-2026-0017", "CM-2026-0014", "CM-2026-0009"],
  relatedWallets: ["TD9x7a82mN94LmQ", "TE5r9024lkj18Nz", "TC8m1982bcn81Qa"],
  jurisdiction: "International",
  complianceContactAvailable: true,
  attributionSignals: [
    {
      title: "Destination Cluster Overlap",
      classification: "OBSERVATION",
      description: "Candidate exchange deposit address matches known exchange deposit router schema."
    },
    {
      title: "Observed Routing Pattern",
      classification: "INFERENCE",
      description: "Sweep transactions match scheduled exchange batch intervals."
    },
    {
      title: "Known Address Intelligence",
      classification: "DERIVED",
      description: "Identified in verified cybercrime forensic feeds."
    }
  ]
};

export const MOCK_EXCHANGE_ACCOUNT_TRACES: ExchangeAccountTrace[] = [
  {
    id: 'EAT-001',
    caseId: 'CM-2026-0017',
    vaspClusterId: 'V-018',
    isSyntheticDemoData: true,
    onChain: {
      intermediaryWallet: 'TC8m1982bcn81Qa',
      exchangeDepositAddress: 'TD9x7a82mN94LmQ',
      transactionHash: '0x5dce728fa61b7491',
      amount: '43,700 USDT',
      asset: 'USDT',
      timestamp: '26 Aug 2026, 14:32'
    },
    exchangeSide: {
      exchangeAccountId: 'EXC-48291',
      depositReference: 'DEP-774201',
      depositAmount: '43,700 USDT',
      depositTimestamp: '26 Aug 2026, 14:36',
      remainingBalance: '25,200 USDT',
      evidenceSource: 'Exchange-side investigative record (synthetic prototype data)',
      internalTransfer: {
        reference: 'INT-00921',
        sourceAccountId: 'EXC-48291',
        destinationAccountId: 'EXC-78142',
        amount: '18,500 USDT',
        timestamp: '26 Aug 2026, 15:02'
      },
      withdrawal: {
        reference: 'WDL-11842',
        sourceAccountId: 'EXC-78142',
        destinationWallet: 'TB8x7810fm4Xq2',
        amount: '18,500 USDT',
        timestamp: '26 Aug 2026, 15:18'
      }
    }
  }
];

export const MOCK_ALERTS: AlertItem[] = [
  {
    id: "ALT-041",
    priority: "HIGH",
    timestamp: "2 min ago",
    title: "New transaction detected",
    description: "12,400 USDT moved to a previously unseen intermediary wallet.",
    subject: "TX9f81ka94jLp27Kp2",
    subjectType: "wallet",
    caseId: "CM-2026-0017",
    whatHappened: "Primary suspect wallet TX9f...7Kp2 executed an outbound transfer of 12,400 USDT to transit address TB7x...29Lm.",
    whyItMatters: "Indicates active fund dispersal and layering attempt.",
    evidenceClassification: "FACT",
    recommendedAction: "Review fund flow graph and update case file CM-2026-0017.",
    isRead: false,
    status: "Open"
  },
  {
    id: "ALT-040",
    priority: "HIGH",
    timestamp: "18 min ago",
    title: "Possible campaign connection",
    description: "Wallet overlap detected with existing investigations CM-2026-0014 and CM-2026-0009.",
    subject: "CM-2026-0017",
    subjectType: "case",
    caseId: "CM-2026-0017",
    whatHappened: "Intermediary TC8m...81Qa forwarded funds to shared collector TE5r...18Nz.",
    whyItMatters: "Links individual complaint to coordinated syndicate Operation Golden Yield (CMP-004).",
    evidenceClassification: "DERIVED",
    recommendedAction: "Cross-reference findings in the Connections tab.",
    isRead: false,
    status: "Open"
  },
  {
    id: "ALT-039",
    priority: "MEDIUM",
    timestamp: "42 min ago",
    title: "New counterparty detected",
    description: "First interaction with intermediary transit node TC8m...81Qa.",
    subject: "TC8m1982bcn81Qa",
    subjectType: "wallet",
    caseId: "CM-2026-0017",
    whatHappened: "Intermediary node TC8m...81Qa received first incoming transfer.",
    whyItMatters: "Maps second transit hop in the suspect's money flow.",
    evidenceClassification: "OBSERVATION",
    recommendedAction: "Add to active monitoring watchlist.",
    isRead: true,
    status: "Reviewed"
  }
];

export const MOCK_MONITORED_NODES = [
  {
    address: "TX9f81ka94jLp27Kp2",
    shortAddress: "TX9f...7Kp2",
    label: "Primary Suspect (CM-2026-0017)",
    blockchain: "TRON",
    riskLevel: "HIGH" as const,
    lastActivity: "2 min ago",
    alertsCount: 2
  },
  {
    address: "TB7x3910amv29Lm",
    shortAddress: "TB7x...29Lm",
    label: "Intermediary A (Hop 1)",
    blockchain: "TRON",
    riskLevel: "HIGH" as const,
    lastActivity: "18 min ago",
    alertsCount: 1
  },
  {
    address: "TC8m1982bcn81Qa",
    shortAddress: "TC8m...81Qa",
    label: "Intermediary B (Hop 2)",
    blockchain: "TRON",
    riskLevel: "MEDIUM" as const,
    lastActivity: "42 min ago",
    alertsCount: 1
  },
  {
    address: "TE5r9024lkj18Nz",
    shortAddress: "TE5r...18Nz",
    label: "Shared Collector Node",
    blockchain: "TRON",
    riskLevel: "HIGH" as const,
    lastActivity: "1 hr ago",
    alertsCount: 1
  }
];

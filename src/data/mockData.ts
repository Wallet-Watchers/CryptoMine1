import { 
  CaseItem, 
  WalletEntity, 
  TransactionItem, 
  CampaignItem, 
  VASPEntity, 
  AlertItem 
} from '../types';

export const CURRENT_INVESTIGATOR = {
  name: "A. Mehta",
  badgeId: "A.MEHTA",
  unit: "Cyber Fraud Unit",
  rank: "Lead Financial Crimes Investigator",
  accessLevel: "Investigator / Read-Write",
  sessionStarted: "2026-08-27T09:00:00Z"
};

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
        points: 25,
        category: "Velocity",
        evidence: "Funds moved onward within minutes of receipt.",
        severity: "HIGH"
      },
      {
        factor: "Intermediary wallets",
        points: 20,
        category: "Layering",
        evidence: "Three intermediary nodes connect to the primary path.",
        severity: "HIGH"
      },
      {
        factor: "High transaction frequency",
        points: 18,
        category: "Volume",
        evidence: "42 transactions observed during the active analysis window.",
        severity: "MEDIUM"
      },
      {
        factor: "Fund splitting",
        points: 14,
        category: "Dispersal",
        evidence: "Incoming funds were divided across multiple downstream addresses.",
        severity: "MEDIUM"
      },
      {
        factor: "New counterparties",
        points: 10,
        category: "Network",
        evidence: "18 counterparties interacted with 0 prior history.",
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
  }
];

export const MOCK_WALLETS: Record<string, WalletEntity> = {
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
        points: 25,
        category: "Velocity",
        evidence: "Funds moved onward within minutes of receipt.",
        severity: "HIGH"
      },
      {
        factor: "Intermediary wallets",
        points: 20,
        category: "Layering",
        evidence: "Three intermediary nodes connect to the primary path.",
        severity: "HIGH"
      },
      {
        factor: "High transaction frequency",
        points: 18,
        category: "Volume",
        evidence: "42 transactions observed during the active analysis window.",
        severity: "MEDIUM"
      },
      {
        factor: "Fund splitting",
        points: 14,
        category: "Dispersal",
        evidence: "Incoming funds divided across multiple downstream addresses.",
        severity: "MEDIUM"
      },
      {
        factor: "New counterparties",
        points: 10,
        category: "Network",
        evidence: "18 counterparties observed with no historical overlap.",
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
    "TE5r9024lkj18Nz (Collector Node / Deposit Candidate)"
  ],
  depositPatterns: "Batched sweep executed when threshold exceeds 10,000 USDT.",
  relatedCases: ["CM-2026-0017", "CM-2026-0014", "CM-2026-0009"],
  relatedWallets: ["TE5r9024lkj18Nz", "TC8m1982bcn81Qa"],
  jurisdiction: "International",
  complianceContactAvailable: true,
  attributionSignals: [
    {
      title: "Destination Cluster Overlap",
      classification: "OBSERVATION",
      description: "Collector matches known exchange deposit router schema."
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

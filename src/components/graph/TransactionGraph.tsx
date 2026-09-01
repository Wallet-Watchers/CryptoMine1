import React, { useMemo, useState, useRef } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2,
  ShieldAlert, 
  ArrowRight, 
  ExternalLink, 
  Eye, 
  Radio, 
  Layers, 
  X,
  Info,
  CheckCircle2,
  Sparkles,
  Play,
  Filter
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { RiskBadge } from '../common/RiskBadge';
import { EvidenceBadge } from '../common/EvidenceBadge';
import { MonoText } from '../common/MonoText';
import { CaseItem, EvidenceClassification, RiskLevel } from '../../types';

interface GraphNode {
  id: string;
  label: string;
  sublabel: string;
  address?: string;
  role: 'Victim / Source' | 'Primary Suspect' | 'Intermediary 1' | 'Intermediary 2' | 'Collector / Destination' | 'VASP Candidate' | 'Linked Case 0014' | 'Linked Case 0009';
  risk: RiskLevel;
  riskScore: number;
  x: number;
  y: number;
  amount: string;
  blockchain: string;
  classification: EvidenceClassification;
  txCount: number;
  firstSeen: string;
  lastSeen: string;
  caseBranch?: string;
  hopLevel: number;
}

interface GraphEdge {
  id: string;
  from: string;
  to: string;
  amount: string;
  txHash: string;
  timestamp: string;
  classification: EvidenceClassification;
  risk: RiskLevel;
  status: string;
  isPrimaryPath: boolean;
  hopNumber: number;
}

const INITIAL_NODES: GraphNode[] = [
  {
    id: 'VICTIM_NODE',
    label: 'Victim (Telegram Lead)',
    sublabel: 'Complainant Source',
    role: 'Victim / Source',
    risk: 'SAFE',
    riskScore: 5,
    x: 80,
    y: 260,
    amount: '50,000 USDT',
    blockchain: 'TRON',
    classification: 'FACT',
    txCount: 1,
    firstSeen: '25 Aug 2026, 09:40',
    lastSeen: '25 Aug 2026, 09:40',
    hopLevel: 0
  },
  {
    id: 'TX9f81ka94jLp27Kp2',
    label: 'TX9f...7Kp2',
    sublabel: 'Primary Suspect Wallet',
    address: 'TX9f81ka94jLp27Kp2',
    role: 'Primary Suspect',
    risk: 'HIGH',
    riskScore: 87,
    x: 290,
    y: 260,
    amount: '50,000 USDT',
    blockchain: 'TRON',
    classification: 'FACT',
    txCount: 42,
    firstSeen: '25 Aug 2026, 08:30',
    lastSeen: '2 min ago',
    hopLevel: 0
  },
  {
    id: 'TB7x3910amv29Lm',
    label: 'TB7x...29Lm',
    sublabel: 'Intermediary Hop 1',
    address: 'TB7x3910amv29Lm',
    role: 'Intermediary 1',
    risk: 'HIGH',
    riskScore: 81,
    x: 500,
    y: 260,
    amount: '12,400 USDT',
    blockchain: 'TRON',
    classification: 'OBSERVATION',
    txCount: 8,
    firstSeen: '25 Aug 2026, 12:10',
    lastSeen: '18 min ago',
    hopLevel: 1
  },
  {
    id: 'TC8m1982bcn81Qa',
    label: 'TC8m...81Qa',
    sublabel: 'Intermediary Hop 2',
    address: 'TC8m1982bcn81Qa',
    role: 'Intermediary 2',
    risk: 'MEDIUM',
    riskScore: 74,
    x: 710,
    y: 260,
    amount: '8,200 USDT',
    blockchain: 'TRON',
    classification: 'OBSERVATION',
    txCount: 16,
    firstSeen: '24 Aug 2026, 18:00',
    lastSeen: '42 min ago',
    hopLevel: 2
  },
  {
    id: 'TE5r9024lkj18Nz',
    label: 'TE5r...18Nz',
    sublabel: 'Shared Collector Node',
    address: 'TE5r9024lkj18Nz',
    role: 'Collector / Destination',
    risk: 'HIGH',
    riskScore: 76,
    x: 920,
    y: 260,
    amount: '148,500 USDT total',
    blockchain: 'TRON',
    classification: 'DERIVED',
    txCount: 94,
    firstSeen: '12 Aug 2026',
    lastSeen: '1 hr ago',
    hopLevel: 3
  },
  {
    id: 'V-018',
    label: 'Binance (Cluster V-018)',
    sublabel: 'Candidate VASP (89%)',
    role: 'VASP Candidate',
    risk: 'MEDIUM',
    riskScore: 55,
    x: 1130,
    y: 260,
    amount: 'Batched Sweep',
    blockchain: 'TRON',
    classification: 'POSSIBLE',
    txCount: 412,
    firstSeen: '2024 (Active)',
    lastSeen: 'Active',
    hopLevel: 4
  },
  {
    id: 'TW6p3910bc5Hs4',
    label: 'TW6p...5Hs4',
    sublabel: 'Case CM-0014 (Task Fraud)',
    address: 'TW6p3910bc5Hs4',
    role: 'Linked Case 0014',
    risk: 'HIGH',
    riskScore: 82,
    x: 710,
    y: 110,
    amount: '18,500 USDT',
    blockchain: 'TRON',
    classification: 'DERIVED',
    txCount: 34,
    firstSeen: '23 Aug 2026',
    lastSeen: '26 Aug 2026',
    caseBranch: 'CM-2026-0014',
    hopLevel: 2
  },
  {
    id: 'TV2k9102bc8Lm1',
    label: 'TV2k...8Lm1',
    sublabel: 'Case CM-0009 (Invest Scam)',
    address: 'TV2k9102bc8Lm1',
    role: 'Linked Case 0009',
    risk: 'MEDIUM',
    riskScore: 68,
    x: 710,
    y: 410,
    amount: '6,800 USDT',
    blockchain: 'TRON',
    classification: 'DERIVED',
    txCount: 22,
    firstSeen: '19 Aug 2026',
    lastSeen: '25 Aug 2026',
    caseBranch: 'CM-2026-0009',
    hopLevel: 2
  }
];

const INITIAL_EDGES: GraphEdge[] = [
  {
    id: 'E1',
    from: 'VICTIM_NODE',
    to: 'TX9f81ka94jLp27Kp2',
    amount: '50,000 USDT',
    txHash: '0x11ab...8890',
    timestamp: '25 Aug 2026, 09:40',
    classification: 'FACT',
    risk: 'HIGH',
    status: 'Initial Fraud Deposit',
    isPrimaryPath: true,
    hopNumber: 0
  },
  {
    id: 'E2',
    from: 'TX9f81ka94jLp27Kp2',
    to: 'TB7x3910amv29Lm',
    amount: '12,400 USDT',
    txHash: '0x7e4a...91cd',
    timestamp: '26 Aug 2026, 14:31',
    classification: 'FACT',
    risk: 'HIGH',
    status: 'Rapid Outward Layering',
    isPrimaryPath: true,
    hopNumber: 1
  },
  {
    id: 'E3',
    from: 'TB7x3910amv29Lm',
    to: 'TC8m1982bcn81Qa',
    amount: '8,200 USDT',
    txHash: '0x3c19...a7bf',
    timestamp: '26 Aug 2026, 13:55',
    classification: 'OBSERVATION',
    risk: 'HIGH',
    status: 'Transit Hop 2',
    isPrimaryPath: true,
    hopNumber: 2
  },
  {
    id: 'E4',
    from: 'TC8m1982bcn81Qa',
    to: 'TE5r9024lkj18Nz',
    amount: '15,900 USDT',
    txHash: '0x91ab...e221',
    timestamp: '26 Aug 2026, 12:44',
    classification: 'DERIVED',
    risk: 'MEDIUM',
    status: 'Collector Aggregation',
    isPrimaryPath: true,
    hopNumber: 3
  },
  {
    id: 'E5',
    from: 'TE5r9024lkj18Nz',
    to: 'V-018',
    amount: 'Sweep Batch',
    txHash: '0x902a...8831',
    timestamp: '26 Aug 2026, 14:32',
    classification: 'POSSIBLE',
    risk: 'MEDIUM',
    status: 'Likely Exchange Deposit',
    isPrimaryPath: true,
    hopNumber: 4
  },
  {
    id: 'E-BRANCH-14',
    from: 'TW6p3910bc5Hs4',
    to: 'TE5r9024lkj18Nz',
    amount: '18,500 USDT',
    txHash: '0x44cd...3312',
    timestamp: '24 Aug 2026, 15:10',
    classification: 'DERIVED',
    risk: 'HIGH',
    status: 'Correlated Inflow (CM-0014)',
    isPrimaryPath: false,
    hopNumber: 1
  },
  {
    id: 'E-BRANCH-09',
    from: 'TV2k9102bc8Lm1',
    to: 'TE5r9024lkj18Nz',
    amount: '6,800 USDT',
    txHash: '0x5f6d...12aa',
    timestamp: '26 Aug 2026, 11:20',
    classification: 'OBSERVATION',
    risk: 'MEDIUM',
    status: 'Correlated Inflow (CM-0009)',
    isPrimaryPath: false,
    hopNumber: 1
  }
];

export const TransactionGraph: React.FC<{
  caseData: CaseItem;
  initialSelectedNodeId?: string;
  height?: string;
  showCampaignBranches?: boolean;
}> = ({
  caseData,
  initialSelectedNodeId = 'TX9f81ka94jLp27Kp2',
  height = 'h-[620px]',
  showCampaignBranches = true
}) => {
  const { navigateTo, showToast } = useInvestigation();
  const isDemoCase = caseData.id === 'CM-2026-0017';
  const hasPendingAnalysis = !isDemoCase && caseData.transactionsCount === 0 && caseData.intermediaryCount === 0;
  const caseEvidenceClassification = caseData.evidenceSignals[0]?.classification ?? 'OBSERVATION';
  const caseNodes = useMemo<GraphNode[]>(() => isDemoCase ? INITIAL_NODES : [
    {
      id: `${caseData.id}-source`, label: 'Complainant Source', sublabel: 'Reported victim transfer',
      role: 'Victim / Source', risk: 'SAFE', riskScore: 5, x: 250, y: 260,
      amount: caseData.reportedAmount, blockchain: caseData.blockchain, classification: caseEvidenceClassification,
      txCount: hasPendingAnalysis ? 0 : caseData.transactionsCount, firstSeen: caseData.createdAt, lastSeen: caseData.createdAt, hopLevel: 0
    },
    {
      id: caseData.primaryWallet, label: `${caseData.primaryWallet.slice(0, 6)}...${caseData.primaryWallet.slice(-4)}`,
      sublabel: 'Primary Suspect Wallet', address: caseData.primaryWallet, role: 'Primary Suspect',
      risk: caseData.riskLevel, riskScore: caseData.riskScore, x: 620, y: 260,
      amount: caseData.tracedAmount, blockchain: caseData.blockchain, classification: caseEvidenceClassification,
      txCount: caseData.transactionsCount, firstSeen: caseData.createdAt, lastSeen: caseData.updatedAt, hopLevel: 0
    }
  ], [caseData, caseEvidenceClassification, hasPendingAnalysis, isDemoCase]);
  const caseEdges = useMemo<GraphEdge[]>(() => isDemoCase ? INITIAL_EDGES : hasPendingAnalysis ? [] : [{
    id: `${caseData.id}-reported-transfer`, from: `${caseData.id}-source`, to: caseData.primaryWallet,
    amount: caseData.reportedAmount, txHash: 'No transaction hash supplied', timestamp: caseData.createdAt,
    classification: caseEvidenceClassification, risk: caseData.riskLevel, status: 'Reported transfer', isPrimaryPath: true, hopNumber: 0
  }], [caseData, caseEvidenceClassification, hasPendingAnalysis, isDemoCase]);
  const [nodes, setNodes] = useState<GraphNode[]>(caseNodes);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(initialSelectedNodeId);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [highlightPrimaryPathOnly, setHighlightPrimaryPathOnly] = useState<boolean>(false);
  const [branchesVisible, setBranchesVisible] = useState<boolean>(showCampaignBranches);
  const [hopDepthFilter, setHopDepthFilter] = useState<number>(4);
  const [isSweeping, setIsSweeping] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Filter nodes based on branches and hop depth
  const visibleNodes = nodes.filter(n => {
    if (!branchesVisible && (n.role === 'Linked Case 0014' || n.role === 'Linked Case 0009')) return false;
    if (n.hopLevel > hopDepthFilter) return false;
    return true;
  });

  const visibleEdges = caseEdges.filter(e => {
    if (!branchesVisible && !e.isPrimaryPath) return false;
    if (e.hopNumber > hopDepthFilter) return false;
    return true;
  });

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).closest('button')) return;
    if (draggedNodeId) return;
    setIsDraggingCanvas(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (draggedNodeId) {
      // Dragging a specific node
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mouseX = (e.clientX - rect.left - pan.x) / zoom;
      const mouseY = (e.clientY - rect.top - pan.y) / zoom;

      setNodes(prev => prev.map(n => n.id === draggedNodeId ? { ...n, x: Math.round(mouseX), y: Math.round(mouseY) } : n));
      return;
    }

    if (isDraggingCanvas) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDraggingCanvas(false);
    setDraggedNodeId(null);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setNodes(caseNodes);
    setSelectedNodeId(initialSelectedNodeId);
    setSelectedEdgeId(null);
    setHopDepthFilter(4);
    showToast('Graph Recentered', 'Camera and node coordinates restored to default.', 'info');
  };

  const triggerLiveSweepSimulation = () => {
    setIsSweeping(true);
    showToast('Simulating Live Fund Sweep', `Animating the selected ${caseData.id} fund path.`, 'success');
    setTimeout(() => {
      setIsSweeping(false);
    }, 4500);
  };

  const selectedNode = visibleNodes.find(n => n.id === selectedNodeId);
  const selectedEdge = visibleEdges.find(e => e.id === selectedEdgeId);

  const getNodeInsight = (node: GraphNode) => {
    if (hasPendingAnalysis) {
      return 'Pending analysis. Complaint details and the submitted wallet are recorded, but no on-chain transaction activity or intermediary path has been confirmed.';
    }
    if (node.role === 'Primary Suspect') {
      return isDemoCase
        ? 'Direct recipient of 50,000 USDT complaint funds. Rapid automated dispersal within 8 minutes into intermediary layering cluster.'
        : `Primary suspect wallet recorded for ${caseData.id}. ${caseData.transactionsCount} transaction${caseData.transactionsCount === 1 ? '' : 's'} and ${caseData.intermediaryCount} intermediary ${caseData.intermediaryCount === 1 ? 'node' : 'nodes'} are listed in the case record.`;
    }
    if (node.role === 'Victim / Source') return isDemoCase
      ? 'Initial reporting complainant. Transfer initiated following fraudulent Telegram investment solicitation.'
      : `Complaint source recorded with a reported amount of ${caseData.reportedAmount}.`;
    if (node.role === 'Intermediary 1') return 'First hop transit node. Sweeps funds directly into intermediary node 2 without maintaining custodial balance.';
    if (node.role === 'Intermediary 2') return 'Second hop aggregator. Consolidates split tranches and relays directly to shared collector TE5r...18Nz.';
    if (node.role === 'Collector / Destination') return 'Shared infrastructure nexus. Connects 3 independent complaints (CM-0017, CM-0014, CM-0009) to candidate Binance cluster.';
    if (node.role === 'VASP Candidate') return 'Binance deposit sub-account candidate (Cluster V-018) identified with 89% probabilistic confidence.';
    return 'Independent case deposit address feeding into the identical shared collector infrastructure.';
  };

  const getNodeColor = (node: GraphNode) => {
    if (node.role === 'Victim / Source') return { bg: '#e2e8f0', border: '#94a3b8', text: '#334155', glow: 'rgba(148, 163, 184, 0.2)' };
    if (node.role === 'Primary Suspect') return { bg: '#fee2e2', border: '#ef4444', text: '#991b1b', glow: 'rgba(239, 68, 68, 0.4)' };
    if (node.role === 'Intermediary 1') return { bg: '#fef2f2', border: '#f87171', text: '#b91c1c', glow: 'rgba(248, 113, 113, 0.3)' };
    if (node.role === 'Intermediary 2') return { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', glow: 'rgba(245, 158, 11, 0.3)' };
    if (node.role === 'Collector / Destination') return { bg: '#ffedd5', border: '#ea580c', text: '#9a3412', glow: 'rgba(234, 88, 12, 0.35)' };
    if (node.role === 'VASP Candidate') return { bg: '#f0fdf4', border: '#22c55e', text: '#166534', glow: 'rgba(34, 197, 94, 0.25)' };
    return { bg: '#e0f2fe', border: '#0284c7', text: '#0369a1', glow: 'rgba(2, 132, 199, 0.3)' };
  };

  return (
    <div className={`relative w-full ${isFullscreen ? 'fixed inset-0 z-50 h-screen rounded-none' : `${height} rounded-xl`} bg-slate-900 border border-slate-800 overflow-hidden shadow-inner flex flex-col select-none`}>
      {/* Top Header & Graph HUD Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2.5">
        <div className="bg-slate-950/90 border border-slate-700/80 backdrop-blur-md px-3.5 py-2 rounded-lg text-slate-100 flex items-center gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-orange-400">
              FUND FLOW TRACE
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-xs text-slate-300 font-mono">Case: {caseData.id}</span>
          <span className="text-slate-600">|</span>
          <span className="text-xs text-emerald-400 font-mono font-medium">{hasPendingAnalysis ? 'Pending analysis' : `${caseData.tracedAmount} Traced`}</span>
        </div>

        {/* Action: Simulate Live Sweep */}
        {!hasPendingAnalysis && <button
          onClick={triggerLiveSweepSimulation}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all ${
            isSweeping 
              ? 'bg-orange-500 text-white animate-pulse' 
              : 'bg-slate-950/90 hover:bg-slate-800 text-orange-400 border border-slate-700/80'
          }`}
          title="Animate live fund movement packets across nodes"
        >
          <Play className={`w-3.5 h-3.5 ${isSweeping ? 'animate-spin' : 'fill-orange-400'}`} />
          <span>{isSweeping ? 'Sweeping Funds...' : 'Simulate Sweep Flow'}</span>
        </button>}

        {/* View Options Toggle Buttons */}
        <div className="bg-slate-950/80 border border-slate-700/70 backdrop-blur-md p-1 rounded-lg flex items-center gap-1 shadow-lg">
          <button
            onClick={() => setBranchesVisible(prev => !prev)}
            className={`px-2.5 py-1 text-xs rounded font-medium flex items-center gap-1.5 transition-colors ${
              branchesVisible ? 'bg-orange-600/90 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle cross-investigation multi-case flow convergence"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Campaign Links</span>
          </button>
        </div>

        {/* Hop Depth Filter Selector */}
        <div className="bg-slate-950/80 border border-slate-700/70 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-2 shadow-lg text-xs text-slate-300">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] text-slate-400">Hops:</span>
          <select
            value={hopDepthFilter}
            onChange={(e) => setHopDepthFilter(Number(e.target.value))}
            className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-orange-400 font-mono outline-none"
          >
            <option value={4}>All (Hop 0-4)</option>
            <option value={1}>1 Hop (Relay)</option>
            <option value={2}>2 Hops (Transit)</option>
            <option value={3}>3 Hops (Collector)</option>
          </select>
        </div>
      </div>

      {/* Floating Zoom and Navigation Tools */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-slate-950/90 border border-slate-700/80 backdrop-blur-md p-1 rounded-lg shadow-lg">
        <button
          onClick={() => setZoom(z => Math.min(z + 0.15, 2.2))}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(z => Math.max(z - 0.15, 0.5))}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={resetView}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
          title="Reset View & Recenter"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={() => setIsFullscreen(prev => !prev)}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Graph"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Interactive SVG Network Canvas */}
      <div
        ref={containerRef}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        className="w-full flex-1 cursor-grab active:cursor-grabbing relative overflow-hidden"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.08) 1px, transparent 0)
          `,
          backgroundSize: '24px 24px'
        }}
      >
        <svg
          className="w-full h-full"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '50% 50%',
            transition: isDraggingCanvas || draggedNodeId ? 'none' : 'transform 0.15s ease-out'
          }}
        >
          <defs>
            {/* Directional Arrow Marker */}
            <marker
              id="arrow-primary"
              viewBox="0 0 10 10"
              refX="22"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#f97316" />
            </marker>
            <marker
              id="arrow-branch"
              viewBox="0 0 10 10"
              refX="22"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
            </marker>

            {/* Pulsing Gradient Filters */}
            <filter id="glow-high" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render Edges */}
          {visibleEdges.map((edge) => {
            const fromNode = visibleNodes.find(n => n.id === edge.from);
            const toNode = visibleNodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const isSelected = selectedEdgeId === edge.id;
            const isPrimary = edge.isPrimaryPath;
            const edgeColor = isPrimary ? '#f97316' : '#38bdf8';
            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2;

            // Curved path for branches
            const isCurved = !isPrimary;
            const pathD = isCurved
              ? `M ${fromNode.x} ${fromNode.y} Q ${midX} ${fromNode.y > toNode.y ? midY - 25 : midY + 25} ${toNode.x} ${toNode.y}`
              : `M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`;

            return (
              <g 
                key={edge.id} 
                className="cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEdgeId(edge.id);
                  setSelectedNodeId(null);
                }}
              >
                {/* Thick invisible line for easy clicking */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="24"
                />

                {/* Main edge path */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={edgeColor}
                  strokeWidth={isSelected ? 3.5 : isPrimary ? 2.5 : 2}
                  strokeDasharray={isPrimary ? "none" : "5,4"}
                  markerEnd={isPrimary ? "url(#arrow-primary)" : "url(#arrow-branch)"}
                  className="transition-all duration-200 group-hover:stroke-orange-300"
                />

                {/* Animated pulse particles if sweep is active */}
                {isSweeping && (
                  <circle r="4" fill="#ffffff" filter="url(#glow-high)">
                    <animateMotion
                      path={pathD}
                      dur="1.8s"
                      repeatCount="indefinite"
                      rotate="auto"
                    />
                  </circle>
                )}

                {/* Edge Label Badge */}
                <g transform={`translate(${midX}, ${isCurved ? (fromNode.y > toNode.y ? midY - 14 : midY + 14) : midY - 12})`}>
                  <rect
                    x="-46"
                    y="-11"
                    width="92"
                    height="20"
                    rx="4"
                    fill="#0f172a"
                    stroke={isSelected ? '#f97316' : '#334155'}
                    strokeWidth="1"
                    className="group-hover:stroke-orange-400 transition-colors"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill={isPrimary ? '#fdba74' : '#7dd3fc'}
                    fontSize="10"
                    fontFamily="ui-monospace, monospace"
                    fontWeight="bold"
                  >
                    {edge.amount}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Render Nodes */}
          {visibleNodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const colors = getNodeColor(node);

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-move group"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setDraggedNodeId(node.id);
                  setSelectedNodeId(node.id);
                  setSelectedEdgeId(null);
                }}
              >
                {/* Outer selection ring / halo */}
                {isSelected && (
                  <circle
                    r="42"
                    fill="none"
                    stroke={colors.border}
                    strokeWidth="2"
                    strokeDasharray="4,4"
                    className="animate-spin"
                    style={{ animationDuration: '12s' }}
                  />
                )}

                {/* Node circle background */}
                <circle
                  r="30"
                  fill={colors.bg}
                  stroke={isSelected ? '#ffffff' : colors.border}
                  strokeWidth={isSelected ? 3 : 2}
                  className="transition-transform duration-150 group-hover:scale-105 shadow-lg"
                  filter={node.risk === 'HIGH' ? "url(#glow-high)" : undefined}
                />

                {/* Inner icon/text */}
                <text
                  x="0"
                  y="-4"
                  textAnchor="middle"
                  fill={colors.text}
                  fontSize="9"
                  fontFamily="ui-monospace, monospace"
                  fontWeight="bold"
                >
                  {node.role === 'Victim / Source' ? 'SOURCE' : node.role === 'VASP Candidate' ? 'VASP' : node.label.slice(0, 7)}
                </text>
                <text
                  x="0"
                  y="9"
                  textAnchor="middle"
                  fill={colors.text}
                  fontSize="8"
                  fontWeight="bold"
                  fontFamily="ui-monospace, monospace"
                >
                  {node.risk === 'SAFE' ? 'SAFE' : `${node.riskScore}/100`}
                </text>

                {/* Node Bottom Label */}
                <g transform="translate(0, 42)">
                  <rect
                    x="-65"
                    y="-8"
                    width="130"
                    height="26"
                    rx="4"
                    fill="#020617"
                    stroke={isSelected ? colors.border : '#1e293b'}
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="10"
                    fontWeight="600"
                  >
                    {node.label}
                  </text>
                  <text
                    x="0"
                    y="13"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="8"
                  >
                    {node.sublabel}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom Classification Legend Bar */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-slate-950/90 border border-slate-700/80 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">EVIDENCE LAYER:</span>
        <EvidenceBadge classification="FACT" size="sm" />
        <EvidenceBadge classification="OBSERVATION" size="sm" />
        <EvidenceBadge classification="DERIVED" size="sm" />
        <EvidenceBadge classification="INFERENCE" size="sm" />
        <EvidenceBadge classification="POSSIBLE" size="sm" />
      </div>

      {/* Side Inspector Drawer (Node or Edge Details) */}
      {(selectedNode || selectedEdge) && (
        <div className="absolute top-4 right-4 bottom-4 w-84 bg-slate-950/95 border border-slate-800 text-slate-100 rounded-xl p-5 shadow-2xl z-30 flex flex-col overflow-y-auto backdrop-blur-md animate-in slide-in-from-right-4 duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="micro-label text-orange-400">
              {selectedNode ? 'NODE INSPECTOR' : 'TRANSACTION INSPECTOR'}
            </span>
            <button
              onClick={() => {
                setSelectedNodeId(null);
                setSelectedEdgeId(null);
              }}
              className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Node Selected View */}
          {selectedNode && (
            <div className="mt-4 space-y-4 flex-1">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500">ENTITY / ROLE</span>
                <h4 className="text-base font-bold text-white mt-0.5">{selectedNode.label}</h4>
                <p className="text-xs text-orange-400 font-medium">{selectedNode.role}</p>
              </div>

              {selectedNode.address && (
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500">FULL ADDRESS</span>
                  <div className="mt-1">
                    <MonoText value={selectedNode.address} />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">CASE AMOUNT</span>
                  <span className="font-mono text-slate-200">{selectedNode.amount}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">RISK EVALUATION</span>
                  <div className="mt-1">
                    <RiskBadge level={selectedNode.risk} score={selectedNode.riskScore} size="sm" />
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">EVIDENCE TIER</span>
                  <div className="mt-1">{hasPendingAnalysis ? <span className="text-xs font-mono text-amber-400">PENDING ANALYSIS</span> : <EvidenceBadge classification={selectedNode.classification} size="sm" />}</div>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-800/80 mt-1 flex justify-between">
                  <span className="text-slate-400">Activity Window:</span>
                  <span className="font-mono text-slate-200">{selectedNode.lastSeen}</span>
                </div>
                <div className="col-span-2 flex justify-between">
                  <span className="text-slate-400">Transactions:</span>
                  <span className="font-mono text-slate-200">{selectedNode.txCount} txs</span>
                </div>
              </div>

              {/* Explainable Insights Box */}
              <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-lg space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Info className="w-3 h-3 text-orange-400" />
                  TOPOLOGICAL ROLE
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {getNodeInsight(selectedNode)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                {selectedNode.address && (
                  <button
                    onClick={() => navigateTo('case-detail', { caseId: caseData.id, tab: 'overview' })}
                    className="w-full py-2 px-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Case Overview</span>
                  </button>
                )}
                {selectedNode.role === 'VASP Candidate' && (
                  <button
                    onClick={() => navigateTo('case-detail', { caseId: caseData.id, tab: 'vasp' })}
                    className="w-full py-2 px-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Review VASP Attribution Dossier</span>
                  </button>
                )}
                {selectedNode.caseBranch && (
                  <button
                    onClick={() => navigateTo('case-detail', { caseId: selectedNode.caseBranch, tab: 'overview' })}
                    className="w-full py-2 px-3 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Linked Case ({selectedNode.caseBranch})</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Edge Selected View */}
          {selectedEdge && (
            <div className="mt-4 space-y-4 flex-1">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500">TRANSFER DETAILS</span>
                <h4 className="text-xl font-mono font-bold text-orange-400 mt-0.5">{selectedEdge.amount}</h4>
                <p className="text-xs text-slate-400">{selectedEdge.status}</p>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500">TRANSACTION HASH</span>
                <div className="mt-1">
                  <MonoText value={selectedEdge.txHash} />
                </div>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Timestamp:</span>
                  <span className="font-mono text-slate-200">{selectedEdge.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hop Distance:</span>
                  <span className="font-mono text-slate-200">Hop {selectedEdge.hopNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Evidence Class:</span>
                  <EvidenceBadge classification={selectedEdge.classification} size="sm" />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigateTo('case-detail', { caseId: caseData.id, tab: 'fund-flow' })}
                  className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Inspect Transfer Path</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

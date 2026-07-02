import React, { useState, useCallback } from 'react';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState, addEdge, Handle, Position, BaseEdge, getBezierPath, EdgeLabelRenderer, useReactFlow } from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, AlertTriangle, FileText, Activity, Server, Zap, Search, X, Loader2, Link as LinkIcon } from 'lucide-react';
import { trpc } from '../trpc';
import ReactMarkdown from 'react-markdown';
import '@xyflow/react/dist/style.css';

// 1. Define Custom Node Component
const CustomNode = ({ data, selected }: any) => {
  const isAsset = data.type === 'asset';
  const isAnomaly = data.type === 'anomaly';
  const isDoc = data.type === 'document';

  const baseClasses = "px-4 py-3 rounded-xl border-2 shadow-lg transition-all duration-300 min-w-[220px]";
  const selectedClasses = selected ? "ring-2 ring-white scale-105" : "";
  
  let colorClasses = "";
  let Icon = Database;

  if (isAsset) {
    colorClasses = "bg-accent/20 border-accent/50 text-accent shadow-[0_0_15px_rgba(0,200,83,0.2)]";
    Icon = Server;
  } else if (isAnomaly) {
    colorClasses = "bg-danger/20 border-danger/50 text-danger shadow-[0_0_20px_rgba(211,47,47,0.3)]";
    Icon = AlertTriangle;
  } else if (isDoc) {
    colorClasses = "bg-warning/20 border-warning/50 text-warning shadow-[0_0_15px_rgba(255,193,7,0.2)]";
    Icon = FileText;
  }

  return (
    <div className={`${baseClasses} ${colorClasses} ${selectedClasses} backdrop-blur-md`}>
      <Handle type="target" position={Position.Top} className="!bg-gray-500 !w-3 !h-3" />
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${isAsset ? 'bg-accent/20' : isAnomaly ? 'bg-danger/20' : 'bg-warning/20'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider opacity-70 mb-0.5">{data.type}</div>
          <div className="font-mono font-bold text-sm text-white">{data.label}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-gray-500 !w-3 !h-3" />
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style, markerEnd }: any) => {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div style={{ position: 'absolute', transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`, pointerEvents: 'all' }} className="nodrag nopan">
          <button className="w-5 h-5 bg-gray-900 text-gray-400 hover:text-white hover:bg-red-500/80 border border-gray-700 rounded-full flex items-center justify-center text-xs transition-all shadow-lg" onClick={(event) => { event.stopPropagation(); setEdges((es) => es.filter((e) => e.id !== id)); }} title="Remove Connection">
            <X className="w-3 h-3" />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
const edgeTypes = { custom: CustomEdge };

// 2. Initial Data
const initialNodes: Node[] = [
  { id: '1', type: 'custom', position: { x: 400, y: 100 }, data: { label: 'Turbine Generator A', type: 'asset', details: 'Main power turbine in Sector 4. Installed 2019.', status: 'Warning' } },
  { id: '2', type: 'custom', position: { x: 150, y: 300 }, data: { label: 'High Vibration Alert', type: 'anomaly', details: 'Vibration exceeded 15mm/s threshold at bearing housing.', severity: 'Critical' } },
  { id: '3', type: 'custom', position: { x: 650, y: 300 }, data: { label: 'Turbine_Manual_v2.pdf', type: 'document', details: 'OEM Maintenance manual containing emergency procedures.', relevance: '98%' } },
  { id: '4', type: 'custom', position: { x: 300, y: 500 }, data: { label: 'Bearing Assembly', type: 'asset', details: 'Sub-component of Turbine Generator A', status: 'Degraded' } },
  { id: '5', type: 'custom', position: { x: 650, y: 500 }, data: { label: 'Past_Incident_Report.txt', type: 'document', details: 'Report from 2023 detailing similar vibration issues.', relevance: '85%' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', type: 'custom', source: '1', target: '2', label: 'HAS_ANOMALY', animated: true, style: { stroke: '#D32F2F', strokeWidth: 2 } },
  { id: 'e1-3', type: 'custom', source: '1', target: '3', label: 'REFERENCED_BY', style: { stroke: '#FFC107', strokeWidth: 2, opacity: 0.6 } },
  { id: 'e1-4', type: 'custom', source: '1', target: '4', label: 'CONTAINS', style: { stroke: '#00C853', strokeWidth: 2, opacity: 0.6 } },
  { id: 'e2-4', type: 'custom', source: '2', target: '4', label: 'LOCATED_AT', animated: true, style: { stroke: '#D32F2F', strokeWidth: 2 } },
  { id: 'e3-5', type: 'custom', source: '3', target: '5', label: 'SIMILAR_TO', style: { stroke: '#FFC107', strokeWidth: 2, strokeDasharray: '5 5' } },
];

export default function KnowledgeGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [connectingNodeId, setConnectingNodeId] = useState<string | null>(null);

  const analyzeMutation = trpc.qa.analyzeNode.useMutation({
    onSuccess: (data) => {
      setAnalysisResult(data.result);
    }
  });

  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge({ ...params, type: 'custom' }, eds)), [setEdges]);

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    if (connectingNodeId && connectingNodeId !== node.id) {
      const newEdge: Edge = {
        id: `e${connectingNodeId}-${node.id}`,
        type: 'custom',
        source: connectingNodeId,
        target: node.id,
        label: 'USER_LINKED',
        style: { stroke: '#a855f7', strokeWidth: 2, strokeDasharray: '5 5' }
      };
      setEdges((eds) => addEdge(newEdge, eds));
      setConnectingNodeId(null);
      return;
    }
    
    setSelectedNode(node);
    setAnalysisResult(null); // clear previous analysis when clicking a new node
  };
  
  const handlePaneClick = () => {
    setSelectedNode(null);
    setAnalysisResult(null);
    setConnectingNodeId(null);
  };

  const runAnalysis = (action: 'root_cause' | 'summarize') => {
    if (!selectedNode) return;
    setAnalysisResult(null);
    analyzeMutation.mutate({
      nodeId: selectedNode.id,
      nodeLabel: selectedNode.data.label,
      nodeType: selectedNode.data.type,
      action
    });
  };

  const onEdgeClick = (event: React.MouseEvent, edge: Edge) => {
    event.stopPropagation();
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] relative">
      <div className="flex justify-between items-center bg-gray-900/40 p-5 rounded-t-2xl border-x border-t border-gray-800 backdrop-blur-sm z-10 relative">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-accent/20 rounded-lg border border-accent/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Search className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-mono font-bold text-white">Interactive Knowledge Graph</h1>
            <p className="text-gray-400 text-xs">Explore relationships between Assets, Documents, and Anomalies.</p>
          </div>
        </div>
        <div className="text-sm text-gray-500 font-mono">
          Nodes: {nodes.length} | Edges: {edges.length}
        </div>
      </div>

      <div className="flex-1 bg-gray-950/80 rounded-b-2xl border-x border-b border-gray-800 relative overflow-hidden">
        
        {connectingNodeId && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-6 py-2 rounded-full shadow-[0_0_20px_rgba(147,51,234,0.5)] z-20 flex items-center font-bold text-sm animate-pulse">
            <LinkIcon className="w-4 h-4 mr-2" /> Select target node to connect...
            <button onClick={() => setConnectingNodeId(null)} className="ml-4 hover:text-gray-300">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onPaneClick={handlePaneClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          className="bg-grid-pattern"
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#1A1A1D" gap={20} size={1.5} />
          <Controls className="bg-gray-900 border-gray-800 fill-white" />
        </ReactFlow>

        {/* Slide-out Details Panel */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-4 right-4 bottom-4 w-96 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl p-6 flex flex-col z-20"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-gray-800 text-gray-400 border border-gray-700">
                    {selectedNode.data.type} Node
                  </span>
                  <h2 className="text-xl font-bold text-white mt-3 font-mono">{selectedNode.data.label}</h2>
                </div>
                <button onClick={handlePaneClick} className="p-1 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar pb-6">
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{selectedNode.data.details}</p>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Properties</h3>
                  
                  {selectedNode.data.status && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">Health Status</span>
                      <span className={`text-sm font-bold ${selectedNode.data.status === 'Warning' ? 'text-amber-400' : 'text-red-400'}`}>
                        {selectedNode.data.status}
                      </span>
                    </div>
                  )}
                  {selectedNode.data.severity && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">Severity</span>
                      <span className="text-sm font-bold text-red-400">{selectedNode.data.severity}</span>
                    </div>
                  )}
                  {selectedNode.data.relevance && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">AI Relevance</span>
                      <span className="text-sm font-bold text-blue-400">{selectedNode.data.relevance}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Node ID</span>
                    <span className="text-sm font-mono text-gray-500">{selectedNode.id}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">AI Analysis Actions</h3>
                  <div className="space-y-2">
                    <button 
                      onClick={() => runAnalysis('root_cause')}
                      disabled={analyzeMutation.isPending}
                      className="w-full py-2.5 px-4 bg-accent/10 hover:bg-accent/20 border border-accent/30 text-accent rounded-lg text-sm font-medium transition-colors flex items-center justify-center disabled:opacity-50"
                    >
                      <Zap className="w-4 h-4 mr-2" /> Find Root Cause
                    </button>
                    <button 
                      onClick={() => runAnalysis('summarize')}
                      disabled={analyzeMutation.isPending}
                      className="w-full py-2.5 px-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center disabled:opacity-50"
                    >
                      <FileText className="w-4 h-4 mr-2" /> Summarize Context
                    </button>
                    <button 
                      onClick={() => {
                        setConnectingNodeId(selectedNode.id);
                        setSelectedNode(null);
                      }}
                      className="w-full py-2.5 px-4 bg-purple-900/30 hover:bg-purple-900/50 border border-purple-500/30 text-purple-400 rounded-lg text-sm font-medium transition-colors flex items-center justify-center mt-2"
                    >
                      <LinkIcon className="w-4 h-4 mr-2" /> Link to another node
                    </button>
                  </div>
                </div>

                {/* AI Analysis Result Section */}
                <AnimatePresence>
                  {(analyzeMutation.isPending || analysisResult) && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 border-t border-gray-800 pt-6"
                    >
                      <h3 className="text-xs font-bold text-accent uppercase tracking-wider mb-4 flex items-center">
                        <Activity className="w-4 h-4 mr-2" />
                        AI Analysis Output
                      </h3>
                      
                      {analyzeMutation.isPending ? (
                        <div className="flex flex-col items-center justify-center py-6 space-y-4">
                          <Loader2 className="w-8 h-8 text-accent animate-spin" />
                          <span className="text-sm text-gray-400 animate-pulse">Running Deep Analysis...</span>
                        </div>
                      ) : (
                        <div className="prose prose-invert prose-sm prose-p:text-gray-300 prose-strong:text-white bg-gray-950 p-4 rounded-xl border border-gray-800 shadow-inner">
                          <ReactMarkdown>{analysisResult || ''}</ReactMarkdown>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

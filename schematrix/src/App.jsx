import React, { useCallback, useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState
} from 'reactflow';

import 'reactflow/dist/style.css';
import ResistorNode from '../components/elComponents/resistor';
import SidebarButton from '../components/sidebarButton';
import Sidebar from '../components/sidebar';

const nodeTypes = {
  resistor: ResistorNode,
};

const initialNodes = [];
const initialEdges = [];

function FlowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showSidebar, setShowSidebar] = useState(false);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    const position = {
      x: event.clientX - 250,
      y: event.clientY - 50,
    };

    const newNode = {
      id: `${+new Date()}`,
      type,
      position,
      data: { label: `${type} node`, value: 100 },
    };

    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {showSidebar && <Sidebar/>}
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{ display: 'flex', height: '100vh', width: '100vw'}}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <SidebarButton setShowSidebar={setShowSidebar}/>
        </ReactFlow>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <FlowEditor />
    </ReactFlowProvider>
  );
}
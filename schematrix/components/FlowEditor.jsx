import ReactFlow, {
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "reactflow";
import SidebarButton from "./sidebarButton";
import Sidebar from "./sidebar";
import ResistorNode from "./elComponents/resistor";
import { useCallback, useEffect, useState } from "react";

const nodeTypes = {
  resistor: ResistorNode,
};

const initialNodes = [];
const initialEdges = [];

export default function FlowEditor() {
  const { project } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedElements, setSelectedElements] = useState({
    nodes: [],
    edges: [],
  });
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    window.focus();
  }, []);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) => addEdge({ ...params, type: "smoothstep" }, eds)),
    []
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      const position = project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const newNode = {
        id: `${+new Date()}`,
        type,
        position,
        data: { label: `${type} node`, value: 100, setNodes },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [project, setNodes]
  );

  const onSelectionChange = useCallback(({ nodes, edges }) => {
    setSelectedElements({ nodes, edges });
    console.log("Selected Nodes:", nodes);
    console.log("Selected Edges:", edges);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        if (selectedElements.edges[0]) {
          setEdges((eds) =>
            eds.filter(
              (ed) => !selectedElements.edges.find((e) => e.id === ed.id)
            )
          );
        } else {
          setNodes((nds) =>
            nds.filter(
              (nd) => !selectedElements.nodes.find((n) => n.id === nd.id)
            )
          );
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedElements]);

  return (
    <div className="flex w-screen h-screen">
      {showSidebar && <Sidebar />}
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="flex w-screen h-screen"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          onSelectionChange={onSelectionChange}
          translateExtent={[
            [0, 0],
            [8000, 8000],
          ]}
        >
          <Background />
          <Controls />
          <SidebarButton setShowSidebar={setShowSidebar} />
        </ReactFlow>
      </div>
    </div>
  );
}

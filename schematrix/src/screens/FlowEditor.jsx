import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "reactflow";
import SidebarButton from "../../components/sidebarButton";
import Sidebar from "../../components/sidebar";
import ResistorNode from "../../components/elComponents/resistor";
import { useCallback, useEffect, useRef, useState } from "react";
import BatteryNode from "../../components/elComponents/battery";
import { useLocation, useNavigate } from "react-router-dom";
import HomeButton from "../../components/homeButton";
import GraphName from "../../components/graphName";
import SaveButton from "../../components/saveButton";
import domtoimage from "dom-to-image-more";
import { FlowContext } from "../../context/FlowContext";

const nodeTypes = {
  resistor: ResistorNode,
  battery: BatteryNode,
};

const initialNodes = [];
const initialEdges = [];

function isCircuitComplete(nodes, edges) {
  const battery = nodes.find((n) => n.type === "battery");
  if (!battery) return false;

  const posHandle = battery.id;
  const negHandle = battery.id;
  const graph = {};
  let length = 0;
  edges.forEach((edge) => {
    const a = edge.source;
    const b = edge.target;
    if (!graph[a]) {
      graph[a] = [];
      length++;
    }
    if (!graph[b]) {
      graph[b] = [];
      length++;
    }
    graph[a].push(b);
    graph[b].push(a);
  });
  const visited = new Set();
  let foundResistor = false;
  let valid = false;

  function dfs(nodeId, cameFrom) {
    if (nodeId === negHandle && foundResistor) {
      valid = true;
      return;
    }
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    const node = nodes.find((n) => n.id === nodeId);

    if (node && node.type === "resistor") foundResistor = true;

    for (const neighbor of graph[nodeId] || []) {
      if (neighbor !== cameFrom || length === 2) dfs(neighbor, nodeId);
    }
  }

  dfs(posHandle, null);
  return valid;
}

export default function FlowEditor() {
  const navigate = useNavigate();

  const location = useLocation();
  const { id, name, initialNodes, initialEdges } = location.state || {};
  if (id === undefined) {
    navigate("/");
  }
  const { project } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedElements, setSelectedElements] = useState({
    nodes: [],
    edges: [],
  });
  const [graphName, setGraphName] = useState(name);
  const [showSidebar, setShowSidebar] = useState(false);
  const ref = useRef();
  console.log(nodes, edges);

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
        data: { label: `${type} node`, value: 100 },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [project, setNodes]
  );

  const onSelectionChange = useCallback(({ nodes, edges }) => {
    setSelectedElements({ nodes, edges });
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
          let node_id = selectedElements.nodes[0].id;
          setNodes((nds) => nds.filter((nd) => nd.id !== node_id));
          setEdges((edg) => edg.filter((ed) => (ed.target !== node_id && ed.source !== node_id)));
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedElements]);

  const save = () => {
    setShowSidebar(false);
    async function editGraph() {
      const canvas = document.querySelector("#reactFlow");
      if (!canvas) return;
      await new Promise((res) => requestAnimationFrame(res));
      const dataUrl = await domtoimage.toPng(canvas, {
        bgcolor: "#fff",
        width: canvas.scrollWidth,
        height: canvas.scrollHeight,
        style: {
          transform: "scale(1)",
        },
      });
      let access = localStorage.getItem("access token");

      let res = await fetch("http://127.0.0.1:8000/api/graph", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({
          id: id,
          name: graphName,
          data: {
            nodes: nodes,
            edges: edges,
            snapshot: dataUrl,
            viewport: {
              x: 0,
              y: 0,
              zoom: 1,
            },
          },
        }),
      });

      if (res.status === 401) {
        const refresh = localStorage.getItem("refresh token");

        const refreshRes = await fetch(
          "http://127.0.0.1:8000/api/token/refresh",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh }),
          }
        );

        if (refreshRes.status === 400 || refreshRes.status === 401) {
          localStorage.removeItem("access token");
          localStorage.removeItem("refresh token");
          navigate("/");
        }

        const refreshData = await refreshRes.json();

        if (refreshData.access) {
          localStorage.setItem("access token", refreshData.access);

          res = await fetch("http://127.0.0.1:8000/api/graph", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
            body: JSON.stringify({
              id: id,
              name: graphName,
              data: {
                nodes: nodes,
                edges: edges,
                snapshot: dataUrl,
                viewport: {
                  x: 0,
                  y: 0,
                  zoom: 1,
                },
              },
            }),
          });
        } else {
          console.error("Refresh token invalid or expired");
        }
      }
      return await res.json();
    }
    editGraph().then(() => navigate("/dashboard"));
  };

  return (
    <FlowContext.Provider
      value={{
        edges,
        nodes,
        setNodes,
        setEdges,
        setSelectedElements,
        isCircuitComplete,
      }}
    >
      <div className="flex w-screen h-screen">
        {showSidebar && <Sidebar />}
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex w-screen h-screen bg-[#FFF]"
          id="reactFlow"
          ref={ref}
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
            <HomeButton />
            <GraphName
              name={graphName}
              setName={setGraphName}
              setSelectedElements={onSelectionChange}
            />
            <SaveButton save={save} />
          </ReactFlow>
        </div>
      </div>
    </FlowContext.Provider>
  );
}

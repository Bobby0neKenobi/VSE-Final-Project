import { useNavigate } from "react-router-dom";
import { ReactFlow } from "reactflow";

export default function GraphCard({ id, name, nodes, edges, snapshot }) {
  console.log(id, nodes, edges, snapshot);
  const navigate = useNavigate();
  return (
    <div
      onClick={() =>
        navigate("/canvas", {
          state: {
            id: id,
            name: name,
            initialEdges: edges,
            initialNodes: nodes,
          },
        })
      }
      style={{
        width: "100%",
        minWidth: "250px",
        maxWidth: "100%",
        height: "250px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        overflow: "hidden",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
      }}
    >
      {snapshot ? (
        <img src={snapshot} style={{ width: "100%", height: "80%" }} />
      ) : (
        <div style={{ flex: 1, position: "relative", pointerEvents: "none" }}>
          <ReactFlow
            nodes={[]}
            edges={[]}
            fitView
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnScroll={false}
            zoomOnScroll={false}
            zoomOnDoubleClick={false}
            panOnDrag={false}
            draggable={false}
          />
        </div>
      )}
      <div
        style={{
          padding: "0.75rem",
          borderTop: "1px solid #eee",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {name}
      </div>
    </div>
  );
}

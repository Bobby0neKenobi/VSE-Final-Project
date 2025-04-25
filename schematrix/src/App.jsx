import ReactFlow, { ReactFlowProvider } from "reactflow";

import "reactflow/dist/style.css";
import FlowEditor from "../components/FlowEditor";

export default function App() {
  return (
    <ReactFlowProvider>
      <FlowEditor />
    </ReactFlowProvider>
  );
}

import { useContext, useState } from "react";
import { FlowContext } from "../context/FlowContext";

export default function Sidebar() {
  const {edges, nodes, setEdges, setNodes, isCircuitComplete} = useContext(FlowContext);
  const[R, setR] = useState(1)
  const[U, setU] = useState(0)
  return (
    <div className="w-[200px] p-[10px] border-r-[1px] border-[#ccc]">
      <div
        draggable
        onDragStart={(event) =>
          event.dataTransfer.setData("application/reactflow", "resistor")
        }
        className="p-[10px] bg-[#e2e8f0] mb-[10px] cursor-grab rounded-[5px]"
      >
        Resistor
      </div>
      <div
        draggable
        onDragStart={(event) =>
          event.dataTransfer.setData("application/reactflow", "battery")
        }
        className="p-[10px] bg-[#e2e8f0] mb-[10px] cursor-grab rounded-[5px]"
      >
        Battery
      </div>
      <div
        className="p-[10px] bg-[#e2e8f0] mb-[10px] rounded-[5px]"
        onClick={()=>{if(isCircuitComplete(nodes, edges)){fetch("http://127.0.0.1:8000/api/calc",{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({nodes: nodes, edges: edges})
        }).then((res) => res.json()).then((res) => setR(res.totalResistance)).then(() => setU(() => {let bn = nodes.find((node) => node.type === "battery"); return bn.data.value}))}}}
      >
        Calculate
      </div>
      <div
        className="p-[10px] bg-[#e2e8f0] mb-[10px] rounded-[5px]"
      >
        I = {Number(U/R).toFixed(2)}A
      </div>
    </div>
  );
}

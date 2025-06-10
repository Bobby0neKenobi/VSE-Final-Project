import { useContext, useEffect, useState } from "react";
import { Handle, Position } from "reactflow";
import { FlowContext } from "../../context/FlowContext";

export default function ResistorNode({ data, selected, id }) {
  const [value, setValue] = useState(data.value || 100);
  const { direction } = data;
  const { setNodes, setEdges, setSelectedElements } = useContext(FlowContext);

  return (
    <div
      className={
        !selected
          ? "relative p-[10px] border-2 border-[#4a5568] rounded-[5px] bg-[#f7fafc] min-w-[120px] text-center"
          : "relative p-[10px] border-2 border-[#000] rounded-[5px] bg-[#e5e6e8] min-w-[120px] text-center"
      }
    >
      <strong>Resistor</strong>
      <div className="mt-[6px]"
        onClick={() => {setSelectedElements({nodes: [], edges: []})}}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(Math.max(1, Number(e.target.value)))}
          className="w-[60px] p-[4px] text-[14px] mr-[4px] text-center"
        />
        Ω
      </div>
        <>
          <Handle
            id="lt"
            type="target"
            position={Position.Left}
            className="bg-[#555]"
          />
          <Handle
            id="ls"
            type="source"
            position={Position.Left}
            className="bg-[#555]"
          />
          <Handle
            id="rt"
            type="target"
            position={Position.Right}
            className="bg-[#555]"
          />
          <Handle
            id="rs"
            type="source"
            position={Position.Right}
            className="bg-[#555]"
          />
        </>
    </div>
  );
}

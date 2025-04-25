import { useState } from "react";
import { Handle, Position } from "reactflow";

export default function ResistorNode({ data, selected, id }) {
  const [value, setValue] = useState(data.value || 100);
  const { direction } = data

  return (
    <div
      className={
        !selected
          ? "relative p-[10px] border-2 border-[#4a5568] rounded-[5px] bg-[#f7fafc] min-w-[120px] text-center"
          : "relative p-[10px] border-2 border-[#000] rounded-[5px] bg-[#e5e6e8] min-w-[120px] text-center"
      }
    >
      <strong>Resistor</strong>
      <div className="mt-[6px]">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-[60px] p-[4px] text-[14px] mr-[4px] text-center"
        />
        Ω
      </div>
      {selected && (
        <div
          className="absolute -top-4 -left-4 z-10 text-xs bg-slate-600 text-white px-2 py-1 rounded-4xl shadow-md"
          style={
            direction
              ? { right: "-35px", top: "35%" }
              : { top: "-35px", right: "42%" }
          }
        >
          <button
            onClick={() => {
              data.setNodes((nodes) =>
                nodes.map((node) =>
                  node.id === id
                    ? {
                        ...node,
                        data: { ...node.data, direction: !direction },
                      }
                    : node
                )
              );
            }}
            style={{
              backgroundColor: "#e5e6e8",
              borderColor: "black",
              padding: "0",
              paddingRight: "4px",
              paddingLeft: "4px",
              borderRadius: "100%",
            }}
          >
            ↻
          </button>
        </div>
      )}
      <Handle
        id="1"
        type="target"
        position={direction ? Position.Top : Position.Left}
        className="bg-[#555]"
      />
      <Handle
        id="2"
        type="source"
        position={direction ? Position.Top : Position.Left}
        className="bg-[#555]"
      />
      <Handle
        id="3"
        type="target"
        position={direction ? Position.Bottom : Position.Right}
        className="bg-[#555]"
      />
      <Handle
        id="4"
        type="source"
        position={direction ? Position.Bottom : Position.Right}
        className="bg-[#555]"
      />
    </div>
  );
}

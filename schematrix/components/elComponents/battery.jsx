import { useEffect, useState } from "react";
import { Handle, Position } from "reactflow";

export default function BatteryNode({ data, selected, id }) {
  const [value, setValue] = useState(data.value || 100);
  const { direction } = data;

  useEffect(() => {
    setTimeout(() => {
      data.setEdges((edges) =>
        edges.map((edge) => {
          let newSourceHandle = edge.sourceHandle;
          let newTargetHandle = edge.targetHandle;

          if (edge.source === id) {
            newSourceHandle = direction
              ? edge.sourceHandle === "rs"
                ? "bs"
                : "ts"
              : edge.sourceHandle === "ts"
              ? "ls"
              : "rs";
          }

          if (edge.target === id) {
            newTargetHandle = direction
              ? edge.targetHandle === "rt"
                ? "bt"
                : "tt"
              : edge.targetHandle === "tt"
              ? "lt"
              : "rt";
          }

          return {
            ...edge,
            sourceHandle: newSourceHandle,
            targetHandle: newTargetHandle,
          };
        })
      );
    }, 1000);
  }, [direction]);

  return (
    <div
      className={
        !selected
          ? "relative p-[10px] border-2 border-[#4a5568] rounded-[5px] bg-[#f7fafc] min-w-[120px] text-center"
          : "relative p-[10px] border-2 border-[#000] rounded-[5px] bg-[#e5e6e8] min-w-[120px] text-center"
      }
    >
      <strong>Battery</strong>
      <div className="mt-[6px]">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-[60px] p-[4px] text-[14px] mr-[4px] text-center"
        />
        V
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
      {direction ? (
        <>
          <Handle
            id="tt"
            type="target"
            position={Position.Top}
            className="bg-[#555]"
          />
          <Handle
            id="ts"
            type="source"
            position={Position.Top}
            className="bg-[#555]"
          />
          <Handle
            id="bt"
            type="target"
            position={Position.Bottom}
            className="bg-[#555]"
          />
          <Handle
            id="bs"
            type="source"
            position={Position.Bottom}
            className="bg-[#555]"
          />
        </>
      ) : (
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
      )}
    </div>
  );
}

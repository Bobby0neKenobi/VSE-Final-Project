export default function Sidebar() {
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
    </div>
  );
}

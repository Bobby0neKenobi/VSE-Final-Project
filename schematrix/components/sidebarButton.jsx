import { Controls } from "reactflow";

export default function SidebarButton({ setShowSidebar }) {
  return (
    <Controls
      position="top-left"
      showZoom={false}
      showFitView={false}
      showInteractive={false}
      style={{ borderRadius: "8px" }}
    >
      <button
        onClick={() => setShowSidebar((prev) => !prev)}
        className="bg-[#FFF] hover:bg-[#f3f3f3]"
      >
        |||
      </button>
    </Controls>
  );
}

import { Controls } from "reactflow";

export default function SidebarButton({ setShowSidebar }) {
  return (
    <Controls
      position="top-left"
      showZoom={false}
      showFitView={false}
      showInteractive={false}
    >
      <button
        onClick={() => setShowSidebar((prev) => !prev)}
        className="rounded-4xl"
      >
        |||
      </button>
    </Controls>
  );
}

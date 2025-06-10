import { Controls } from "reactflow";

export default function SaveButton({ save }) {
  return (
    <Controls
      position="bottom-right"
      showZoom={false}
      showFitView={false}
      showInteractive={false}
      style={{ borderRadius: "8px" }}
    >
      <button onClick={() => save()} className="bg-[#FFF] hover:bg-[#f3f3f3]">
        Save
      </button>
    </Controls>
  );
}

import { useNavigate } from "react-router-dom";
import { Controls } from "reactflow";

export default function HomeButton() {
  const navigate = useNavigate();
  return (
    <Controls
      position="top-right"
      showZoom={false}
      showFitView={false}
      showInteractive={false}
      style={{ borderRadius: "8px" }}
    >
      <button
        onClick={() => navigate("/dashboard")}
        className="bg-[#FFF] hover:bg-[#f3f3f3]"
      >
        🏠︎
      </button>
    </Controls>
  );
}

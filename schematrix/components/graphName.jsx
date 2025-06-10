import { useState } from "react";
import { Controls } from "reactflow";

export default function GraphName({ name, setName, setSelectedElements }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(name);

  const handleBlur = () => {
    setIsEditing(false);
    if (value !== name) {
      setName(value);
    }
  };
  return (
    <Controls
      position="top-center"
      showZoom={false}
      showFitView={false}
      showInteractive={false}
      style={{ borderRadius: "8px", padding: "8px", background: "white" }}
    >
      {isEditing ? (
        <input
          value={value}
          autoFocus
          onBlur={handleBlur}
          onClick={() => console.log(0)}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleBlur();
            }
          }}
          style={{
            fontSize: "1rem",
            padding: "4px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            outline: "none",
          }}
        />
      ) : (
        <div
          onClick={() => {
            setIsEditing(true);
            setSelectedElements({ nodes: [], edges: [] });
          }}
          style={{
            cursor: "pointer",
            fontSize: "1rem",
            padding: "4px 8px",
          }}
        >
          {value}
        </div>
      )}
    </Controls>
  );
}

import GraphCard from "./graphCard";

export default function GraphGrid({ graphList }) {
    const reversedGraphs = [...graphList].reverse();
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "1rem",
        padding: "2rem",
        maxWidth: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {reversedGraphs.map((graph) => {
        console.log(graph.data.edges);
        return (
          <GraphCard
            key={graph.id}
            id={graph.id}
            name={graph.name}
            nodes={graph.data.nodes}
            edges={graph.data.edges}
            snapshot = {graph.data.snapshot}
          />
        );
      })}
    </div>
  );
}

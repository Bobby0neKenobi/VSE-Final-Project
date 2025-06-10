import { useEffect, useState } from "react";
import Header from "../../components/header";
import GraphGrid from "../../components/graphGrid";
import { useNavigate } from "react-router-dom";

async function createGraph() {
  let access = localStorage.getItem("access token");

  let res = await fetch("http://127.0.0.1:8000/api/graph", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access}`,
    },
    body: JSON.stringify({
      name: "Flow Example",
      data: {
        nodes: [],
        edges: [],
        viewport: {
          x: 0,
          y: 0,
          zoom: 1,
        },
      },
    }),
  });

  if (res.status === 401) {
    const refresh = localStorage.getItem("refresh token");

    const refreshRes = await fetch("http://127.0.0.1:8000/api/token/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh }),
    });

    if (refreshRes.status === 400 || refreshRes.status === 401) {
      localStorage.removeItem("access token");
      localStorage.removeItem("refresh token");
      navigate("/");
    }

    const refreshData = await refreshRes.json();

    if (refreshData.access) {
      localStorage.setItem("access token", refreshData.access);

      res = await fetch("http://127.0.0.1:8000/api/graph", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({
          name: "Flow Example",
          data: {
            nodes: [],
            edges: [],
            viewport: {
              x: 0,
              y: 0,
              zoom: 1,
            },
          },
        }),
      });
    } else {
      console.error("Refresh token invalid or expired");
    }
  } 
  return await res.json();
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [graphData, setGraphData] = useState([]);
  useEffect(() => {
    async function getGraphData() {
      let access = localStorage.getItem("access token");

      let res = await fetch("http://127.0.0.1:8000/api/graph", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });

      if (res.status === 401) {
        const refresh = localStorage.getItem("refresh token");

        const refreshRes = await fetch(
          "http://127.0.0.1:8000/api/token/refresh",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh }),
          }
        );

        if (refreshRes.status === 400 || refreshRes.status === 401) {
          localStorage.removeItem("access token");
          localStorage.removeItem("refresh token");
          console.log("Yes")
          navigate("/");
        }

        const refreshData = await refreshRes.json();

        if (refreshData.access) {
          localStorage.setItem("access token", refreshData.access);

          res = await fetch("http://127.0.0.1:8000/api/graph", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${refreshData.access}`,
            },
          });
        } else {
          console.error("Refresh token invalid or expired");
        }
      }

      if (res.ok) {
        const data = await res.json();
        setGraphData(data);
      }
    }

    getGraphData();
  }, []);
  console.log(graphData);
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        position: "relative",
      }}
    >
      <Header page="/dashboard" />
      <button
        type="button"
        style={{
          borderStyle: "solid",
          borderColor: "black",
          borderWidth: "1px",
          borderRadius: "50%",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          width: "3rem",
          height: "3rem",
          background: "#FFF",
          position: "fixed",
          top: "6rem",
          left: "0.75rem",
          zIndex: 1000,
          fontSize: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => {
          createGraph().then((res) => {
            navigate('/canvas', {state: {id: res.id, name: res.name, initialEdges: res.data.edges, initialNodes: res.data.nodes}})
          });
        }}
      >
        {" "}
        +{" "}
      </button>
      <div
        style={{
          paddingTop: "5.5rem",
          width: "100%",
          backgroundColor: "#FFF",
        }}
      >
        <GraphGrid graphList={graphData} />
      </div>
    </div>
  );
}

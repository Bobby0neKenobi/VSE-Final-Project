import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header({ page }) {
  let logedin = localStorage.getItem("access token");
  const [userPic, setUserPic] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    async function getUserPic() {
      let access = localStorage.getItem("access token");

      let res = await fetch("http://127.0.0.1:8000/api/user", {
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
          navigate("/");
        }

        const refreshData = await refreshRes.json();

        if (refreshData.access) {
          localStorage.setItem("access token", refreshData.access);
          res = await fetch("http://127.0.0.1:8000/api/user", {
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
        setUserPic(data.profile_image);
      }
    }

    if (logedin) {
      getUserPic();
    }
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
        width: "100%",
        boxSizing: "border-box",
        height: "5rem",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: "2%",
        paddingRight: "2%",
      }}
      className="bg-gradient-to-r from-[#0F0] to-[#00F]"
    >
      <div>
        <img src="./logo.png" style={{ height: "3.5rem", width: "3.5rem" }} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "5%",
          paddingRight: "3%",
        }}
      >
        {logedin ? (
          <>
            <button
              type="button"
              className={
                page === "/"
                  ? "bg-[#0F0] transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                  : "bg-[#257DD6] transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-[#0F0]"
              }
              onClick={() => navigate("/")}
            >
              Home
            </button>
            <button
              type="button"
              className={
                page === "/dashboard"
                  ? "bg-[#0F0] transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                  : "bg-[#257DD6] transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-[#0F0]"
              }
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>

            <img
              src={
                userPic
                  ? `http://127.0.0.1:8000${userPic}`
                  : "./profileImage.jpg"
              }
              style={{
                height: "50px",
                width: "50px",
                borderColor: "#000",
                borderWidth: "1px",
                borderStyle: "solid",
                borderRadius: "50%",
              }}
              className="hover:opacity-[90%]"
              onClick={() => {
                navigate("/userdetails");
              }}
            />
          </>
        ) : (
          <button
            type="button"
            className="bg-[#257DD6] transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-[#0F0]"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}

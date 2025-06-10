import { useEffect, useState } from "react";
import Header from "../../components/header";
import { useNavigate } from "react-router-dom";

async function edit(data) {
  let access = localStorage.getItem("access token");

  const formData = new FormData();
  formData.append("username", data.username);
  formData.append("password", data.password);
  if (data.profile_image) {
    formData.append("profile_image", data.profile_image);
  }

  let res = await fetch("http://127.0.0.1:8000/api/user", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${access}`,
    },
    body: formData,
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

      res = await fetch("http://127.0.0.1:8000/api/user", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${access}`,
        },
        body: formData,
      });
    } else {
      console.error("Refresh token invalid or expired");
    }
  }
  return res.json();
}

export default function UserData() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    async function getUserData() {
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
        setUserData(data);
      }
    }

    getUserData();
  }, []);
  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <Header />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "10rem",
        }}
      >
        {userData && (
          <img
            src={
              userData.profile_image
                ? `http://127.0.0.1:8000${userData.profile_image}`
                : "./profileImage.jpg"
            }
            style={{
              width: "10rem",
              height: "10rem",
              borderColor: "#000",
              borderWidth: "1px",
              borderStyle: "solid",
              borderRadius: "50%",
            }}
          />
        )}
        <h1>{userData ? `Welcome, ${userData.username}` : "Loading..."}</h1>
        <button
          className="mt-[3rem] bg-[#257DD6] transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-[#0F0]"
          onClick={() => setShowModal(true)}
        >
          Edit Details
        </button>
        <button
          className="mt-[3rem] bg-[#F55] transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-[#0F0]"
          onClick={() => {
            localStorage.removeItem("access token");
            localStorage.removeItem("refresh token");
            navigate("/");
          }}
        >
          Sign Out
        </button>
      </div>
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "1rem",
              minWidth: "300px",
              maxWidth: "90%",
              boxShadow: "0 0 20px rgba(0,0,0,0.2)",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: "0.5rem",
                right: "0.75rem",
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                borderRadius: "50%",
                outline: "none",
              }}
            >
              &times;
            </button>
            <h1 className="h-[4rem] text-transparent bg-clip-text bg-gradient-to-r from-[#0F0] to-[#00F] text-center">
              Edit Details
            </h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const username = e.target.username.value;
                const password = e.target.password.value;
                const profile_image = e.target.profile_image.files[0];
                const data = { username, password, profile_image };
                edit(data).then((data) => {
                  console.log(data);
                  if (data.id) {
                    navigate(0);
                  } else if (data.username) {
                    setError("Username already exists.");
                  } else {
                    setError("Something went wrong. Please try again.");
                  }
                });
              }}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <input
                name="username"
                placeholder="Username"
                defaultValue={userData.username}
                style={{
                  padding: "0.5rem",
                  borderRadius: "0.25rem",
                  border: "1px solid #ccc",
                }}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="new-password"
                style={{
                  padding: "0.5rem",
                  borderRadius: "0.25rem",
                  border: "1px solid #ccc",
                }}
              />
              <input type="file" name="profile_image" />
              {error && (
                <div
                  style={{
                    backgroundColor: "#FEE2E2",
                    color: "#B91C1C",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    border: "1px solid #FCA5A5",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {error}
                </div>
              )}
              <button
                type="submit"
                style={{
                  backgroundColor: "#0F0",
                  padding: "0.5rem",
                  borderRadius: "0.25rem",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  return (
    <form
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
      }}
      onSubmit={(e) => {
        e.preventDefault();
        const username = e.target.elements.user.value;
        const password = e.target.elements.password.value;
        fetch("http://127.0.0.1:8000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.access && data.refresh) {
              localStorage.setItem("access token", data.access);
              localStorage.setItem("refresh token", data.refresh);
              navigate("/");
            } else {
              setError("Invalid username or password");
            }
          })
          .catch(() => setError("Server error. Please try again."));
      }}
    >
      <div
        className="border-[5px] w-[70vh] h-fit rounded-[1rem] text-center"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <h1 className="h-[4rem] text-transparent bg-clip-text bg-gradient-to-r from-[#0F0] to-[#00F]">
          Sign in
        </h1>
        <label
          htmlFor="user"
          className="text-[1.25rem] text-transparent bg-clip-text bg-gradient-to-r from-[#0F0] to-[#00F]"
        >
          Username:
        </label>
        <br />
        <input type="text" id="user" className="mb-[3rem]" />
        <br />
        <label
          htmlFor="password"
          className="text-[1.25rem] text-transparent bg-clip-text bg-gradient-to-r from-[#0F0] to-[#00F]"
        >
          Password:
        </label>
        <br />
        <input type="password" id="password" />
        <br />
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "fit-content",
            marginBottom: "3rem",
          }}
        >
          <button className="mt-[3rem] bg-[#257DD6] transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-[#0F0]">
            Sign in
          </button>
          <a href="/signup">Don't have an account?</a>
        </div>
      </div>
    </form>
  );
}

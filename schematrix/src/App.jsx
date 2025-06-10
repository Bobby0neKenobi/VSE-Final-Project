import "reactflow/dist/style.css";
import FlowEditor from "./screens/FlowEditor";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import StartingScreen from "./screens/StartingScreen";
import SignUp from "./screens/SignUp";
import SignIn from "./screens/SignIn";
import Dashboard from "./screens/Dashboard";
import UserData from "./screens/UserData";

export default function App() {
  return (
    <BrowserRouter className="h-screen">
      <Routes>
        <Route path="/" exact element={<StartingScreen />} />
        <Route path="/canvas" element={<FlowEditor />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/userdetails" element={<UserData />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

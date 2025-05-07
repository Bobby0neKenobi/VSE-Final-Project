

import "reactflow/dist/style.css";
import FlowEditor from "./screens/FlowEditor";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import StartingScreen from "./screens/StartingScreen";
import SignUp from "./screens/SignUp";

export default function App() {
  return (
    <BrowserRouter className='h-screen'>
      <Routes>
        <Route path='/' exact element={<StartingScreen/>}/>
        <Route path="/canvas"  element={<FlowEditor/>}/>
        <Route path="/signup"  element={<SignUp/>}/>
      </Routes>
    </BrowserRouter>
  );
}

import "./App.css";

import { BrowserRouter } from "react-router-dom";

import Sidebar from "./Components/Sidebar/SideBar";
import Router from "./Router/Router";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <div className="flex">
          <Sidebar />
          <Router />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

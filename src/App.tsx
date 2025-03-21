// src/App.tsx
import React, { useState, useEffect, useCallback } from "react";
import FlowEditor from "./components/FlowEditor";
import "reactflow/dist/style.css";
import "./App.css";

function App() {
  return (
    <div className="app">
      <div className="header">
        <h1>Flow Builder</h1>
      </div>
      <FlowEditor />
    </div>
  );
}

export default App;

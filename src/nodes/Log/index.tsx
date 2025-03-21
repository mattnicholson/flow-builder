// src/nodes/Log/index.tsx
import React from "react";
import { NodeDefinition, NodeProps } from "../../types/Node";

const LogNode: React.FC<NodeProps> = ({ id, data, inputs }) => {
  const logValue =
    inputs.input !== undefined ? JSON.stringify(inputs, null, 2) : "No input";

  return (
    <div className="node-content">
      <div className="log-output">{logValue}</div>
    </div>
  );
};

const nodeDefinition: NodeDefinition = {
  type: "log",
  name: "Log",
  category: "Output",
  inputs: [{ id: "input", type: "any", name: "Input", allowMultiple: true }],
  outputs: [{ id: "output", type: "any", name: "Output" }],
  component: LogNode,
  process: (inputs, state) => {
    console.log("process log", inputs, state);
    // No processing needed, just display the input
    return { output: inputs };
  },
};

export default nodeDefinition;

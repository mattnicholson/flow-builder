// src/nodes/Uppercase/index.tsx
import React from "react";
import { NodeDefinition, NodeProps } from "../../types/Node";

const UppercaseNode: React.FC<NodeProps> = ({ id, data, inputs }) => {
  return (
    <div className="node-content">
      <div className="log-output">{data.output ? data.output : "No input"}</div>
    </div>
  );
};

const nodeDefinition: NodeDefinition = {
  type: "uppercase",
  name: "Uppercase",
  category: "Output",
  inputs: [{ id: "input", type: "any", name: "Input" }],
  outputs: [{ id: "output", type: "any", name: "Output" }],
  component: UppercaseNode,
  process: (inputs, state) => {
    console.log("UPPERCASE", inputs.input);

    const value =
      inputs.input !== undefined
        ? inputs.input.toString().toUpperCase()
        : "No input";

    return { output: value };
  },
};

export default nodeDefinition;

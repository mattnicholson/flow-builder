// src/nodes/SetVariable/index.tsx
import React, { useState } from "react";
import { NodeDefinition, NodeProps } from "../../types/Node";

const SetVariableNode: React.FC<NodeProps> = ({
  id,
  data,
  inputs,
  onProcess,
}) => {
  const [value, setValue] = useState(data.value || "");

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    onProcess({ value: newValue });
  };

  return (
    <div className="node-content">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Enter value"
      />
    </div>
  );
};

const nodeDefinition: NodeDefinition = {
  type: "setVariable",
  name: "Set Variable",
  category: "Variables",
  inputs: [],
  outputs: [{ id: "output", type: "string", name: "Output" }],
  component: SetVariableNode,
  process: (inputs, state) => {
    // The output is just the current value
    return { output: state.value };
  },
};

export default nodeDefinition;

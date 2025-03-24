// src/nodes/Composition/index.tsx
import React, { useState } from "react";
import { NodeDefinition, NodeProps } from "../../types/Node";

const ImageNode: React.FC<NodeProps> = ({ id, data, inputs, onProcess }) => {
  return (
    <div className="node-content">
      <img
        src={data.output.source}
        alt="Composition"
        style={{ maxWidth: "100px" }}
      />
    </div>
  );
};

const nodeDefinition: NodeDefinition = {
  type: "media",
  name: "Image",
  category: "Source",
  inputs: [],
  outputs: [{ id: "output", type: "media", name: "Output" }],
  component: ImageNode,
  process: (inputs, state) => {
    // Return the state from the component...

    return { output: { type: "image", source: `/img/placeholder.jpg` } };
  },
};

export default nodeDefinition;

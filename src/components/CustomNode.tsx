// src/components/CustomNode.tsx
import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import { useSnapshot } from "valtio";
import { flowState, updateNodeData, getNodeInputs } from "../state/flowState";

const CustomNode = ({ id, data }) => {
  // Get the entire state snapshot
  const snap = useSnapshot(flowState);
  const nodeData = snap.nodeData[id] || {};
  const { definition } = data;

  // Check if the component exists before using it
  const NodeComponent = definition?.component;

  if (!NodeComponent) {
    console.error(`No component found for node ${id}`, definition);
    return <div className="custom-node error">Invalid Node Definition</div>;
  }

  const handleProcess = (newData) => {
    updateNodeData(id, newData);
  };

  // Get inputs for this node
  const nodeInputs = getNodeInputs(id);

  return (
    <div className="custom-node">
      <div className="node-header">{definition.name}</div>

      {/* Input Handles */}
      {definition.inputs.map((input) => (
        <Handle
          key={input.id}
          type="target"
          position={Position.Left}
          id={input.id}
          className={`input-handle ${input.type}`}
        />
      ))}

      {/* Node Content */}
      <NodeComponent
        id={id}
        data={nodeData}
        inputs={nodeInputs}
        onProcess={handleProcess}
      />

      {/* Output Handles */}
      {definition.outputs.map((output) => (
        <Handle
          key={output.id}
          type="source"
          position={Position.Right}
          id={output.id}
          className={`output-handle ${output.type}`}
        />
      ))}
    </div>
  );
};

export default memo(CustomNode);

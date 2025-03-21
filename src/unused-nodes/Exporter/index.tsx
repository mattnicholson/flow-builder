// src/nodes/Exporter/index.tsx
import React from "react";
import { NodeDefinition, NodeProps } from "../../types/Node";

const ExporterNode: React.FC<NodeProps> = ({ id, data, inputs, onProcess }) => {
  const handleExport = () => {
    if (!inputs.pixiOutput) return;

    const { app } = inputs.pixiOutput;

    // Create a temporary canvas to extract the image
    const canvas = document.createElement("canvas");
    canvas.width = app.view.width;
    canvas.height = app.view.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Extract the WebGL canvas data
    ctx.drawImage(app.view as HTMLCanvasElement, 0, 0);

    // Create download link
    const link = document.createElement("a");
    link.download = "flow-output.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="exporter-node">
      <button onClick={handleExport}>Export Image</button>
    </div>
  );
};

const nodeDefinition: NodeDefinition = {
  type: "exporter",
  name: "Exporter",
  category: "Output",
  inputs: [{ id: "pixiOutput", type: "pixiOutput", name: "Pixi Output" }],
  outputs: [],
  component: ExporterNode,
  process: () => ({}),
};

export default nodeDefinition;

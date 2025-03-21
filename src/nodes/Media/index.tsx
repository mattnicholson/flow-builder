// src/nodes/Composition/index.tsx
import React, { useState } from "react";
import { NodeDefinition, NodeProps } from "../../types/Node";
import { storeLocalMedia } from "../../utils/mediaStorage";

const MediaNode: React.FC<NodeProps> = ({ id, data, inputs, onProcess }) => {
  const [imageData, setImageData] = useState<string | null>(
    data.imageData || null
  );

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Store as blob URL for local access
      const blobUrl = await storeLocalMedia(file);
      setImageData(blobUrl);
      onProcess({ output: { type: "image", source: blobUrl } });
    }
  };

  return (
    <div className="node-content">
      {imageData ? (
        <img src={imageData} alt="Composition" style={{ maxWidth: "100px" }} />
      ) : (
        <input type="file" accept="image/*" onChange={handleFileUpload} />
      )}
    </div>
  );
};

const nodeDefinition: NodeDefinition = {
  type: "media",
  name: "Media",
  category: "Source",
  inputs: [],
  outputs: [{ id: "output", type: "media", name: "Output" }],
  component: MediaNode,
  process: (inputs, state) => {
    // Return the state from the component...

    return state;
  },
};

export default nodeDefinition;

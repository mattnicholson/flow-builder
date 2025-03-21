import React, { useEffect, useRef, useState } from "react";
import { NodeDefinition, NodeProps } from "../../types/Node";

// Utility function to scale the image to cover the canvas, considering the focal point
const getScaledDimensionsToCover = (
  imgWidth: number,
  imgHeight: number,
  canvasWidth: number,
  canvasHeight: number,
  focalPoint: { x: number; y: number }
) => {
  const widthScale = canvasWidth / imgWidth;
  const heightScale = canvasHeight / imgHeight;

  // Use the larger scale factor to ensure the image covers the canvas
  const scale = Math.max(widthScale, heightScale);

  // Calculate the scaled dimensions
  const scaledWidth = imgWidth * scale;
  const scaledHeight = imgHeight * scale;

  // Calculate the offset to center the focal point correctly
  const offsetX = (scaledWidth - canvasWidth) * focalPoint.x;
  const offsetY = (scaledHeight - canvasHeight) * focalPoint.y;

  return { scaledWidth, scaledHeight, offsetX, offsetY };
};

const CanvasNode: React.FC<NodeProps> = ({ id, data, inputs, onProcess }) => {
  const [canvasImageData, setCanvasImageData] = useState<string | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(600); // Default canvas width
  const [canvasHeight, setCanvasHeight] = useState(600); // Default canvas height
  const [focalPoint, setFocalPoint] = useState({ x: 0.5, y: 0.5 }); // Default focal point (center)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Store onProcess in a ref to avoid re-render issues
  const onProcessRef = useRef(onProcess);

  // Update ref value on prop change
  useEffect(() => {
    onProcessRef.current = onProcess;
  }, [onProcess]);

  const imageSource = inputs?.input?.source; // Get the image source URL from inputs
  const sourceDimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (imageSource && canvasRef.current) {
      const img = new Image();
      img.src = imageSource;

      img.onload = () => {
        const canvas = canvasRef.current;

        sourceDimensions.current = { width: img.width, height: img.height };

        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            // Set the canvas size based on the internal state width and height
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            // Get the scaled image dimensions and offsets based on the focal point
            const { scaledWidth, scaledHeight, offsetX, offsetY } =
              getScaledDimensionsToCover(
                img.width,
                img.height,
                canvasWidth,
                canvasHeight,
                focalPoint
              );

            // Clear any previous drawing on canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw the image onto the canvas with the correct offsets and scaling
            ctx.drawImage(img, -offsetX, -offsetY, scaledWidth, scaledHeight);

            // Extract image data from the canvas (base64 data URL)
            const canvasData = canvas.toDataURL();
            setCanvasImageData(canvasData);

            // Call the stored onProcess function via the ref to pass the image data
            onProcessRef.current({
              output: { type: "image", source: canvasData },
            });
          }
        }
      };
    }
  }, [imageSource, canvasWidth, canvasHeight, focalPoint]);

  // Handlers for updating width, height, and focal point
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCanvasWidth(parseInt(e.target.value, 10));
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCanvasHeight(parseInt(e.target.value, 10));
  };

  const handleFocalPointXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFocalPoint((prev) => ({ ...prev, x: parseFloat(e.target.value) }));
  };

  const handleFocalPointYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFocalPoint((prev) => ({ ...prev, y: parseFloat(e.target.value) }));
  };

  const handleDownloadJPG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9); // 0.9 for high quality

    // Create a link to trigger download
    const link = document.createElement("a");
    link.href = imageDataUrl;
    link.download = "canvas-image.jpg";
    link.click();
  };

  const sourceOrientation =
    sourceDimensions.width < sourceDimensions.height ? "portrait" : "landscape";
  const canvasOrientation =
    canvasWidth < canvasHeight ? "portrait" : "landscape";

  return (
    <div>
      {/* Display canvas image */}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      {canvasImageData && (
        <div
          style={{
            aspectRatio: "1/1",
            position: "relative",
            background: "#DDD",
          }}
        >
          <img
            width={canvasOrientation === "landscape" ? "90%" : "auto"}
            height={canvasOrientation === "landscape" ? "auto" : "90%"}
            style={{
              maxWidth: "180px",
              maxHeight: "180px",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              border: "1px solid black",
              boxShadow: "0 0 5px rgba(0,0,0,0.2)",
              display: "block",
            }}
            src={canvasImageData}
            alt="Canvas Output"
          />
        </div>
      )}

      {/* Controls for customizing canvas width, height, and focal point */}
      <div style={{ padding: "10px" }}>
        <label>
          Width:
          <input
            type="number"
            value={canvasWidth}
            min="100"
            onChange={handleWidthChange}
          />
        </label>
        <br />
        <label>
          Height:
          <input
            type="number"
            value={canvasHeight}
            min="100"
            onChange={handleHeightChange}
          />
        </label>
        <br />
        <label>
          Focal Point X:
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={focalPoint.x}
            onChange={handleFocalPointXChange}
          />
          {focalPoint.x}
        </label>
        <br />
        <label>
          Focal Point Y:
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={focalPoint.y}
            onChange={handleFocalPointYChange}
          />
          {focalPoint.y}
        </label>
        <button
          onClick={handleDownloadJPG}
          style={{
            padding: "8px 12px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          📸 Download as JPG
        </button>
      </div>
    </div>
  );
};

const nodeDefinition: NodeDefinition = {
  type: "canvas",
  name: "Canvas",
  category: "Output",
  inputs: [{ id: "input", type: "media", name: "Input" }],
  outputs: [{ id: "output", type: "media", name: "Output" }],
  component: CanvasNode,
  process: (inputs, state) => {
    return { output: state.output }; // Return the output from the state
  },
};

export default nodeDefinition;

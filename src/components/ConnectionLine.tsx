// src/components/ConnectionLine.tsx
import React from "react";
import { ConnectionLineComponentProps, getBezierPath } from "reactflow";

const ConnectionLine = ({
  fromX,
  fromY,
  fromPosition,
  toX,
  toY,
  toPosition,
}: ConnectionLineComponentProps) => {
  const [edgePath] = getBezierPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: toX,
    targetY: toY,
    targetPosition: toPosition,
  });

  return (
    <g>
      <path
        fill="none"
        stroke="#222"
        strokeWidth={1.5}
        className="animated"
        d={edgePath}
      />
      <path
        fill="none"
        stroke="#fff"
        strokeWidth={1.5}
        strokeDasharray="5,5"
        className="animated"
        d={edgePath}
        style={{ animation: "dashdraw 0.5s linear infinite" }}
      />
    </g>
  );
};

export default ConnectionLine;

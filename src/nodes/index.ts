// src/nodes/index.ts
const nodeModules = import.meta.glob("./*/index.{ts,tsx}", { eager: true });

export const loadNodes = () => {
  const nodes = {};

  for (const path in nodeModules) {
    const nodeName = path.split("/")[1];
    nodes[nodeName] = nodeModules[path].default;
  }

  return nodes;
};

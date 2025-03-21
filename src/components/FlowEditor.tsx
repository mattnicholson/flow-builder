// src/components/FlowEditor.tsx
import React, { useCallback, useEffect } from "react";
import ReactFlow, {
  Controls,
  Background,
  addEdge,
  Connection,
  Edge,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { useSnapshot } from "valtio";

import { loadNodes } from "../nodes";
import CustomNode from "./CustomNode";
import ConnectionLine from "./ConnectionLine";
import {
  flowState,
  processFlow,
  addNodeToFlow,
  applyChangesToNodes,
  applyChangesToEdges,
} from "../state/flowState";

const nodeTypes = {
  customNode: CustomNode,
};

const FlowEditor = () => {
  const snap = useSnapshot(flowState);
  const availableNodes = loadNodes();

  // Ensure state is initialized only once
  useEffect(() => {
    if (!flowState._initialized) {
      //("Initializing flow state for the first time");
      flowState._initialized = true;
    }
  }, []);

  // Debug log to monitor state changes
  useEffect(() => {
    /*console.log("SNAPSHOT updated:", {
      nodeCount: snap.nodes.length,
      nodeIds: snap.nodes.map((n) => n.id),
    });*/
  }, [snap.nodes.length]);

  const addNode = (type: string) => {
    const nodeDefinition = availableNodes[type];

    if (!nodeDefinition) {
      console.error(`Node definition not found for type: ${type}`);
      return;
    }

    // Generate a unique ID
    const newNodeId = `node_${Date.now()}`;

    // Create the node
    const newNode = {
      id: newNodeId,
      type: "customNode",
      position: {
        x: 100 + ((snap.nodes.length * 20) % 300),
        y: 100 + ((snap.nodes.length * 20) % 200),
      },
      draggable: true,
      data: {
        definition: nodeDefinition,
      },
    };

    console.log("Adding new node:", newNode);

    // Use the helper function to safely add the node
    addNodeToFlow(newNode);
  };

  const onConnect = useCallback(
    (params: Connection) => {
      // Validate connection types before adding edge
      const sourceNode = snap.nodes.find((n) => n.id === params.source);
      const targetNode = snap.nodes.find((n) => n.id === params.target);

      if (
        !sourceNode ||
        !targetNode ||
        !params.sourceHandle ||
        !params.targetHandle
      ) {
        return;
      }

      const sourceOutput = sourceNode.data.definition.outputs.find(
        (o) => o.id === params.sourceHandle
      );

      const targetInput = targetNode.data.definition.inputs.find(
        (i) => i.id === params.targetHandle
      );

      if (!sourceOutput || !targetInput) {
        return;
      }

      // Check if types are compatible
      if (
        sourceOutput.type === targetInput.type ||
        targetInput.type.match("any")
      ) {
        // Check if multiple connections are allowed for this input
        if (!targetInput.allowMultiple) {
          // Remove any existing connections to this input
          const updatedEdges = snap.edges.filter(
            (e) =>
              !(
                e.target === params.target &&
                e.targetHandle === params.targetHandle
              )
          );
          flowState.edges = addEdge(params, updatedEdges);
        } else {
          flowState.edges = addEdge(params, snap.edges);
        }

        // Process the flow after connection changes
        processFlow();
      }
    },
    [snap.nodes, snap.edges]
  );

  const onNodesChange = useCallback((changes) => {
    // Use our safe method instead of directly applying changes
    applyChangesToNodes(changes);
  }, []);

  const onEdgesChange = useCallback((changes) => {
    // Use our safe method instead of directly applying changes
    applyChangesToEdges(changes);
  }, []);

  return (
    <div style={{ height: "calc(100vh - 60px)", width: "100%" }}>
      <div className="node-palette">
        {Object.keys(availableNodes).map((nodeType) => (
          <button
            key={nodeType}
            onClick={() => addNode(nodeType)}
            className="node-palette-item"
          >
            {availableNodes[nodeType].name}
          </button>
        ))}
      </div>

      <ReactFlow
        nodes={snap.nodes}
        edges={snap.edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionLineComponent={ConnectionLine}
        fitView={false}
      >
        <Controls />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default FlowEditor;

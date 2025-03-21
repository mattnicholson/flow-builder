// src/state/flowState.ts
import { proxy, subscribe } from "valtio";
import {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";

// Define the flow state
export const flowState = proxy({
  nodes: [] as Node[],
  edges: [] as Edge[],
  nodeData: {} as Record<string, any>,
  _initialized: false,
  _pendingNodeAdditions: false,
});

// Apply node changes safely
export const applyChangesToNodes = (changes: NodeChange[]) => {
  // Skip applying changes if we have pending node additions
  // This prevents ReactFlow from accidentally removing our newly added nodes
  if (flowState._pendingNodeAdditions) {
    console.log("Skipping node changes due to pending additions");
    flowState._pendingNodeAdditions = false;
    return;
  }

  const updatedNodes = applyNodeChanges(changes, flowState.nodes);
  flowState.nodes = updatedNodes;
};

// Apply edge changes safely
export const applyChangesToEdges = (changes: EdgeChange[]) => {
  const updatedEdges = applyEdgeChanges(changes, flowState.edges);
  flowState.edges = updatedEdges;

  // Process flow after edge changes
  processFlow();
};

// Make sure this function is properly exported
export const updateNodeData = (nodeId: string, data: any) => {
  flowState.nodeData[nodeId] = {
    ...flowState.nodeData[nodeId],
    ...data,
  };

  // Trigger processing of this node and downstream nodes
  processNode(nodeId);
};

// Add a node safely
export const addNodeToFlow = (node: Node) => {
  console.log("Adding node to flow:", node.id);
  // Set the flag to prevent immediate removal during next render cycle
  flowState._pendingNodeAdditions = true;

  // Use spread to create a new array reference which will trigger reactivity
  flowState.nodes = [...flowState.nodes, node];

  // Initialize node data
  flowState.nodeData[node.id] = {};
};

// Process a single node
export const processNode = (nodeId: string) => {
  const node = flowState.nodes.find((n) => n.id === nodeId);
  if (!node) return;

  // Get input values from connected nodes
  const inputs = getNodeInputs(nodeId);

  // Get the node definition and call its process function
  const nodeDefinition = node.data.definition;
  if (nodeDefinition && typeof nodeDefinition.process === "function") {
    const result = nodeDefinition.process(
      inputs,
      flowState.nodeData[nodeId] || {}
    );

    console.log("PROCESSED", node, result);

    // Update the node's output data
    flowState.nodeData[nodeId] = {
      ...flowState.nodeData[nodeId],
      ...result,
    };

    // Process all downstream nodes
    const downstreamNodeIds = getDownstreamNodes(nodeId);
    downstreamNodeIds.forEach((id) => processNode(id));
  }
};

// Helper to get inputs for a node
export const getNodeInputs = (nodeId: string) => {
  const inputs: Record<string, any> = {};

  // Find all edges targeting this node
  flowState.edges
    .filter((edge) => edge.target === nodeId)
    .forEach((edge) => {
      const sourceNodeData = flowState.nodeData[edge.source] || {};
      if (edge.sourceHandle && edge.targetHandle) {
        inputs[edge.targetHandle] = sourceNodeData[edge.sourceHandle];
      }
    });

  return inputs;
};

// Get all nodes that receive output from the given node
export const getDownstreamNodes = (nodeId: string): string[] => {
  return flowState.edges
    .filter((edge) => edge.source === nodeId)
    .map((edge) => edge.target);
};

// Process the entire flow
export const processFlow = () => {
  // Find nodes without inputs (starting nodes)
  const startNodeIds = findStartNodes();

  // Process each starting node
  startNodeIds.forEach((nodeId) => processNode(nodeId));
};

// Find nodes without inputs
export const findStartNodes = (): string[] => {
  const nodesWithInputs = new Set(flowState.edges.map((edge) => edge.target));

  return flowState.nodes
    .filter((node) => !nodesWithInputs.has(node.id))
    .map((node) => node.id);
};

// Debug subscription to monitor state changes
subscribe(flowState, () => {
  /*console.log("Flow state updated:", {
    nodeCount: flowState.nodes.length,
    edgeCount: flowState.edges.length,
    nodeDataKeys: Object.keys(flowState.nodeData),
  });*/
});

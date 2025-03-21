// src/types/Node.ts
export interface Port {
  id: string;
  type: string;
  name: string;
  allowMultiple?: boolean;
  data?: any;
}

export interface NodeDefinition {
  type: string;
  name: string;
  category: string;
  inputs: Port[];
  outputs: Port[];
  component: React.FC<NodeProps>;
  process: (inputs: Record<string, any>) => Record<string, any>;
}

export interface NodeProps {
  id: string;
  data: any;
  inputs: Record<string, any>;
  onProcess: (outputs: Record<string, any>) => void;
}

// src/nodes/Effects/index.tsx
import React from "react";
import { NodeDefinition, NodeProps } from "../../types/Node";

const EffectsNode: React.FC<NodeProps> = ({ id, data, inputs, onProcess }) => {
  const [effectType, setEffectType] = useState(data.effectType || "grayscale");

  useEffect(() => {
    const compositions = inputs.compositions || [];

    // Apply effect to all input compositions
    const processedCompositions = compositions.map((comp) => {
      // Deep clone to avoid modifying original
      const newComp = JSON.parse(JSON.stringify(comp));

      // Apply the selected effect
      newComp.effects = newComp.effects || [];
      newComp.effects.push(effectType);

      return newComp;
    });

    onProcess({ composition: processedCompositions });
  }, [inputs.compositions, effectType]);

  return (
    <div className="node-content">
      <select
        value={effectType}
        onChange={(e) => setEffectType(e.target.value)}
      >
        <option value="grayscale">Grayscale</option>
        <option value="blur">Blur</option>
        <option value="invert">Invert</option>
        <option value="sepia">Sepia</option>
      </select>
    </div>
  );
};

const nodeDefinition: NodeDefinition = {
  type: "effects",
  name: "Effects",
  category: "Processing",
  inputs: [
    {
      id: "compositions",
      type: "composition",
      name: "Compositions",
      allowMultiple: true,
    },
  ],
  outputs: [{ id: "composition", type: "composition", name: "Output" }],
  component: EffectsNode,
  process: (inputs) => {
    return { composition: inputs.processedCompositions };
  },
};

export default nodeDefinition;

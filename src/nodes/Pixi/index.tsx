// src/nodes/Composition/index.tsx
import React, { useState, useRef } from "react";
import { NodeDefinition, NodeProps } from "../../types/Node";
import { Stage } from "./src/pixi/stage/";
import { Sprite } from "./src/pixi/components/Sprite.jsx";
import { Container } from "./src/pixi/components/Container.jsx";
import { Filter } from "./src/pixi/filters/Filter.jsx";

const PixiNode: React.FC<NodeProps> = ({ id, data, inputs, onProcess }) => {
  const apiRef = useRef();

  return (
    <div className="node-content">
      <div class="node--pixi">
        <button class="save" onClick={() => apiRef.current.downloadFrame()}>
          Save
        </button>
        <div class="stage">
          <Stage
            debug={true}
            onInit={(api) => {
              apiRef.current = api;
            }}
          >
            <Container>
              {inputs?.input?.source && (
                <Sprite tint={0xffe45b} image={inputs.input.source} />
              )}
              <Sprite mask image={"/img/pixi/pill-white.png"} />
              <Filter type="noise" noise={1} seed={2} />
            </Container>
          </Stage>
        </div>
      </div>
    </div>
  );
};

const nodeDefinition: NodeDefinition = {
  type: "pixi",
  name: "PixiRender",
  category: "PIXI",
  inputs: [{ id: "input", type: "any", name: "Input", allowMultiple: true }],
  outputs: [{ id: "output", type: "pixi", name: "Output" }],
  component: PixiNode,
  process: (inputs, state) => {
    // Return the state from the component...

    return state;
  },
};

export default nodeDefinition;

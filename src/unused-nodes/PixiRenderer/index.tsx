// src/nodes/PixiRenderer/index.tsx
import React, { useRef, useEffect } from "react";
import * as PIXI from "pixi.js";
import { NodeDefinition, NodeProps } from "../../types/Node";

const PixiRendererNode: React.FC<NodeProps> = ({
  id,
  data,
  inputs,
  onProcess,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize PIXI application
    if (!appRef.current) {
      appRef.current = new PIXI.Application({
        width: 400,
        height: 300,
        backgroundColor: 0x1099bb,
        antialias: true,
      });

      canvasRef.current.appendChild(appRef.current.view as HTMLCanvasElement);
    }

    // Clear stage
    while (appRef.current.stage.children[0]) {
      appRef.current.stage.removeChild(appRef.current.stage.children[0]);
    }

    // Render compositions
    const compositions = inputs.compositions || [];
    compositions.forEach((comp: any, index: number) => {
      if (comp.type === "image" && comp.source) {
        const sprite = PIXI.Sprite.from(comp.source);
        sprite.width = 100;
        sprite.height = 100;
        sprite.x = index * 20; // Offset each sprite slightly
        sprite.y = index * 20;

        // Apply effects if any
        if (comp.effects && comp.effects.length > 0) {
          comp.effects.forEach((effect: string) => {
            switch (effect) {
              case "grayscale":
                const grayFilter = new PIXI.ColorMatrixFilter();
                grayFilter.grayscale(0.8);
                sprite.filters = sprite.filters || [];
                sprite.filters.push(grayFilter);
                break;
              case "blur":
                const blurFilter = new PIXI.BlurFilter();
                blurFilter.blur = 5;
                sprite.filters = sprite.filters || [];
                sprite.filters.push(blurFilter);
                break;
              case "invert":
                const invertFilter = new PIXI.ColorMatrixFilter();
                invertFilter.negative();
                sprite.filters = sprite.filters || [];
                sprite.filters.push(invertFilter);
                break;
              case "sepia":
                const sepiaFilter = new PIXI.ColorMatrixFilter();
                sepiaFilter.sepia();
                sprite.filters = sprite.filters || [];
                sprite.filters.push(sepiaFilter);
                break;
            }
          });
        }

        appRef.current?.stage.addChild(sprite);
      }
    });

    // Export the rendering result
    const renderTexture = PIXI.RenderTexture.create({
      width: appRef.current.view.width,
      height: appRef.current.view.height,
    });

    appRef.current.renderer.render(appRef.current.stage, renderTexture);

    const pixiOutput = {
      app: appRef.current,
      texture: renderTexture,
    };

    onProcess({ output: pixiOutput });

    return () => {
      if (appRef.current) {
        renderTexture.destroy();
      }
    };
  }, [inputs.compositions]);

  return (
    <div className="pixi-renderer">
      <div ref={canvasRef} className="canvas-container"></div>
    </div>
  );
};

const nodeDefinition: NodeDefinition = {
  type: "pixiRenderer",
  name: "Pixi Renderer",
  category: "Output",
  inputs: [
    {
      id: "compositions",
      type: "composition",
      name: "Compositions",
      allowMultiple: true,
    },
  ],
  outputs: [{ id: "output", type: "pixiOutput", name: "Output" }],
  component: PixiRendererNode,
  process: (inputs) => {
    return { output: inputs.pixiOutput };
  },
};

export default nodeDefinition;

import React, { useRef, useState, useEffect, useImperativeHandle } from "react";
import * as PIXI from "pixi.js";

import { withPixiApp } from "../stage/provider.jsx";
import { useMount, useUnmount } from "react-use";
import { If } from "../utils/If.jsx";

// Manually add other blend modes as filters eg shaders:
// https://godotshaders.com/snippet/blending-modes/

// Or off screen canvas blending 2 precomposed layers?

const ContainerChildren = (props) => {
  var children = React.Children.map(props.children, (child, ix) => {
    if (!child) return null;
    // Update the root context for this element
    return React.cloneElement(child, {
      root: props.root,
      index: ix,
    });
  });

  return <>{children}</>;
};

function PixiContainer(props, ref) {
  const _ref = useRef(new PIXI.Container());
  const [mounted, setMounted] = useState(false);

  useImperativeHandle(ref, () => {
    return _ref.current;
  });

  useMount(() => {
    if (_ref.current) {
      _ref.current.sortableChildren = true;
      _ref.current.filters = [];
      if (props.root) props.root.addChild(_ref.current);
      setMounted(true);
    }
  });

  useUnmount(() => {
    let c = _ref.current;

    c.children.forEach((child) => {
      c.removeChild(child);
    });
    if (c.parent) c.parent.removeChild(c);
    c.destroy({ children: true });
    _ref.current = null;
  });

  return (
    <>
      <If cond={mounted}>
        <ContainerChildren root={_ref.current}>
          {props.children}
        </ContainerChildren>
      </If>
    </>
  );
}

const Container = withPixiApp(React.forwardRef(PixiContainer));

export { Container, ContainerChildren };

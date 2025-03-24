import React from "react";

const If = React.forwardRef(({ cond, children }, ref) => {
  if (cond) {
    return <>{children}</>;
  }
  return null;
});

export { If };

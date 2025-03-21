# Flow Builder

A node-based flow builder application made with React, Vite, and Pixi.js that allows you to create visual processes by connecting nodes together.

## Features

- Dynamically loaded nodes from directory structure
- Drag-and-drop node interface
- Real-time flow previews with Pixi.js rendering
- Local media storage for offline use
- Customizable effects and transformations
- Image export capability

## Getting Started

1. Install dependencies:

```
npm install
```

2. Start the development server:

```
npm run dev
```

3. Build for production:

```
npm run build
```

## Creating New Nodes

To create a new node type, add a new folder under `src/nodes` with an `index.tsx` file that exports a NodeDefinition object.

## Project Structure

- `src/types` - TypeScript interfaces and types
- `src/nodes` - Node implementations
- `src/components` - React components for the UI
- `src/utils` - Utility functions
- `src/state/flowSate` - Engine for managing the global node state which is then rendered through react-flow

## License

MIT

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

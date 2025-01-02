/**
 * {@include ./docs/Readme.md}
 *
 * ## Usage
 * ### Basic syntax
 * {@includeCode ./examples/usage/basic-syntax.ts}
 * Tip: Plugins for VSCode like lit-html or Inline HTML can be used for syntax highlighting.
 * ### Server-Side Rendering (SSR)
 * {@includeCode ./examples/usage/server.ts}
 * ### Client hydration
 * {@includeCode ./examples/usage/hydration.ts}
 * {@include ./docs/Roadmap.md}
 *
 * ## Documentation
 * @module
 */
export { hydrate } from './hydrate';
export { Render, RenderArg, html } from './render';
export { FR, FP } from './types';

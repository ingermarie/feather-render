import { isClient } from './bridge';
import { Render } from './render';

/**
 * Hydrate a `Render` element produced by ``` html`` ```
 * @param render - Instance of `Render`
 * @param target - Where to hydrate `Render` element
 * @example
 * import { html, hydrate } from 'feather-render';
 *
 * const App = () => html`
 * 	<div>Hello, World!</div>
 * `;
 * hydrate(App(), document.body);
 */
export const hydrate = (render: Render, target: Element): void => {
	if (!isClient) return;
	if (!render.element) {
		throw new Error('Render element missing.');
	}
	const recMutationHandler = (nodeList: NodeList, methodName: 'mount' | 'unmount') => {
		for (let node of nodeList) {
			node.__feather__?.[methodName]();
			recMutationHandler(node.childNodes, methodName);
		}
	};
	new MutationObserver((mutations) => {
		for (let mutation of mutations) {
			recMutationHandler(mutation.removedNodes, 'unmount');
			recMutationHandler(mutation.addedNodes, 'mount');
		}
	}).observe(target, { childList: true, subtree: true });

	target.replaceChildren(render.element);
}

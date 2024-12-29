import { isClient } from './bridge';
import { Render } from './render';

/**
 * Hydrate a `Render` element produced by ``` html`` ```
 * @param render {Render} - Instance of `Render`
 * @param {HTMLElement} [target=document.body] - Where to hydrate the render element
 * @returns {void}
 * @example
 * import { html, hydrate } from 'feather-render';
 *
 * const Component = () => html`
 * 	<div>Hello, World!</div>
 * `;
 * hydrate(Component(), document.body);
 */
export const hydrate = (render: Render, target = document.body): void => {
	if (!isClient) return;
	if (!render.element) {
		throw new Error('Render element is missing, hydrating outside browser?');
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

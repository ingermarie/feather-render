import { Feather, isClient } from './bridge';
import { Render } from './render';

export const hydrate = (render: Render, target = document.body): void => {
	if (!isClient) return;
	if (!render.element) {
		throw new Error('Render element is missing, hydrating outside browser?');
	}
	new MutationObserver((mutations) => {
		for (let mutation of mutations) {
			for (let removedNode of mutation.removedNodes) {
				if (removedNode.__feather__ instanceof Feather) {
					removedNode.__feather__.unmount();
				}
			}
			for (let addedNode of mutation.addedNodes) {
				if (addedNode.__feather__ instanceof Feather) {
					addedNode.__feather__.mount();
				}
			}
		}
	}).observe(target, { childList: true, subtree: true });

	target.replaceChildren(render.element);
}

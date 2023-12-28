import { Feather, Render, feather } from './render';

export const hydrate = (render: Render, target = document.body) => {
	if (typeof window === 'undefined') return;
	if (!render.element) {
		throw new Error('Render is missing element, are you trying to hydrate in a server environment?');
	}
	new MutationObserver((mutations) => {
		for (let mutation of mutations) {
			for (let removedNode of mutation.removedNodes) {
				if (feather in removedNode && removedNode[feather] instanceof Feather) {
					removedNode[feather].unmount?.();
				}
			}
			for (let addedNode of mutation.addedNodes) {
				if (feather in addedNode && addedNode[feather] instanceof Feather) {
					addedNode[feather].mount?.();
				}
			}
		}
	}).observe(target, { childList: true, subtree: true });

	target.innerHTML = '';
	target.appendChild(render.element);
}

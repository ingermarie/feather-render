import { Feather, feather, isClient } from './bridge';

type TemplateArg = string | number | Render;

declare class Render {
	constructor(template: TemplateStringsArray, ...args: TemplateArg[])
	refs: Record<string, undefined | Element>;
	element: undefined | DocumentFragment;
	render: Render;
	mount: (callback: () => void) => void;
	unmount: (callback: () => void) => void;
}

function Render(this: Render, template: TemplateStringsArray, ...args: TemplateArg[]) {
	let mounts: (() => void)[] = [];
	let unmounts: (() => void)[] = [];

	const mount = () => {
		window.__featherCurrentRender__ = undefined;
		mounts.forEach(mount => mount());
		mounts = [];
	};
	const unmount = () => {
		unmounts.forEach(unmount => unmount());
		unmounts = [];
	};

	const html = template.reduce((acc, part, i) => `${acc}${part}${args[i]?.toString() || ''}`, '');

	this.render = this;
	this.mount = (callback) => mounts.push(callback);
	this.unmount = (callback) => unmounts.push(callback);

	Object.defineProperty(this, 'toString', {
		value: () => {
			if (isClient) {
				mount();
				unmount();
			}
			return html;
		}
	});

	if (isClient) {
		window.__featherCurrentRender__ = this;
		const templateEl = document.createElement('template');
		templateEl.innerHTML = html;

		this.element = <DocumentFragment>templateEl.content.cloneNode(true);
		this.refs = [...this.element.querySelectorAll('[id]')].reduce((acc, el) => {
			const ref = el.getAttribute('id');
			if (ref) (acc[ref] = el)
			return acc;
		}, {} as Render['refs']);

		for (let child of this.element.children) {
			child[feather] = new Feather(mount, unmount);
		}
	}
}

export const html = (template: TemplateStringsArray, ...args: TemplateArg[]): Render => {
	return new Render(template, ...args);
};

export { Render };

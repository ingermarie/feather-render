import { Feather, isClient } from './bridge';

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

	this.refs = {};
	this.render = this;
	this.mount = (callback) => mounts.push(callback);
	this.unmount = (callback) => unmounts.push(callback);

	const html = template.reduce((acc, part, i) => `${acc}${part}${args[i]?.toString() || ''}`, '');

	const mount = () => {
		window.__featherCurrentRender__ = undefined;
		mounts.forEach(mount => mount());
		mounts = [];
	};
	const unmount = () => {
		unmounts.forEach(unmount => unmount());
		unmounts = [];
	};

	if (isClient) {
		window.__featherCurrentRender__ = this;
		const templateEl = document.createElement('template');
		templateEl.innerHTML = html;

		this.element = <DocumentFragment>templateEl.content.cloneNode(true);

		for (let el of this.element.querySelectorAll('[id]')) {
			this.refs[el.id] = el;
		}
		for (let child of this.element.children) {
			child.__feather__ = new Feather(mount, unmount);
		}
	}

	Object.defineProperty(this, 'toString', {
		value: () => html,
	});
}

/**
 * Create a new instance of `Render`
 * @param template {TemplateStringsArray} - Template string array
 * @param args {TemplateArg[]} - Template arguments
 * @returns {Render}
 * @example
 * import { html } from 'feather-render';
 *
 * const Component = ({ name }) => html`
 * 	<div>Hello, ${name}!</div>
 * `;
 */
export const html = (template: TemplateStringsArray, ...args: TemplateArg[]): Render => {
	return new Render(template, ...args);
};

export { Render };

import { Feather, isClient } from './bridge';

type TemplateArg = undefined | false | number | string | Render | TemplateArg[];

declare class Render {
	constructor(template: TemplateStringsArray, ...args: TemplateArg[])
	id: number;
	refs: Record<string, undefined | Element>;
	element: undefined | DocumentFragment;
	render: Render;
	mount: (callback: () => void) => void;
	unmount: (callback: () => void) => void;
}

let id = 0;
let unrendered: Render[] = [];
function Render(this: Render, template: TemplateStringsArray, ...args: TemplateArg[]) {
	let mounts: (() => void)[] = [];
	let unmounts: (() => void)[] = [];

	this.id = id;
	this.refs = {};
	this.render = this;
	this.mount = (callback) => mounts.push(callback);
	this.unmount = (callback) => unmounts.push(callback);

	const arrToString = (arr: TemplateArg[]): number | string | Render => arr.reduce((acc: number | string | Render, arg) => `${acc}${argToString(arg)}`, '');
	const argToString = (arg: TemplateArg): number | string | Render => Array.isArray(arg) ? arrToString(arg) : arg || typeof arg === 'number' ? arg : '';
	const html = template.reduce((acc, part, i) => `${acc}${part}${argToString(args[i])}`, '');

	const mount = () => {
		window.__featherCurrentRender__ = undefined;
		unrendered.forEach(render => {
			const domNode = document.querySelector(`#feather-${render.id}`);
			if (domNode?.parentElement && render.element) {
				domNode.parentElement.replaceChild(render.element, domNode);
			}
		});
		unrendered = [];
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
			child.__feather__ = new Feather(mount, child.id.startsWith('feather-') ? () => {} : unmount);
		}
	}

	Object.defineProperty(this, 'toString', {
		value: () => {
			if (isClient) {
				unrendered.unshift(this);
				return `<template id="feather-${this.id}"></template>`;
			}
			return html;
		},
	});
	id++;
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

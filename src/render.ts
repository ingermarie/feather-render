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
let unrendered: Record<string, Render> = {};
let unrenderedEls: Map<Render, HTMLTemplateElement> = new Map();
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
		window.__featherCurrentRender__ = null;
		unrenderedEls.forEach((domNode, render) => render.element && domNode.parentElement?.replaceChild(render.element, domNode));
		unrenderedEls.clear();
		unrendered = {};
		for (let mount of mounts) mount();
		mounts = [];
	};
	const unmount = () => {
		for (let unmount of unmounts) unmount();
		unmounts = [];
	};

	isClient && Object.defineProperty(this, 'element', {
		get() {
			window.__featherCurrentRender__ = this;

			let templateEl = unrenderedEls.get(this);
			if (!templateEl) {
				templateEl = document.createElement('template');
				templateEl.innerHTML = html;
			}

			for (let el of templateEl.content.querySelectorAll('[id]')) {
				if (el.id.match(/^feather-/) && el instanceof HTMLTemplateElement) {
					unrenderedEls.set(unrendered[el.id], el);
				} else {
					this.refs[el.id] = el;
				}
			}
			for (let child of templateEl.content.children) {
				child.__feather__ = new Feather(mount, child.id.match(/^feather-/) ? () => { } : unmount);
			}
			return templateEl.content;
		},
	});
	this.toString = () => {
		if (isClient) {
			unrendered[`feather-${this.id}`] = this;
			return `<template id="feather-${this.id}">${html}</template>`;
		}
		return html;
	};
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

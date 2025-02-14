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

	let unrenderedEls: [Element, Render][] = [];
	const mount = () => {
		window.__featherCurrentRender__ = null;
		for (let [domNode, render] of unrenderedEls.reverse()) {
			if (render.element) {
				domNode.parentElement?.replaceChild(render.element, domNode);
			}
		};
		unrendered = {};
		unrenderedEls = [];
		for (let mount of mounts) mount();
		mounts = [];
	};
	const unmount = () => {
		for (let unmount of unmounts) unmount();
		unmounts = [];
	};

	if (isClient) {
		window.__featherCurrentRender__ = this;
		const templateEl = document.createElement('template');
		templateEl.innerHTML = html;

		this.element = templateEl.content;

		for (let el of this.element.querySelectorAll('[id]')) {
			if (el.id.match(/^feather-/)) {
				unrenderedEls.push([el, unrendered[el.id]]);
			} else {
				this.refs[el.id] = el;
			}
		}
		for (let child of this.element.children) {
			child.__feather__ = new Feather(mount, child.id.match(/^feather-/) ? () => { } : unmount);
		}
	}

	this.toString = () => {
		if (isClient) {
			unrendered[`feather-${this.id}`] = this;
			return `<template id="feather-${this.id}"></template>`;
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

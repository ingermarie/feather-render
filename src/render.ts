import { Feather, isClient } from './bridge';

/**
 * Supported arguments for {@link html}
 */
export type RenderArg = undefined | false | number | string | Render | RenderArg[];

/** @hideconstructor */
declare class Render {
	constructor(template: TemplateStringsArray, ...args: RenderArg[])
	/**
	 * @internal */
	id: number;
	/**
	 * ID'ed elements from template
	 * @example
	 * const { refs } = html`<div id="myDiv"></div>`;
	 * 
	 * refs.myDiv; // <div id="myDiv"></div> */
	refs: Record<string, undefined | Element>;
	/**
	 * Element to insert in DOM
	 * @example
	 * const { element } = html`<div></div>`;
	 * 
	 * parent.appendChild(element); */
	element: undefined | DocumentFragment;
	/**
	 * Self reference to `Render` instance from `html`
	 * @example
	 * const res = html`<div></div>`;
	 * 
	 * res === res.render; // true */
	render: Render;
	/**
	 * Mount callback
	 * @param callback - Function called after component is inserted in DOM
	 * @example
	 * const { mount } = html`<div></div>`;
	 * 
	 * mount(() => {
	 *   console.log('Component inserted in DOM');
	 * }); */
	mount: (callback: () => void) => void;
	/**
	 * Unmount callback
	 * @param callback - Function called after component is removed from DOM
	 * @example
	 * const { unmount } = html`<div></div>`;
	 * 
	 * unmount(() => {
	 *   console.log('Component removed from DOM');
	 * }); */
	unmount: (callback: () => void) => void;
}

let id = 0;
let unrendered: Record<string, Render> = {};
function Render(this: Render, template: TemplateStringsArray, ...args: RenderArg[]) {
	let mounts: (() => void)[] = [];
	let unmounts: (() => void)[] = [];

	this.id = id;
	this.refs = {};
	this.render = this;
	this.mount = (callback) => mounts.push(callback);
	this.unmount = (callback) => unmounts.push(callback);

	const arrToString = (arr: RenderArg[]): number | string | Render => arr.reduce((acc: number | string | Render, arg) => `${acc}${argToString(arg)}`, '');
	const argToString = (arg: RenderArg): number | string | Render => Array.isArray(arg) ? arrToString(arg) : arg || typeof arg === 'number' ? arg : '';
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
 * @param template See tagged template example below
 * @param args See tagged template example below
 * @example
 * import { html } from 'feather-render';
 *
 * html`<div>${'arg'}</div>`; // Render {refs: {…}, mount: ƒ, unmount: ƒ, …} */
export const html = (template: TemplateStringsArray, ...args: RenderArg[]): Render => {
	return new Render(template, ...args);
};

export { Render };

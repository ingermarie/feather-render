export const feather = Symbol('feather');
const internal = Symbol('internal');

declare global {
	interface Element {
		[feather]: Feather;
	}
}

export class Feather {
	constructor(
		readonly mount: null | (() => void),
		readonly unmount: null | (() => void),
	) {}
}

export class Render {
	render = this;
	element: null | DocumentFragment = null;
	refs: Record<string, undefined | Element> = {};
	mount: (mountCallback: () => void) => void = (mountCallback) => {
		this[internal].mount = mountCallback;
	};
	unmount: (unmountCallback: () => void) => void = (unmountCallback) => {
		this[internal].unmount = unmountCallback;
	};
	[internal]: {
		mount: null | (() => void);
		unmount: null | (() => void);
	} = {
		mount: () => {
			this[internal].mount?.()
			this[internal].mount = null;
		},
		unmount: () => {
			this[internal].unmount?.()
			this[internal].unmount = null;
		},
	};

	constructor(template: TemplateStringsArray, ...args: (string | number | Render)[]) {
		const html = template.reduce((acc, part, i) => `${acc}${part}${args[i]?.toString() || ''}`, '');

		if (typeof document !== 'undefined') {
			const templateEl = document.createElement('template');
			templateEl.innerHTML = html;

			this.element = <DocumentFragment>templateEl.content.cloneNode(true);
			this.refs = [...this.element.querySelectorAll('[id]')].reduce((acc, el) => {
				const ref = el.getAttribute('id');
				if (ref) (acc[ref] = el)
				return acc;
			}, this.refs);

			for (let child of this.element.children) {
				child[feather] = new Feather(this[internal].mount, this[internal].unmount);
			}
		}
		this.toString = () => html;
	}
}

export const html = (template: TemplateStringsArray, ...args: (string | number | Render)[]) => {
	return new Render(template, ...args);
};

import { feather } from './bridge';

const internal = Symbol('internal');

export class Feather {
	constructor(
		readonly mount: () => void,
		readonly unmount: () => void,
	) {}
}

export class Render {
	render = this;
	element: null | DocumentFragment = null;
	refs: Record<string, undefined | Element> = {};
	mount: (mountCallback: () => void) => void = (mountCallback) => {
		this[internal]._mounts?.push(mountCallback);
	};
	unmount: (unmountCallback: () => void) => void = (unmountCallback) => {
		this[internal]._unmounts?.push(unmountCallback);
	};
	[internal]: {
		_mounts?: (() => void)[];
		_unmounts?: (() => void)[];
	} = {
		_mounts: [],
		_unmounts: [],
	};

	constructor(template: TemplateStringsArray, ...args: (string | number | Render)[]) {
		const html = template.reduce((acc, part, i) => `${acc}${part}${args[i]?.toString() || ''}`, '');
		const mount = () => {
			window.__featherCurrentRender__ = undefined;
			this[internal]._mounts?.forEach(mount => mount());
			this[internal]._mounts = [];
		};
		const unmount = () => {
			this[internal]._unmounts?.forEach(unmount => unmount());
			this[internal]._unmounts = [];
		};

		if (typeof window !== 'undefined') {
			window.__featherCurrentRender__ = this;
			const templateEl = document.createElement('template');
			templateEl.innerHTML = html;

			this.element = <DocumentFragment>templateEl.content.cloneNode(true);
			this.refs = [...this.element.querySelectorAll('[id]')].reduce((acc, el) => {
				const ref = el.getAttribute('id');
				if (ref) (acc[ref] = el)
				return acc;
			}, this.refs);

			for (let child of this.element.children) {
				child[feather] = new Feather(mount, unmount);
			}
		}
		this.toString = () => {
			if (typeof window !== 'undefined') {
				mount();
				unmount();
			}
			return html;
		};
	}
}

export const html = (template: TemplateStringsArray, ...args: (string | number | Render)[]) => {
	return new Render(template, ...args);
};

import { Render } from './render';

export const feather = Symbol();
export const isClient = typeof window !== 'undefined';

declare global {
	interface Window {
		__featherCurrentRender__?: Render;
	}
	interface Element {
		[feather]: Feather;
	}
}

declare class Feather {
	constructor(mount: () => void, unmount: () => void)
	mount: () => void;
	unmount: () => void;
};
function Feather(this: Feather, mount: () => void, unmount: () => void) {
	this.mount = mount;
	this.unmount = unmount;
}

export { Feather };

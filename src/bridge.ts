import { Feather, Render } from './render';

export const feather = Symbol('feather');

declare global {
	interface Window {
		__featherCurrentRender__?: Render;
	}
	interface Element {
		[feather]: Feather;
	}
}

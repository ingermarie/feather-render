import { Render } from './render';
import { Feather } from './bridge';

declare global {
	interface Window {
		__featherCurrentRender__?: null | Render;
	}
	interface Node {
		__feather__?: Feather;
	}
}

export type FR<TProps = void> = (props: TProps) => Render;
export type FP<TProps = void> = (props: TProps) => Promise<Render>;

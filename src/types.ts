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

// TODO:
/** Render function with optional props
 * @example
 * type Props = { prop: string; };
 *
 * const Component: FR<Props> = ({ prop }) => {
 *   return html``;
 * }; */
export type FR<TProps = void> = (props: TProps) => Render;

// TODO:
/** Async render function with optional props
 * @example
 * type Props = { prop: string; };
 *
 * const Component: FP<Props> = async ({ prop }) => {
 *   const pageData = await fetchPageData();
 *   return html`<div>${pageData.title}</div>`;
 * }; */
export type FP<TProps = void> = (props: TProps) => Promise<Render>;

import { html } from './render';
import { hydrate } from './hydrate';
import './bridge';

declare global {
	interface Window {
		__feather__?: {
			html: typeof html,
			hydrate: typeof hydrate,
		};
	}
}

window.__feather__ = {
	...(window.__feather__ || {}),
	html,
	hydrate,
};

import { FR, html } from 'feather-render';

type Props = {
	name: string;
};

export const Component: FR<Props> = ({ name }) => html`
	<div>Hello, ${name}!</div>
`;

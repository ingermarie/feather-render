export const isClient = typeof window !== 'undefined';

type Mount = () => void;
type Unmount = () => void;

declare class Feather {
	constructor(mount: Mount, unmount: Unmount)
	mount: Mount;
	unmount: Unmount;
}

function Feather(this: Feather, mount: Mount, unmount: Unmount) {
	this.mount = mount;
	this.unmount = unmount;
}

export { Feather };

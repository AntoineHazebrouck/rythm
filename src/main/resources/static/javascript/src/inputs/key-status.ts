import { KeyState } from "./key-state";

export class KeyStatus {
	public constructor(
		public readonly key: string,
		public readonly column: number,
		public state: KeyState,
	) {}
}

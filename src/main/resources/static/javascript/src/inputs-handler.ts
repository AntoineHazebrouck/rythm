import { KeyState, Store } from './store.js';

// listeners send input states to the store, store is read by the timed events loop
export function addEventListeners(store: Store) {
	document.addEventListener('keydown', (event) => {
		event.preventDefault();

		if (store.getKeyState(event.key) === KeyState.UP) {
			store.setKeyState(event.key, KeyState.PRESSED);
		}
	});

	document.addEventListener('keyup', (event) => {
		event.preventDefault();

		store.setKeyState(event.key, KeyState.UP);
	});
}

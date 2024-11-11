import { Optional } from './utils/optional';

const search = window.location.search;
const urlParams = new URLSearchParams(search);

export function getParameter(name: string): Optional<string> {
	const value = urlParams.get(name);

	return Optional.of(value);
}

const search = window.location.search;
const urlParams = new URLSearchParams(search);

export function getParameter(name) {
	return urlParams.get(name)
}
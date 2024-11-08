const search = window.location.search;
const urlParams = new URLSearchParams(search);

class OptionalParameter {
	private readonly value: string | null;

	public constructor(value: string | null) {
		this.value = value;
	}

	public orElseThrow(error: Error): string {
		if (this.value) {
			return this.value;
		} else {
			throw error;
		}
	}
}

export function getParameter(name: string): OptionalParameter {
	const value = urlParams.get(name);

	return new OptionalParameter(value);
}

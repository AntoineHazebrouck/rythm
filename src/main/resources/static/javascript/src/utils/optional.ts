export class Optional<T> {
	private constructor(private readonly value?: T) {}

	public static of<T>(value: T): Optional<T> {
		return new Optional(value);
	}

	public static empty<T>() {
		return new Optional<T>(undefined);
	}

	public ifPresent(runnable: (value: T) => void) {
		if (this.value) {
			runnable(this.value);
		}
	}

	public map<O>(mapping: (value: T) => O): Optional<O> {
		if (this.value) {
			return Optional.of(mapping(this.value));
		} else {
			return Optional.empty();
		}
	}
}

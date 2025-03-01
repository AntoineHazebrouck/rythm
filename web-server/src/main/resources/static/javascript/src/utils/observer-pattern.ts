export interface Sender<T> {
	notify(modifiedData: T): void;
	attach(observer: Observer<T>): void;
}

export interface Observer<T> {
	// Receive update from subject.
	update(modifiedData: T): void;
}

export const stringifyCyclical = (val: unknown) => {
	const cache: unknown[] = []
	return JSON.stringify(
		val,
		function (key, value) {
			if (typeof value === 'object' && value !== null) {
				if (cache.indexOf(value) !== -1) {
					// Duplicate reference found, discard key
					return
				}
				// Store value in our collection
				cache.push(value)
			}
			return value
		},
		2
	)
}

export function hasKey<K extends string>(
	k: K,
	o: {}
): o is { [_ in K]: unknown } {
	return typeof o === 'object' && k in o
}

export type UnpackedPromise<T extends Promise<unknown>> = T extends Promise<
	infer U
>
	? U
	: never

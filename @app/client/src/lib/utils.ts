export const stringifyCyclical = (val: any) => {
	const cache: any[] = []
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

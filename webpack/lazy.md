``` js
const lazyFunction = factory => {
	const fac = memoize(factory);
	const f = /** @type {any} */ (
		(...args) => {
			return fac()(...args);
		}
	);
	return /** @type {T} */ (f);
};
```

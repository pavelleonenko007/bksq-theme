/**
 *
 * @param {Promise<any>} promise
 */
export const promiseWrapper = async (promise) => {
	const [{ value, reason }] = await Promise.allSettled([promise]);
	return {
		data: value,
		error: reason,
	};
};

export const getQueryParams = () => {
	const searchParams = new URLSearchParams(window.location.search);
	const queryParams = {};
	for (const [key, value] of searchParams.entries()) {
		queryParams[key] = value;
	}
	return queryParams;
};

export const throttle = (fn, delay) => {
	let timeout;

	return function (...args) {
		const context = this;

		if (!timeout) {
			timeout = setTimeout(() => {
				timeout = null;
				fn.apply(context, args);
			}, delay);
		}
	};
};

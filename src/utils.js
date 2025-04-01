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
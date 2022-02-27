/**
 * Use to elegantly handle promises.
 * @param {*} promise 
 * @returns 
 */
 async function resolve(promise) {
    try {
        const data = await promise;
        if (data == null) {
            return [null, new Error('Null')];
        }
        return [data, null];
    } catch (error) {
        return [null, error];
    }
}

module.exports = { resolve };
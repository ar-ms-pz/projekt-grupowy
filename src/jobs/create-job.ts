export const createJob = async (
    callback: () => Promise<void>,
    intervalTime: number,
) => {
    const interval = setInterval(callback, intervalTime);

    const clear = () => clearInterval(interval);

    return clear;
};

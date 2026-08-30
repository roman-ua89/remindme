export const debounce = <T>(fn: (param: T) => void, delay: number) => {
    let timerId: number | undefined = undefined;

    return (value: T) => {
        window.clearTimeout(timerId);
        timerId = window.setTimeout(() => fn(value), delay);
    };
};

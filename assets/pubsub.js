const subscribers = {};
function subscribe(eventName, callback) {
    const eventSubscribers = (subscribers[eventName] ?? []);
    subscribers[eventName] = [...eventSubscribers, callback];
    return () => {
        const current = (subscribers[eventName] ?? []);
        subscribers[eventName] = current.filter((cb) => cb !== callback);
    };
}
function publish(eventName, data) {
    const eventSubscribers = (subscribers[eventName] ?? []);
    eventSubscribers.forEach((callback) => callback(data));
}

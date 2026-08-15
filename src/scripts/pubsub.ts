type PubSubCallback = (data: unknown) => void;

const subscribers: Record<string, PubSubCallback[]> = {};

function subscribe(eventName: string, callback: PubSubCallback): () => void {
  if (subscribers[eventName] === undefined) {
    subscribers[eventName] = [];
  }

  subscribers[eventName] = [...subscribers[eventName], callback];

  return function unsubscribe() {
    subscribers[eventName] = subscribers[eventName].filter((cb) => cb !== callback);
  };
}

function publish(eventName: string, data: unknown): void {
  subscribers[eventName]?.forEach((callback) => callback(data));
}

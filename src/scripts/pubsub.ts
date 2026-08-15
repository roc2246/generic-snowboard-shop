type PubSubCallback<K extends PubSubEventName> = (data: PubSubEventMap[K]) => void;

type SubscriberRegistry = {
  [K in PubSubEventName]?: Array<PubSubCallback<K>>;
};

const subscribers: SubscriberRegistry = {};

function subscribe<K extends PubSubEventName>(eventName: K, callback: PubSubCallback<K>): () => void {
  const eventSubscribers = (subscribers[eventName] ?? []) as Array<PubSubCallback<K>>;
  subscribers[eventName] = [...eventSubscribers, callback] as SubscriberRegistry[K];

  return () => {
    const current = (subscribers[eventName] ?? []) as Array<PubSubCallback<K>>;
    subscribers[eventName] = current.filter((cb) => cb !== callback) as SubscriberRegistry[K];
  };
}

function publish<K extends PubSubEventName>(eventName: K, data: PubSubEventMap[K]): void {
  const eventSubscribers = (subscribers[eventName] ?? []) as Array<PubSubCallback<K>>;
  eventSubscribers.forEach((callback) => callback(data));
}

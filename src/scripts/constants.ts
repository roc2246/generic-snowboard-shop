const ON_CHANGE_DEBOUNCE_TIMER = 300;

const PUB_SUB_EVENTS = {
  cartUpdate: 'cart-update',
  quantityUpdate: 'quantity-update',
  variantChange: 'variant-change',
  cartError: 'cart-error',
} as const;

type PubSubEventName = (typeof PUB_SUB_EVENTS)[keyof typeof PUB_SUB_EVENTS];

type CartEventPayload = {
  source: string;
  productVariantId?: FormDataEntryValue | null;
  errors?: string;
  message?: string;
};

type VariantChangePayload = {
  data: {
    sectionId?: string;
    html?: Document;
    variant?: Record<string, unknown> | null;
    [key: string]: unknown;
  };
};

type PubSubEventMap = {
  'cart-update': CartEventPayload;
  'quantity-update': undefined;
  'variant-change': VariantChangePayload;
  'cart-error': CartEventPayload;
};

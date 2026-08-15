type SectionRenderSpec = { id: string; section?: string; selector?: string };
type ShopifySectionResponse = Record<string, string>;
type CartResponse = {
  id?: string | number;
  key?: string;
  status?: number;
  description?: string;
  message?: string;
  sections?: ShopifySectionResponse;
  [key: string]: unknown;
};

declare const routes: {
  cart_add_url: string;
  cart_change_url: string;
  cart_update_url: string;
  cart_url: string;
  predictive_search_url?: string;
  search_url?: string;
  [key: string]: string | undefined;
};

declare const Shopify: any;

declare interface Window {
  Shopify: any;
  routes: typeof routes;
  cartStrings: Record<string, string>;
  variantStrings: Record<string, string>;
  accessibilityStrings: Record<string, string>;
  getCurrentSellingPlanId: () => string;
  ProductModel: any;
  ShopifyXR: any;
  ProductSubscriptions: any;
  shopUrl: string;
  overlay: HTMLDivElement;
}

interface CustomerAddresses { elements: any; }
interface LocalizationForm { elements: any; }
interface MediaGallery { elements: any; mql: MediaQueryList; }
interface ProductModel { modelViewerUI: any; }
interface Element {
  hide(...args: any[]): any;
  show(...args: any[]): any;
  setActiveElement(...args: any[]): any;
  setActiveMedia(...args: any[]): any;
  updateUrl(...args: any[]): any;
  fetchAvailability(...args: any[]): any;
  bindEvents(...args: any[]): any;
  getCurrentSellingPlanId(...args: any[]): string;
}

// Dawn interoperates with Liquid-generated custom elements. These declarations describe
// cross-file capabilities that exist at runtime without forcing consumers to cast every selector.
interface Element {
  updateQuantity(...args: any[]): any;
  onActiveFilterClick(...args: any[]): any;
  loadContent(...args: any[]): any;
  handleErrorMessage(...args: any[]): any;
  reveal(...args: any[]): any;
  modelViewerUI: any;
  value: any;
  innerText: string;
  offsetParent: Element | null;
  width: any;
  onclick: any;
  click(): void;
  play(): Promise<void> | void;
  focus(): void;
  blur(): void;
}
interface EventTarget {
  classList: DOMTokenList;
  closest(selectors: string): Element | null;
  setAttribute(name: string, value: string): void;
  offsetLeft: number;
}
interface Element {
  dataset: DOMStringMap;
  clientWidth: number;
  src: string;
  pause(): void;
  slider: HTMLElement;
  autoplayButtonIsSetToPlay: boolean;
}

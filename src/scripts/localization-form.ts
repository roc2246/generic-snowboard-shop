type LocalizationElements = {
  input: HTMLInputElement | null;
  button: HTMLButtonElement | null;
  panel: HTMLElement | null;
};

if (!customElements.get('localization-form')) {
  customElements.define('localization-form', class LocalizationForm extends HTMLElement {
  declare elements: LocalizationElements;

    constructor() {
      super();
      this.elements = {
        input: this.querySelector('input[name="locale_code"], input[name="country_code"]'),
        button: this.querySelector('button'),
        panel: this.querySelector('.disclosure__list-wrapper'),
      };
      if (!this.elements.button || !this.elements.panel) return;
      this.elements.button.addEventListener('click', this.openSelector.bind(this));
      this.elements.button.addEventListener('focusout', this.closeSelector.bind(this));
      this.addEventListener('keyup', this.onContainerKeyUp.bind(this));

      this.querySelectorAll('a').forEach(item => item.addEventListener('click', this.onItemClick.bind(this)));
    }

    hidePanel() {
      if (!this.elements.button || !this.elements.panel) return;
      this.elements.button.setAttribute('aria-expanded', 'false');
      this.elements.panel.setAttribute('hidden', '');
    }

    onContainerKeyUp(event) {
      if (event.code.toUpperCase() !== 'ESCAPE') return;

      this.hidePanel();
      this.elements.button?.focus();
    }

    onItemClick(event) {
      event.preventDefault();
      const form = this.querySelector('form');
      if (this.elements.input) this.elements.input.value = event.currentTarget.dataset.value;
      if (form) form.submit();
    }

    openSelector() {
      if (!this.elements.button || !this.elements.panel) return;
      this.elements.button.focus();
      this.elements.panel.toggleAttribute('hidden');
      this.elements.button.setAttribute('aria-expanded', (this.elements.button.getAttribute('aria-expanded') === 'false').toString());
    }

    closeSelector(event) {
      if (!this.elements.button || !this.elements.panel) return;
      const isChild = this.elements.panel.contains(event.relatedTarget) || this.elements.button.contains(event.relatedTarget);
      if (!event.relatedTarget || !isChild) {
        this.hidePanel();
      }
    }
  });
}

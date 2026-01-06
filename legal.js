const basePath = '/Friseurmeisterin';

const fetchJson = async (path) => {
  const response = await fetch(`${basePath}${path}`);
  if (!response.ok) throw new Error(`Failed to load ${path}`);
  return response.json();
};

const init = async () => {
  const site = await fetchJson('/data/site.json');
  document.querySelectorAll('[data-site="tagline"]').forEach((el) => (el.textContent = site.tagline));
  document.querySelectorAll('[data-site="contact.address"]').forEach((el) => (el.textContent = site.contact.address));
  document.querySelectorAll('[data-site="contact.phone"]').forEach((el) => (el.textContent = site.contact.phone));
  document.querySelectorAll('[data-site="contact.email"]').forEach((el) => (el.textContent = site.contact.email));
  document.getElementById('year').textContent = new Date().getFullYear();

  const policies = await fetchJson('/data/policies.json');
  const shippingText = document.getElementById('shipping-text');
  const shippingScope = document.getElementById('shipping-scope');
  const returnsText = document.getElementById('returns-text');
  if (shippingText) shippingText.textContent = policies.shipping.text;
  if (shippingScope) shippingScope.textContent = `Geltungsbereich: ${policies.shipping.scope}`;
  if (returnsText) returnsText.textContent = policies.returns.text;
};

init();

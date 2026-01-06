const basePath = '/Friseurmeisterin';

const fetchJson = async (path) => {
  const response = await fetch(`${basePath}${path}`);
  if (!response.ok) throw new Error(`Failed to load ${path}`);
  return response.json();
};

const parseMarkdown = (text = '') => {
  return text
    .replace(/\n\n+/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
};

const renderProduct = (product) => {
  const container = document.getElementById('product-container');
  const gallery = product.images?.length
    ? product.images
        .map(
          (image) => `
          <img src="${basePath}${image.src}" alt="${image.alt}" width="640" height="520" loading="lazy" decoding="async" style="border-radius:18px; border:1px solid var(--line); aspect-ratio:4/5; object-fit:cover;">
        `
        )
        .join('')
    : '<div class="card">PLACEHOLDER_PRODUCT_IMAGE</div>';

  const buyEnabled = Boolean(product.paymentLinkUrl);

  container.innerHTML = `
    <div style="display:grid; gap:2.5rem;" class="product-grid">
      <div style="display:grid; gap:1rem;">${gallery}</div>
      <div>
        <p class="badge">${product.brand}</p>
        <h1 class="section-title">${product.name}</h1>
        <p class="prose">${product.shortDescription}</p>
        <div class="card" style="margin-top:2rem;">
          <div style="display:flex; justify-content:space-between;">
            <span class="notice">Preis</span>
            <strong>€ ${product.priceEur.toFixed(2)}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; margin-top:0.5rem;" class="notice">
            <span>Kategorie</span>
            <span>${product.category}</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-top:0.5rem;" class="notice">
            <span>Verfügbarkeit</span>
            <span>${product.inStock ? 'Sofort verfügbar' : 'Aktuell nicht verfügbar'}</span>
          </div>
          <div style="margin-top:1.5rem;">
            ${buyEnabled ? `<a class="btn btn-primary focus-ring" href="${product.paymentLinkUrl}">Buy now</a>` : '<span class="badge">Checkout nicht konfiguriert</span>'}
            <p class="notice" style="margin-top:0.75rem;">Zahlung via Stripe Payment Link (Gast-Checkout).</p>
          </div>
        </div>
        <div style="margin-top:2rem;">
          <h2 class="badge">Beschreibung</h2>
          <div class="prose">${parseMarkdown(product.description)}</div>
        </div>
        ${product.usage ? `<div style="margin-top:1.5rem;"><h2 class="badge">Anwendung</h2><div class="prose">${parseMarkdown(product.usage)}</div></div>` : ''}
        ${product.ingredients ? `<div style="margin-top:1.5rem;"><h2 class="badge">Inhaltsstoffe</h2><div class="prose">${parseMarkdown(product.ingredients)}</div></div>` : ''}
      </div>
    </div>
  `;
};

const initFooter = async () => {
  const site = await fetchJson('/data/site.json');
  document.querySelectorAll('[data-site="tagline"]').forEach((el) => (el.textContent = site.tagline));
  document.querySelectorAll('[data-site="contact.address"]').forEach((el) => (el.textContent = site.contact.address));
  document.querySelectorAll('[data-site="contact.phone"]').forEach((el) => (el.textContent = site.contact.phone));
  document.querySelectorAll('[data-site="contact.email"]').forEach((el) => (el.textContent = site.contact.email));
  document.getElementById('year').textContent = new Date().getFullYear();
};

const init = async () => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const products = await fetchJson('/data/products.json');
  const product = products.find((item) => item.slug === slug);
  if (!product) {
    document.getElementById('product-container').innerHTML = '<p class="notice">Produkt nicht gefunden.</p>';
    return;
  }
  renderProduct(product);
  initFooter();
};

init();

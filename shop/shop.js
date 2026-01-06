const basePath = window.location.pathname.includes('/Friseurmeisterin/')
  ? '/Friseurmeisterin'
  : '';

const fetchJson = async (path) => {
  const response = await fetch(`${basePath}${path}`);
  if (!response.ok) throw new Error(`Failed to load ${path}`);
  return response.json();
};

const state = {
  products: [],
  filtered: [],
  category: '',
  search: '',
  minPrice: 0,
  maxPrice: Infinity,
  sort: 'default'
};

const productCard = (product) => {
  const image = product.images?.[0];
  const buyEnabled = Boolean(product.paymentLinkUrl);
  return `
    <article class="product-card" data-category="${product.category}" data-price="${product.priceEur}" data-name="${product.name.toLowerCase()}" data-brand="${product.brand.toLowerCase()}">
      <a class="focus-ring" href="${basePath}/shop/product.html?slug=${product.slug}">
        ${image ? `<img src="${basePath}${image.src}" alt="${image.alt}" width="420" height="520" loading="lazy" decoding="async">` : '<div class="card">PLACEHOLDER_PRODUCT_IMAGE</div>'}
      </a>
      <div class="product-meta">
        <div>
          <p class="badge">${product.brand}</p>
          <h3 style="margin:0;">${product.name}</h3>
        </div>
        <span>€ ${product.priceEur.toFixed(2)}</span>
      </div>
      <p class="prose" style="margin-top:0.75rem;">${product.shortDescription}</p>
      <div style="display:flex; gap:0.5rem; margin-top:1rem; flex-wrap:wrap;">
        <a class="btn btn-secondary focus-ring" href="${basePath}/shop/product.html?slug=${product.slug}">Details</a>
        ${buyEnabled ? `<a class="btn btn-primary focus-ring" href="${product.paymentLinkUrl}">Buy now</a>` : '<span class="badge">Checkout nicht konfiguriert</span>'}
      </div>
    </article>
  `;
};

const render = () => {
  const container = document.getElementById('products');
  container.innerHTML = state.filtered.map(productCard).join('');
  document.getElementById('result-count').textContent = state.filtered.length;
};

const applyFilters = () => {
  let items = [...state.products];

  if (state.category) {
    items = items.filter((product) => product.category === state.category);
  }

  if (state.search) {
    const query = state.search.toLowerCase();
    items = items.filter((product) => product.name.toLowerCase().includes(query) || product.brand.toLowerCase().includes(query));
  }

  items = items.filter((product) => product.priceEur >= state.minPrice && product.priceEur <= state.maxPrice);

  if (state.sort === 'price-asc') {
    items.sort((a, b) => a.priceEur - b.priceEur);
  } else if (state.sort === 'price-desc') {
    items.sort((a, b) => b.priceEur - a.priceEur);
  } else {
    items.sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }

  state.filtered = items;
  render();
};

const initFilters = () => {
  const form = document.getElementById('filter-form');
  const categorySelect = document.getElementById('category');
  const minPrice = document.getElementById('minPrice');
  const maxPrice = document.getElementById('maxPrice');
  const search = document.getElementById('search');
  const sort = document.getElementById('sort');
  const reset = document.getElementById('reset-filters');

  const categories = Array.from(new Set(state.products.map((p) => p.category)));
  categorySelect.innerHTML = '<option value="">Alle</option>' + categories.map((c) => `<option value="${c}">${c}</option>`).join('');

  const prices = state.products.map((p) => p.priceEur);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  minPrice.placeholder = min;
  maxPrice.placeholder = max;

  const syncState = () => {
    state.category = categorySelect.value;
    state.search = search.value.trim();
    state.minPrice = minPrice.value ? Number(minPrice.value) : min;
    state.maxPrice = maxPrice.value ? Number(maxPrice.value) : max;
    state.sort = sort.value;
    applyFilters();
  };

  form.addEventListener('input', syncState);
  form.addEventListener('change', syncState);
  reset.addEventListener('click', () => {
    categorySelect.value = '';
    search.value = '';
    minPrice.value = '';
    maxPrice.value = '';
    sort.value = 'default';
    syncState();
  });

  syncState();
};

const initDialog = () => {
  const dialog = document.getElementById('filter-dialog');
  const open = document.getElementById('open-filters');
  open.addEventListener('click', () => dialog.showModal());
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
  state.products = await fetchJson('/data/products.json');
  initFilters();
  initDialog();
  initFooter();
};

init();

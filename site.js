const basePath = window.location.pathname.includes('/Friseurmeisterin/')
  ? '/Friseurmeisterin'
  : '';

const fetchJson = async (path) => {
  const response = await fetch(`${basePath}${path}`);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return response.json();
};

const setText = (selector, value) => {
  document.querySelectorAll(`[data-site="${selector}"]`).forEach((el) => {
    el.textContent = value;
  });
};

const setLink = (selector, value) => {
  document.querySelectorAll(`[data-site="${selector}"]`).forEach((el) => {
    if (value && value.startsWith('http')) {
      el.setAttribute('href', value);
    }
  });
};

const updateSite = async () => {
  const site = await fetchJson('/data/site.json');
  setText('tagline', site.tagline);
  setText('aboutText', site.aboutText);
  setText('contact.address', site.contact.address);
  setText('contact.phone', site.contact.phone);
  setText('contact.email', site.contact.email);
  setLink('bookingUrl', site.bookingUrl);
  setLink('contact.mapsUrl', site.contact.mapsUrl);
  setLink('socials.instagramUrl', site.socials.instagramUrl);

  const servicesList = document.getElementById('services-list');
  if (servicesList) {
    servicesList.innerHTML = '';
    site.services.forEach((service) => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <p class="badge">${service.title}</p>
        <p class="prose" style="margin-top:1rem;">${service.description}</p>
      `;
      servicesList.appendChild(card);
    });
  }
};

const renderFeaturedProducts = async () => {
  const products = await fetchJson('/data/products.json');
  const featured = products.filter((product) => product.featured).slice(0, 3);
  const container = document.getElementById('featured-products');
  if (!container) return;
  container.innerHTML = '';

  featured.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    const image = product.images?.[0];
    card.innerHTML = `
      <a href="${basePath}/shop/product.html?slug=${product.slug}" class="focus-ring">
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
    `;
    container.appendChild(card);
  });
};

const renderPortfolio = () => {
  const grid = document.getElementById('portfolio-grid');
  const empty = document.getElementById('portfolio-empty');
  if (!grid) return;
  const images = Array.from(grid.querySelectorAll('img'));
  let visibleCount = 0;
  images.forEach((img) => {
    img.addEventListener('error', () => {
      img.remove();
      if (grid.querySelectorAll('img').length === 0) {
        empty?.removeAttribute('style');
      }
    });
    visibleCount += 1;
  });
  if (visibleCount === 0) {
    empty?.removeAttribute('style');
  }
};

const init = async () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  try {
    await updateSite();
    await renderFeaturedProducts();
  } catch (error) {
    console.error(error);
  }
  renderPortfolio();
};

init();

const form = document.querySelector<HTMLFormElement>('[data-filter-form]');
const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-product-card]'));
const resultCount = document.querySelector<HTMLElement>('[data-result-count]');
const resetButton = document.querySelector<HTMLButtonElement>('[data-reset-filters]');

const update = () => {
  if (!form) return;
  const formData = new FormData(form);
  const category = String(formData.get('category') || '').toLowerCase();
  const search = String(formData.get('search') || '').toLowerCase().trim();
  const minPrice = Number(formData.get('minPrice') || 0);
  const maxPrice = Number(formData.get('maxPrice') || Infinity);
  const sort = String(formData.get('sort') || 'default');

  const filtered = cards.filter((card) => {
    const cardCategory = String(card.dataset.category || '').toLowerCase();
    const price = Number(card.dataset.price || 0);
    const name = String(card.dataset.name || '');
    const brand = String(card.dataset.brand || '');

    const matchesCategory = category ? cardCategory === category : true;
    const matchesSearch = search
      ? name.includes(search) || brand.includes(search)
      : true;
    const matchesPrice = price >= minPrice && price <= maxPrice;

    const visible = matchesCategory && matchesSearch && matchesPrice;
    card.classList.toggle('hidden', !visible);
    return visible;
  });

  const sorted = [...filtered];
  if (sort === 'price-asc') {
    sorted.sort((a, b) => Number(a.dataset.price || 0) - Number(b.dataset.price || 0));
  } else if (sort === 'price-desc') {
    sorted.sort((a, b) => Number(b.dataset.price || 0) - Number(a.dataset.price || 0));
  }

  const container = document.querySelector<HTMLElement>('[data-products-grid]');
  if (container) {
    sorted.forEach((card) => container.appendChild(card));
  }

  if (resultCount) {
    resultCount.textContent = `${filtered.length}`;
  }
};

form?.addEventListener('input', update);
form?.addEventListener('change', update);
resetButton?.addEventListener('click', () => {
  form?.reset();
  update();
});

update();

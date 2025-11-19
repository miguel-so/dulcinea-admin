const API_BASE = (window.APP_CONFIG && window.APP_CONFIG.API_URL) || "";

// safe fetch
async function safeFetchJson(url) {
  try {
    const res = await fetch(url, { credentials: "same-origin" });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Fetch error:", err, url);
    return null;
  }
}

// HERO SLIDES
async function loadHeroSlides() {
  const json = await safeFetchJson(
    `${API_BASE}/api/artworks?isRandom=true&limit=5`
  );
  const artworks = (json && (json.artworks || json.data)) || [];
  const container = document.getElementById("hero-slides-container");
  if (!container) return;
  container.innerHTML = "";

  artworks.forEach((art, i) => {
    const thumb = art.thumbnail
      ? art.thumbnail.startsWith("http")
        ? art.thumbnail
        : `${API_BASE}/artworks/${art.thumbnail}`
      : "";
    const slide = document.createElement("div");
    slide.className =
      "embla__slide slider-image item" + (i === 0 ? " active" : "");
    slide.innerHTML = `
      <div class="slide-content">
        <div class="item-wrapper">
          <div class="item-img">
            <img src="${thumb}" alt="${art.title || ""}" />
          </div>
        </div>
      </div>`;
    container.appendChild(slide);
  });
}

// CATEGORIES
async function loadCategories() {
  const json = await safeFetchJson(`${API_BASE}/api/categories`);
  const categories = (json && (json.data || json.categories)) || [];
  const container = document.getElementById("categories-container");
  if (!container) return;
  container.innerHTML = "";

  categories.forEach((cat) => {
    const thumb = cat.thumbnail
      ? cat.thumbnail.startsWith("http")
        ? cat.thumbnail
        : `${API_BASE}/artworks/${cat.thumbnail}`
      : "";
    const slug = cat.slug || cat.id || cat.name;
    const card = document.createElement("div");
    card.className = "item features-image col-12 col-md-6 col-lg-3";
    card.innerHTML = `
      <div class="item-wrapper">
        <div class="item-img">
          <img src="${thumb}" alt="${cat.name || ""}" />
        </div>
        <div class="item-content align-left">
          <h5 class="item-title mbr-fonts-style display-7"><strong>${
            cat.name || "Category"
          }</strong></h5>
          <p class="mbr-text mbr-fonts-style display-4">${
            cat.description || ""
          }</p>
        </div>
        <div class="mbr-section-btn item-footer">
          <a href="arts.html?category=${encodeURIComponent(
            slug
          )}" class="btn item-btn btn-warning display-4">View Arts</a>
        </div>
      </div>`;
    container.appendChild(card);
  });
}

// SPOTLIGHT
async function loadSpotlight() {
  const json = await safeFetchJson(`${API_BASE}/api/artworks?isSpotlight=true`);
  const artworks = (json && (json.artworks || json.data)) || [];
  const container = document.getElementById("spotlight-container");
  if (!container) return;

  // Remove old cards except first "View All Categories"
  container
    .querySelectorAll(".spotlight-card-dynamic")
    .forEach((el) => el.remove());

  artworks.forEach((art) => {
    const thumb = art.thumbnail
      ? art.thumbnail.startsWith("http")
        ? art.thumbnail
        : `${API_BASE}/artworks/${art.thumbnail}`
      : "";
    const d = art.createdAt ? new Date(art.createdAt) : null;
    const day = d ? d.getDate() : "";
    const month = d ? d.toLocaleString(undefined, { month: "short" }) : "";

    const card = document.createElement("div");
    card.className =
      "card col-12 col-md-6 col-lg-3 md-pb spotlight-card-dynamic";
    card.style.cursor = "pointer";
    card.onclick = () =>
      (window.location.href = `/details.html?id=${encodeURIComponent(art.id)}`);
    card.innerHTML = `
      <div class="card-wrapper">
        <div class="card-box align-left">
          <div class="item-img">
            <img src="${thumb}" alt="${art.title || ""}" />
            <p class="card-date mbr-fonts-style display-4">${day}<br>${month}</p>
            <p class="card-type mbr-fonts-style display-4">${
              art.media || art.category || ""
            }</p>
          </div>
          <h5 class="card-title mbr-fonts-style display-7">${
            art.title || ""
          }</h5>
        </div>
      </div>`;
    container.appendChild(card);
  });
}

// INIT
document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([loadHeroSlides(), loadCategories(), loadSpotlight()]);
});

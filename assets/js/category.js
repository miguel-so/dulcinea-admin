const API_BASE = (window.APP_CONFIG && window.APP_CONFIG.API_URL) || "";

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

// Load dynamic categories
async function loadCategories() {
  const json = await safeFetchJson(`${API_BASE}/api/categories?all=true`);
  const categories = (json && json.categories) || [];
  const container = document.getElementById("categories-container");
  if (!container) return;
  container.innerHTML = "";

  categories.forEach((cat) => {
    const thumb = cat.thumbnail
      ? cat.thumbnail.startsWith("http")
        ? cat.thumbnail
        : `${API_BASE}/artworks/${cat.thumbnail}`
      : "assets/images/placeholder.png"; // fallback
    const slug = cat.slug || cat.id || cat.name;
    const card = document.createElement("div");
    card.className = "item features-image col-12 col-md-6 col-lg-3";
    card.innerHTML = `
            <div class="item-wrapper">
              <div class="item-img">
                <img src="${thumb}" alt="${cat.name || ""}" />
              </div>
              <div class="item-content align-left">
                <h5 class="item-title mbr-fonts-style display-7">
                  <strong>${cat.name || "Category"}</strong>
                </h5>
                <p class="mbr-text mbr-fonts-style display-4">${
                  cat.description || ""
                }</p>
              </div>
              <div class="mbr-section-btn item-footer">
                <a href="arts.html?category=${encodeURIComponent(
                  slug
                )}" class="btn item-btn btn-success display-4">View Arts</a>
              </div>
            </div>`;
    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadCategories();
});

const API_BASE = (window.APP_CONFIG && window.APP_CONFIG.API_URL) || "";

function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites") || "[]");
}

function saveFavorites(list) {
  localStorage.setItem("favorites", JSON.stringify(list));
}

function toggleFavorite(art) {
  const favs = getFavorites();
  const exists = favs.find((f) => f.id === art.id);

  let updated;
  if (exists) updated = favs.filter((f) => f.id !== art.id);
  else updated = [...favs, art];

  saveFavorites(updated);
  renderFavorites();
  renderNormalArtworks();
}

// CARD BUILDER WITH ORIGINAL BUTTON COLORS + ICONS + TEXT
function createCard(art, isFavoriteSection) {
  const btnLabel = isFavoriteSection ? "Favorite" : "Mark As Favorite";

  const btnClass = isFavoriteSection ? "btn-success" : "btn-warning btnblack";

  const icon = `<span class="fa fa-heart mbr-iconfont mbr-iconfont-btn" style="color:white"></span>`;

  return `
<div class="item features-image col-12 col-md-6 col-lg-3">
  <div class="item-wrapper">
    <div class="item-img">
      <img src="${API_BASE}/artworks/${art.thumbnail}" alt="${art.title}" />
    </div>

    <div class="item-content">
      <h5 class="item-title mbr-fonts-style display-7"><strong>${
        art.title
      }</strong></h5>
      <p class="mbr-text mbr-fonts-style display-4">${art.description || ""}</p>

      <div class="mbr-section-btn item-footer">
        <a href="details.html?id=${
          art.id
        }" class="btn item-btn btn-primary display-4">See Details</a>
      </div>

      <div class="mbr-section-btn item-footer">
        <button class="btn item-btn ${btnClass} display-4" onclick='toggleFavorite(${JSON.stringify(
    art
  )})'>
          ${icon} ${btnLabel}
        </button>
      </div>
    </div>
  </div>
</div>`;
}

function renderFavorites() {
  const favorites = getFavorites();
  const grid = document.getElementById("favorites-grid");

  grid.innerHTML = favorites.length
    ? favorites.map((a) => createCard(a, true)).join("")
    : "";
}

function renderNormalArtworks() {
  const all = window.allArtworks || [];
  const favorites = getFavorites().map((f) => f.id);

  const normal = all.filter((a) => !favorites.includes(a.id));
  const grid = document.getElementById("artworks-grid");

  grid.innerHTML = normal.map((a) => createCard(a, false)).join("");
}

async function loadCategoryAndArtworks() {
  const params = new URLSearchParams(window.location.search);
  const categoryId = params.get("category");
  if (!categoryId) return;

  try {
    // CATEGORY
    const categoryRes = await fetch(`${API_BASE}/api/categories/${categoryId}`);
    const categoryData = await categoryRes.json();

    if (categoryData.success && categoryData.data) {
      const category = categoryData.data;

      document.querySelector("#header01-1l .mbr-section-title").textContent =
        category.name;

      document.querySelector("#header01-1l .mbr-text").textContent =
        category.description || "";

      document.querySelector(
        "#header01-1l .mbr-section-btn a"
      ).href = `arts.html?category=${category.id}`;
    }

    // ARTWORKS
    const artworksRes = await fetch(
      `${API_BASE}/api/artworks?category=${categoryId}&all=true`
    );
    const artworksData = await artworksRes.json();

    window.allArtworks = artworksData.artworks || [];

    renderFavorites();
    renderNormalArtworks();
  } catch (err) {
    console.error("Error loading category or artworks:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadCategoryAndArtworks);

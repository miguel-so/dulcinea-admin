const API_BASE = (window.APP_CONFIG && window.APP_CONFIG.API_URL) || "";

document.addEventListener("DOMContentLoaded", () => {
  loadArtwork();
});

// Favorites
function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites") || "[]");
}
function saveFavorites(list) {
  localStorage.setItem("favorites", JSON.stringify(list));
}
function isFavorite(id) {
  return getFavorites().some((f) => f.id === id);
}
function toggleFavorite(art) {
  const favs = getFavorites();
  const exists = favs.find((f) => f.id === art.id);
  const updated = exists ? favs.filter((f) => f.id !== art.id) : [...favs, art];
  saveFavorites(updated);
  updateFavoriteButton(art.id);
}
function updateFavoriteButton(id) {
  const btn = document.getElementById("favorite-btn");
  if (!btn) return;
  if (isFavorite(id)) {
    btn.textContent = "Favorite";
    btn.classList.remove("btn-danger");
    btn.classList.add("btn-success");
  } else {
    btn.textContent = "Mark as Favorite";
    btn.classList.remove("btn-success");
    btn.classList.add("btn-danger");
  }
}

// ZOOMABLE CAROUSEL LOGIC
(function () {
  const titleElement = document.getElementById("art-title");
  const descriptionElement = document.getElementById("art-description");
  const detailsListElement = document.getElementById("art-details");
  const favoriteBtn = document.getElementById("favorite-btn");
  const carouselContainer = document.querySelector("[data-artwork-carousel]");
  const carouselIndicators = document.querySelector(
    "[data-carousel-indicators]"
  );
  const carouselInner = document.querySelector("[data-carousel-inner]");
  const thumbnailsContainer = document.querySelector(
    "[data-carousel-thumbnails]"
  );

  const initializeZoom = () => {
    const zoomContainers = carouselInner?.querySelectorAll(".wrap-img") || [];
    zoomContainers.forEach((container) => {
      const img = container.querySelector("img");
      if (!img) return;
      container.classList.add("zoom-container");
      container.addEventListener("mousemove", (event) => {
        const rect = container.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        img.style.transformOrigin = `${x}% ${y}%`;
      });
      container.addEventListener("mouseleave", () => {
        img.style.transformOrigin = "center center";
      });
    });
  };

  const buildCarouselItem = (imageUrl, index) => {
    const item = document.createElement("div");
    item.className = "carousel-item" + (index === 0 ? " active" : "");
    const wrap = document.createElement("div");
    wrap.className = "wrap-img";
    const img = document.createElement("img");
    img.className = "img-responsive clients-img";
    img.src = imageUrl;
    wrap.appendChild(img);
    item.appendChild(wrap);
    return item;
  };

  const renderCarousel = (images) => {
    carouselIndicators.innerHTML = "";
    carouselInner.innerHTML = "";
    if (thumbnailsContainer) thumbnailsContainer.innerHTML = "";

    images.forEach((imgUrl, idx) => {
      // Carousel indicators (hidden)
      const indicator = document.createElement("li");
      indicator.setAttribute("data-bs-target", "#slider1-1q");
      indicator.setAttribute("data-bs-slide-to", String(idx));
      if (idx === 0) indicator.classList.add("active");
      carouselIndicators.appendChild(indicator);

      // Carousel main images
      const item = buildCarouselItem(imgUrl, idx);
      carouselInner.appendChild(item);

      // Thumbnails
      if (thumbnailsContainer) {
        const thumb = document.createElement("img");
        thumb.src = imgUrl;
        thumb.className = idx === 0 ? "active-thumb" : "";
        thumb.addEventListener("click", () => {
          // Move carousel to clicked index
          const bsCarousel = bootstrap.Carousel.getInstance(carouselContainer);
          if (bsCarousel) bsCarousel.to(idx);

          // Remove active class from all thumbnails
          thumbnailsContainer
            .querySelectorAll("img")
            .forEach((t) => t.classList.remove("active-thumb"));

          // Add active class to clicked thumbnail
          thumb.classList.add("active-thumb");
        });
        thumbnailsContainer.appendChild(thumb);
      }
    });

    initializeZoom();

    // Initialize or reset Bootstrap carousel
    const bsCarousel = bootstrap.Carousel.getInstance(carouselContainer);
    if (bsCarousel) bsCarousel.dispose();
    new bootstrap.Carousel(carouselContainer, {
      interval: 5000,
      ride: "carousel",
    });
  };

  const populatePage = (art) => {
    if (titleElement) titleElement.textContent = art.title;
    if (descriptionElement)
      descriptionElement.textContent = art.description || "";

    if (favoriteBtn) {
      favoriteBtn.onclick = () => toggleFavorite(art);
      updateFavoriteButton(art.id);
    }

    const images = [art.thumbnail, ...(art.images || [])]
      .filter(Boolean)
      .map((f) => `${API_BASE}/artworks/${f}`);
    renderCarousel(images);

    if (detailsListElement) {
      detailsListElement.innerHTML =
        "<ul>" +
        [
          ["Type", art.type],
          ["Medium", art.medium],
          ["Style", art.style],
          ["Subject", art.subject],
          ["Year", art.year],
          ["Size", art.size],
          ["Ready to hang", art.readyToHang ? "Yes" : "No"],
          ["Frame", art.frame || "No"],
          ["Signed", art.signed || "No"],
          ["Materials", art.materials],
          ["Shipping", art.shipping],
        ]
          .map((d) => `<li><strong>${d[0]}:</strong> ${d[1]}</li>`)
          .join("") +
        "</ul>";
    }
  };

  window.loadArtwork = async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) return alert("Artwork ID missing in URL");

    try {
      const res = await fetch(`${API_BASE}/api/artworks/${id}`);
      const data = await res.json();
      if (!data.success) return alert(data.message || "Failed to load artwork");
      populatePage(data.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching artwork details");
    }
  };
})();

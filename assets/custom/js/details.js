(() => {
  const {
    fetchJson,
    resolveImageUrl,
    parseQuery,
    getFavorites,
    addFavorite,
    removeFavorite,
  } = window.DulcineaUtils || {};

  if (
    !fetchJson ||
    !resolveImageUrl ||
    !parseQuery ||
    !getFavorites ||
    !addFavorite ||
    !removeFavorite
  ) {
    console.error("Dulcinea utilities are missing. Aborting details page init.");
    return;
  }

  const query = parseQuery();
  const artworkId = query.id;

  const titleEl = document.querySelector("[data-artwork-title]");
  const categoryEl = document.querySelector("[data-artwork-category]");
  const descriptionEl = document.querySelector("[data-artwork-description]");
  const contactLink = document.querySelector("[data-contact-link]");
  const favoriteButton = document.querySelector("[data-favorite-toggle]");
  const mainImageWrapper = document.querySelector("[data-main-image-wrapper]");
  const mainImageEl = document.querySelector("[data-main-image]");
  const galleryContainer = document.querySelector("[data-gallery-container]");
  const galleryIndicators = document.querySelector("[data-gallery-indicators]");
  const galleryCarouselEl = document.querySelector("#artwork-gallery");

  const fieldSelectors = {
    title: document.querySelector("[data-field-title]"),
    size: document.querySelector("[data-field-size]"),
    media: document.querySelector("[data-field-media]"),
    printNumber: document.querySelector("[data-field-print]"),
    inventoryNumber: document.querySelector("[data-field-inventory]"),
    status: document.querySelector("[data-field-status]"),
    location: document.querySelector("[data-field-location]"),
    date: document.querySelector("[data-field-date]"),
    notes: document.querySelector("[data-field-notes]"),
  };

  const state = {
    artwork: null,
    galleryImages: [],
    isFavorite: false,
  };

  const setText = (element, text, fallback = "—") => {
    if (!element) return;
    element.textContent = text && String(text).trim().length ? text : fallback;
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";
    return status
      .toString()
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return "Unknown";
    }
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const updateDocumentTitle = (title) => {
    if (!title) return;
    document.title = `${title} | Dulcinea Art`;
  };

  const updateMainImage = (src, alt) => {
    if (!mainImageEl) return;
    mainImageEl.src = src;
    mainImageEl.alt = alt;
  };

  const configureZoom = () => {
    if (!mainImageWrapper || !mainImageEl) return;
    const disableZoom = window.matchMedia("(pointer: coarse)").matches;
    if (disableZoom) {
      mainImageWrapper.classList.remove("is-zoomed");
      return;
    }

    const resetZoom = () => {
      mainImageWrapper.classList.remove("is-zoomed");
      mainImageEl.style.transformOrigin = "center center";
    };

    mainImageWrapper.addEventListener("mousemove", (event) => {
      const rect = mainImageWrapper.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      mainImageEl.style.transformOrigin = `${x}% ${y}%`;
      mainImageWrapper.classList.add("is-zoomed");
    });

    mainImageWrapper.addEventListener("mouseleave", resetZoom);
    mainImageWrapper.addEventListener("mouseenter", () =>
      mainImageWrapper.classList.add("is-zoomed")
    );
  };

  const applyFavoriteState = () => {
    if (!favoriteButton || !state.artwork) return;
    const isFavorite = state.isFavorite;
    favoriteButton.innerHTML = isFavorite
      ? '<span class="fa fa-heart mbr-iconfont mbr-iconfont-btn" style="color: rgb(249, 44, 80);"></span>Favorite'
      : '<span class="mobi-mbri mobi-mbri-hearth mbr-iconfont mbr-iconfont-btn"></span>Mark as favorite';
    favoriteButton.classList.toggle("btn-danger", isFavorite);
    favoriteButton.classList.toggle("btn-outline-danger", !isFavorite);
  };

  const handleFavoriteClick = () => {
    if (!state.artwork) return;
    state.isFavorite = !state.isFavorite;

    if (state.isFavorite) {
      addFavorite(state.artwork.id);
    } else {
      removeFavorite(state.artwork.id);
    }

    applyFavoriteState();
  };

  const buildGallerySlide = (image, index) => {
    const item = document.createElement("div");
    item.className = "carousel-item";
    if (index === 0) {
      item.classList.add("active");
    }

    const row = document.createElement("div");
    row.className = "media-container-row";

    const col = document.createElement("div");
    col.className = "col-md-12";

    const wrapper = document.createElement("div");
    wrapper.className = "wrap-img";

    const img = document.createElement("img");
    img.src = image.src;
    img.alt = image.alt;
    img.className = "img-responsive clients-img";
    img.loading = "lazy";

    wrapper.appendChild(img);
    col.appendChild(wrapper);
    row.appendChild(col);
    item.appendChild(row);

    item.addEventListener("click", () => {
      updateMainImage(image.src, image.alt);
    });

    return item;
  };

  const buildGalleryIndicator = (index) => {
    const indicator = document.createElement("li");
    indicator.setAttribute("data-bs-target", "#artwork-gallery");
    indicator.setAttribute("data-bs-slide-to", String(index));
    if (index === 0) {
      indicator.classList.add("active");
    }
    indicator.addEventListener("click", () => {
      updateMainImage(
        state.galleryImages[index].src,
        state.galleryImages[index].alt
      );
    });
    return indicator;
  };

  const renderGallery = () => {
    if (!galleryContainer || !galleryIndicators) return;
    galleryContainer.innerHTML = "";
    galleryIndicators.innerHTML = "";

    if (!state.galleryImages.length) {
      if (galleryCarouselEl) {
        galleryCarouselEl.classList.add("d-none");
      }
      return;
    }

    state.galleryImages.forEach((image, index) => {
      galleryContainer.appendChild(buildGallerySlide(image, index));
      galleryIndicators.appendChild(buildGalleryIndicator(index));
    });

    if (galleryCarouselEl) {
      galleryCarouselEl.classList.remove("d-none");
      if (window.bootstrap && typeof window.bootstrap.Carousel === "function") {
        window.bootstrap.Carousel.getOrCreateInstance(galleryCarouselEl, {
          interval: 5000,
          pause: "hover",
        });

        galleryCarouselEl.addEventListener("slide.bs.carousel", (event) => {
          const nextIndex =
            typeof event.to === "number" ? event.to : event.relatedTarget
              ? Array.prototype.indexOf.call(
                  galleryContainer.children,
                  event.relatedTarget
                )
              : 0;
          const image = state.galleryImages[nextIndex];
          if (image) {
            updateMainImage(image.src, image.alt);
          }
        });
      }
    }
  };

  const hydrateFields = (artwork, categoryName) => {
    updateDocumentTitle(artwork.title);
    setText(titleEl, artwork.title, "Artwork");
    setText(categoryEl, categoryName || artwork.categoryId || "Uncategorised");
    setText(
      descriptionEl,
      artwork.description || "No description provided for this artwork."
    );

    setText(fieldSelectors.title, artwork.title);
    setText(fieldSelectors.size, artwork.size);
    setText(fieldSelectors.media, artwork.media);
    setText(fieldSelectors.printNumber, artwork.printNumber);
    setText(fieldSelectors.inventoryNumber, artwork.inventoryNumber);
    setText(fieldSelectors.status, formatStatus(artwork.status));
    setText(fieldSelectors.location, artwork.location);
    setText(fieldSelectors.date, formatDate(artwork.createdAt));
    setText(fieldSelectors.notes, artwork.notes || artwork.description);

    if (contactLink) {
      const url = new URL(contactLink.href, window.location.origin);
      url.searchParams.set("artworkId", artwork.id);
      contactLink.href = url.toString();
    }
  };

  const loadCategoryName = async (categoryId) => {
    if (!categoryId) return null;
    try {
      const response = await fetchJson(`/api/categories/${categoryId}`);
      if (response?.success && response.data?.name) {
        return response.data.name;
      }
    } catch (error) {
      console.warn("Unable to fetch category", error);
    }
    return null;
  };

  const prepareGalleryImages = (artwork) => {
    const uniqueFilenames = Array.from(
      new Set([
        artwork.thumbnail,
        ...(Array.isArray(artwork.images) ? artwork.images : []),
      ])
    ).filter(Boolean);

    if (!uniqueFilenames.length) {
      uniqueFilenames.push(null);
    }

    return uniqueFilenames.map((filename, index) => ({
      src: resolveImageUrl(filename),
      alt: `${artwork.title || "Artwork"} view ${index + 1}`,
    }));
  };

  const initialise = async () => {
    if (!artworkId) {
      setText(titleEl, "Artwork not found");
      setText(
        descriptionEl,
        "The artwork you are looking for could not be located. Please return to the gallery."
      );
      return;
    }

    try {
      const response = await fetchJson(`/api/artworks/${artworkId}`);
      if (!response?.success) {
        throw new Error(response?.message || "Failed to fetch artwork");
      }

      const artwork = response.data;
      state.artwork = artwork;
      state.galleryImages = prepareGalleryImages(artwork);
      state.isFavorite = getFavorites().includes(Number(artwork.id));

      const categoryName = await loadCategoryName(artwork.categoryId);

      hydrateFields(artwork, categoryName);
      updateMainImage(
        state.galleryImages[0].src,
        state.galleryImages[0].alt
      );
      renderGallery();
      configureZoom();
      applyFavoriteState();

      if (favoriteButton) {
        favoriteButton.addEventListener("click", handleFavoriteClick);
      }
    } catch (error) {
      console.error("Failed to load artwork details", error);
      setText(titleEl, "Artwork unavailable");
      setText(
        descriptionEl,
        "An error occurred while loading this artwork. Please try again later."
      );
    }
  };

  document.addEventListener("DOMContentLoaded", initialise);
})();



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
    console.error(
      "Dulcinea utilities are missing. Aborting details page init."
    );
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

  const carouselContainer = document.querySelector("[data-artwork-carousel]");
  const carouselIndicators = document.querySelector(
    "[data-carousel-indicators]"
  );
  const carouselInner = document.querySelector("[data-carousel-inner]");

  if (!carouselContainer) {
    return;
  }

  const setFeedback = (message, tone = "info") => {
    if (!feedbackElement) return;
    feedbackElement.textContent = message || "";
    feedbackElement.classList.remove(
      "text-success",
      "text-danger",
      "text-info"
    );

    if (!message) {
      feedbackElement.setAttribute("hidden", "true");
      return;
    }

    switch (tone) {
      case "success":
        feedbackElement.classList.add("text-success");
        break;
      case "danger":
        feedbackElement.classList.add("text-danger");
        break;
      default:
        feedbackElement.classList.add("text-info");
    }

    feedbackElement.removeAttribute("hidden");
  };

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

  const buildCarouselItem = (imageUrl, index, total) => {
    const item = document.createElement("div");
    item.className = "carousel-item";
    if (index === 0) {
      item.classList.add("active");
    }

    const mediaRow = document.createElement("div");
    mediaRow.className = "media-container-row";

    const col = document.createElement("div");
    col.className = "col-md-12";

    const innerRow = document.createElement("div");
    innerRow.className = "row justify-content-center";

    const leftCol = document.createElement("div");
    leftCol.className = "col-md-6";
    const leftText = document.createElement("div");
    leftText.className = "text-box align-left";
    leftCol.appendChild(leftText);

    const rightCol = document.createElement("div");
    rightCol.className = "col-md-6";
    const rightText = document.createElement("div");
    rightText.className = "text-box align-right";
    rightCol.appendChild(rightText);

    innerRow.appendChild(leftCol);
    innerRow.appendChild(rightCol);

    const wrap = document.createElement("div");
    wrap.className = "wrap-img";

    const img = document.createElement("img");
    img.className = "img-responsive clients-img";
    img.src = imageUrl;
    img.alt = `Artwork image ${index + 1} of ${total}`;
    img.loading = "lazy";

    wrap.appendChild(img);
    col.appendChild(innerRow);
    col.appendChild(wrap);
    mediaRow.appendChild(col);
    item.appendChild(mediaRow);

    return item;
  };

  const thumbnailsContainer = document.querySelector(
    "[data-carousel-thumbnails]"
  );

  const renderCarousel = (images) => {
    carouselIndicators.innerHTML = "";
    carouselInner.innerHTML = "";
    if (thumbnailsContainer) thumbnailsContainer.innerHTML = "";

    images.forEach((imageUrl, index) => {
      // --- Main carousel ---
      const indicator = document.createElement("li");
      indicator.setAttribute("data-bs-target", "#slider1-1q");
      indicator.setAttribute("data-bs-slide-to", String(index));
      if (index === 0) indicator.classList.add("active");
      carouselIndicators.appendChild(indicator);

      const item = buildCarouselItem(imageUrl, index, images.length);
      if (index === 0) item.classList.add("active");
      carouselInner.appendChild(item);

      // --- Thumbnail carousel ---
      if (thumbnailsContainer) {
        const thumb = document.createElement("img");
        thumb.src = imageUrl;
        thumb.alt = `Thumbnail ${index + 1}`;
        thumb.className = "img-thumbnail m-1";
        thumb.style.width = "100px";
        thumb.style.height = "100px";
        thumb.style.cursor = "pointer";

        thumb.addEventListener("click", () => {
          // Switch main carousel to this index
          const bsCarousel = bootstrap.Carousel.getInstance(carouselContainer);
          if (bsCarousel) bsCarousel.to(index);
        });

        thumbnailsContainer.appendChild(thumb);
      }
    });

    initializeZoom();

    // Initialize Bootstrap carousel dynamically
    const bootstrapCarousel = bootstrap.Carousel.getInstance(carouselContainer);
    if (bootstrapCarousel) bootstrapCarousel.dispose();
    new bootstrap.Carousel(carouselContainer, {
      interval: 5000,
      ride: "carousel",
      pause: "hover",
      keyboard: false,
    });
  };

  carouselContainer.addEventListener("slid.bs.carousel", () => {
    if (!thumbnailsContainer) return;

    const items = thumbnailsContainer.querySelectorAll("img");
    const activeIndex = Array.from(carouselInner.children).findIndex((item) =>
      item.classList.contains("active")
    );

    items.forEach((img, idx) => {
      img.classList.toggle("active-thumb", idx === activeIndex);
    });
  });

  const normaliseDetails = (artwork) => {
    if (Array.isArray(artwork?.details) && artwork.details.length) {
      return artwork.details;
    }

    if (typeof artwork?.notes === "string" && artwork.notes.trim()) {
      return artwork.notes.split(/\r?\n/).filter(Boolean);
    }

    return [];
  };

  const populatePage = (artwork) => {
    const thumbnailUrl = resolveImageUrl(artwork.thumbnail);
    const galleryImages = Array.isArray(artwork.images) ? artwork.images : [];
    console.log(galleryImages);

    const uniqueImages = [
      thumbnailUrl,
      ...galleryImages.map((fileName) => {
        console.log(`${fileName}`);
        return resolveImageUrl(fileName);
      }),
    ]
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index);
    console.log("uniqueImages", uniqueImages);

    if (uniqueImages.length) {
      renderCarousel(uniqueImages);
    } else {
      carouselIndicators.innerHTML = "";
      carouselInner.innerHTML = "";
      setFeedback("No images available for this artwork.", "info");
    }
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

    // ICONS:
    //  - Not Favorite → hollow heart (yellow button)
    //  - Favorite → solid heart (red button)
    favoriteButton.innerHTML = isFavorite
      ? '<span class="mobi-mbri mobi-mbri-hearth mbr-iconfont mbr-iconfont-btn"></span> Favorite'
      : '<span class="mobi-mbri mobi-mbri-hearth mbr-iconfont mbr-iconfont-btn"></span> Mark as Favorite';

    // BUTTON COLORS (MATCH arts.html EXACTLY)
    if (isFavorite) {
      // RED BUTTON for favorite
      favoriteButton.className = "btn btn-danger display-7";
    } else {
      // YELLOW BUTTON for default state
      favoriteButton.className = "btn btn-warning display-7";
    }
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
            typeof event.to === "number"
              ? event.to
              : event.relatedTarget
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
      artwork.notes || "No description provided for this artwork."
    );

    setText(fieldSelectors.title, artwork.title);
    setText(fieldSelectors.size, artwork.size);
    setText(fieldSelectors.media, artwork.media);
    setText(fieldSelectors.printNumber, artwork.printNumber);
    setText(fieldSelectors.inventoryNumber, artwork.inventoryNumber);
    setText(fieldSelectors.status, formatStatus(artwork.status));
    setText(fieldSelectors.location, artwork.location);
    setText(fieldSelectors.date, formatDate(artwork.createdAt));
    setText(fieldSelectors.notes, artwork.notes || artwork.notes);

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
      console.log("Fetched artwork:", artwork);
      populatePage(artwork);
      state.artwork = artwork;
      state.galleryImages = prepareGalleryImages(artwork);
      state.isFavorite = getFavorites().includes(Number(artwork.id));

      const categoryName = await loadCategoryName(artwork.categoryId);

      hydrateFields(artwork, categoryName);
      updateMainImage(state.galleryImages[0].src, state.galleryImages[0].alt);
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

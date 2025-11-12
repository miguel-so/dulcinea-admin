(function () {
  const titleElement = document.querySelector("[data-artwork-title]");
  const descriptionElement = document.querySelector(
    "[data-artwork-description]"
  );
  const detailsListElement = document.querySelector("[data-artwork-details]");
  const contactButton = document.querySelector("[data-contact-artist]");
  const feedbackElement = document.querySelector("[data-artwork-feedback]");
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
    items.forEach((img, idx) => {
      img.classList.toggle(
        "active-thumb",
        idx ===
          bootstrap.Carousel.getInstance(carouselContainer).getActiveIndex()
      );
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

  const renderDetailsList = (artwork) => {
    const details = normaliseDetails(artwork);
    detailsListElement.innerHTML = "";

    if (!details.length) {
      const item = document.createElement("li");
      item.className = "list-text";
      item.textContent = "No further details available for this artwork.";
      detailsListElement.appendChild(item);
      return;
    }

    details.forEach((entry, index) => {
      const item = document.createElement("li");
      item.className = "list-text";
      item.innerHTML = `<strong>Detail ${index + 1}:</strong> ${entry}`;
      detailsListElement.appendChild(item);
    });
  };

  const populatePage = (artwork) => {
    const artworkTitle = artwork.title || "Artwork Details";
    if (titleElement) {
      titleElement.textContent = artworkTitle;
    }

    if (descriptionElement) {
      descriptionElement.textContent =
        artwork.notes || "No description available.";
    }

    if (contactButton) {
      contactButton.href = `contact-us.html?artworkId=${encodeURIComponent(
        artwork.id
      )}`;
      contactButton.removeAttribute("aria-disabled");
    }

    const thumbnailUrl = `https://dev.dulcinea-art.com/backend/src/public/artworks/${artwork.thumbnail}`;
    const galleryImages = Array.isArray(artwork.images) ? artwork.images : [];
    console.log(galleryImages);

    const uniqueImages = [
      thumbnailUrl,
      ...galleryImages.map((fileName) => {
        console.log(`${fileName}`);
        return `https://dev.dulcinea-art.com/backend/src/public/artworks/${fileName}`;
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

    renderDetailsList(artwork);
    document.title = `${artworkTitle} | Details`;
  };

  const artworkId = window.App.getQueryParam("id");
  if (!artworkId) {
    setFeedback(
      "No artwork selected. Please return to the gallery and choose an artwork to view.",
      "danger"
    );
    if (contactButton) {
      contactButton.classList.add("disabled");
      contactButton.setAttribute("aria-disabled", "true");
    }
    return;
  }

  const loadArtwork = async () => {
    try {
      setFeedback("Loading artwork details...", "info");
      const { data } = await window.App.request(
        `https://dev.dulcinea-art.com/api/artworks/${encodeURIComponent(
          artworkId
        )}`
      );
      if (!data || typeof data !== "object") {
        throw new Error("Artwork not found");
      }
      populatePage(data);
      setFeedback("", "info");
    } catch (error) {
      console.error("Failed to load artwork details", error);
      setFeedback(
        "We were unable to load this artwork. Please try again later.",
        "danger"
      );
      if (contactButton) {
        contactButton.classList.add("disabled");
        contactButton.setAttribute("aria-disabled", "true");
      }
    }
  };

  loadArtwork();
})();

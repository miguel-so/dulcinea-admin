(() => {
  const {
    fetchJson,
    resolveImageUrl,
    truncate,
    clearChildren,
    buildDetailsLink,
    buildArtsLink,
  } = window.DulcineaUtils || {};

  if (
    !fetchJson ||
    !resolveImageUrl ||
    !truncate ||
    !clearChildren ||
    !buildDetailsLink ||
    !buildArtsLink
  ) {
    console.error(
      "Dulcinea utilities are missing. Aborting landing page init."
    );
    return;
  }

  const heroSection = document.querySelector("#slider01-34");
  const categoriesRows = Array.from(
    document.querySelectorAll("[data-category-grid]")
  );
  const spotlightRow = document.querySelector(
    "#features05-39 [data-spotlight-grid]"
  );

  const welcomeMessageElement = document.querySelector(
    "#slider01-34 .item-text"
  );

  const renderWelcomeMessage = (siteContents) => {
    if (!welcomeMessageElement) return;

    const welcomeItem = Array.isArray(siteContents)
      ? siteContents.find((item) => item.item === "Welcome Message")
      : null;

    if (!welcomeItem) {
      welcomeMessageElement.textContent = "Welcome to Dulcinea Art!";
      return;
    }

    welcomeMessageElement.textContent =
      welcomeItem.value || "Welcome to Dulcinea Art!";
  };

  const toggleSectionState = (section, isEmpty, message) => {
    if (!section) return;
    const noticeSelector = "[data-empty-notice]";
    let notice = section.querySelector(noticeSelector);
    if (isEmpty) {
      if (!notice) {
        notice = document.createElement("p");
        notice.dataset.emptyNotice = "true";
        notice.className = "text-center text-muted mt-4 mb-0 display-7";
        section.appendChild(notice);
      }
      notice.textContent = message || "No items available at the moment.";
    } else if (notice) {
      notice.remove();
    }
  };

  const buildHeroSlide = (artwork, index) => {
    const slide = document.createElement("div");
    slide.className = "embla__slide slider-image item";
    if (index === 0) {
      slide.classList.add("active");
    }

    const slideContent = document.createElement("div");
    slideContent.className = "slide-content";

    const wrapper = document.createElement("div");
    wrapper.className = "item-wrapper";

    const imageContainer = document.createElement("div");
    imageContainer.className = "item-img";

    const image = document.createElement("img");
    image.src = resolveImageUrl(artwork.thumbnail);
    image.alt = artwork.title || "Featured artwork";
    image.loading = "lazy";
    image.dataset.slideTo = String(index);
    image.dataset.bsSlideTo = String(index);

    imageContainer.appendChild(image);
    wrapper.appendChild(imageContainer);
    slideContent.appendChild(wrapper);
    slide.appendChild(slideContent);

    return slide;
  };

  const reinitHeroCarousel = () => {
    if (!heroSection) return;
    const viewport = heroSection.querySelector(".embla__viewport");
    if (!viewport || typeof EmblaCarousel !== "function") {
      return;
    }

    const prevButton = heroSection.querySelector(".embla__button--prev");
    const nextButton = heroSection.querySelector(".embla__button--next");

    const swapNode = (node) => {
      if (!node) return null;
      const clone = node.cloneNode(true);
      node.parentNode.replaceChild(clone, node);
      return clone;
    };

    const freshPrev = swapNode(prevButton);
    const freshNext = swapNode(nextButton);

    const embla = EmblaCarousel(viewport, {
      align: "center",
      containScroll: "trimSnaps",
      loop: true,
      draggable: true,
      skipSnaps: false,
    });

    if (freshPrev) {
      freshPrev.addEventListener("click", embla.scrollPrev, false);
    }
    if (freshNext) {
      freshNext.addEventListener("click", embla.scrollNext, false);
    }
  };

  const enableEmblaButtons = () => {
    const prevBtn = document.querySelector(".embla__button--prev");
    const nextBtn = document.querySelector(".embla__button--next");
    if (prevBtn) prevBtn.removeAttribute("disabled");
    if (nextBtn) nextBtn.removeAttribute("disabled");
  };

  const renderHero = (artworks) => {
    if (!heroSection) return;
    const container = heroSection.querySelector(".embla__container");
    if (!container) return;

    clearChildren(container);

    if (!Array.isArray(artworks) || artworks.length === 0) {
      toggleSectionState(heroSection, true, "No featured artworks found.");
      return;
    }

    artworks.slice(0, 10).forEach((artwork, index) => {
      const slide = buildHeroSlide(artwork, index);
      container.appendChild(slide);
    });

    toggleSectionState(heroSection, false);
    reinitHeroCarousel();
    enableEmblaButtons();
  };

  const buildCategoryCard = (category) => {
    const item = document.createElement("div");
    item.className = "item features-image col-12 col-md-6 col-lg-3";

    const wrapper = document.createElement("div");
    wrapper.className = "item-wrapper";

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "item-img";

    const link = document.createElement("a");
    link.href = buildArtsLink(category.id);

    const image = document.createElement("img");
    image.src = resolveImageUrl(category.thumbnail);
    image.alt = category.name || "Category";
    image.loading = "lazy";

    link.appendChild(image);
    imageWrapper.appendChild(link);

    const content = document.createElement("div");
    content.className = "item-content align-left";

    const title = document.createElement("h5");
    title.className = "item-title mbr-fonts-style display-7";
    title.innerHTML = `<strong>${category.name || "Category"}</strong>`;

    const description = document.createElement("p");
    description.className = "mbr-text mbr-fonts-style display-4";
    const truncatedDescription = truncate(category.description || "", 50);
    description.innerHTML = truncatedDescription.replace(/\n/g, "<br>");

    content.appendChild(title);
    content.appendChild(description);

    const footer = document.createElement("div");
    footer.className = "mbr-section-btn item-footer";

    const button = document.createElement("a");
    button.className = "btn item-btn btn-warning display-4";
    button.href = buildArtsLink(category.id);
    button.textContent = "View Arts";

    footer.appendChild(button);

    wrapper.appendChild(imageWrapper);
    wrapper.appendChild(content);
    wrapper.appendChild(footer);
    item.appendChild(wrapper);

    return item;
  };

  const renderCategories = (categories) => {
    if (!categoriesRows.length) return;
    categoriesRows.forEach((row) => clearChildren(row));

    if (!Array.isArray(categories) || categories.length === 0) {
      categoriesRows.forEach((row) =>
        toggleSectionState(
          row.closest("section"),
          true,
          "No categories available yet."
        )
      );
      return;
    }

    const cardsPerRow = 4;
    categories.forEach((category, index) => {
      const rowIndex = Math.min(
        Math.floor(index / cardsPerRow),
        categoriesRows.length - 1
      );
      const row = categoriesRows[rowIndex];
      if (!row) return;
      row.appendChild(buildCategoryCard(category));
    });

    categoriesRows.forEach((row) => {
      if (!row.children.length) {
        const section = row.closest("section");
        if (section) {
          section.classList.add("d-none");
        }
      } else {
        const section = row.closest("section");
        if (section) {
          section.classList.remove("d-none");
          toggleSectionState(section, false);
        }
      }
    });
  };

  const buildSpotlightCard = (artwork) => {
    const item = document.createElement("div");
    item.className = "item features-image col-12 col-md-6 col-lg-3";

    const wrapper = document.createElement("div");
    wrapper.className = "item-wrapper";

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "item-img";

    const link = document.createElement("a");
    link.href = buildDetailsLink(artwork.id);

    const image = document.createElement("img");
    image.src = resolveImageUrl(artwork.thumbnail);
    image.alt = artwork.title || "Artwork";
    image.loading = "lazy";

    link.appendChild(image);
    imageWrapper.appendChild(link);

    const content = document.createElement("div");
    content.className = "item-content align-left";

    // Artwork title
    const title = document.createElement("h5");
    title.className = "item-title mbr-fonts-style display-7";
    title.innerHTML = `<strong>${artwork.title || "Artwork"}</strong>`;
    content.appendChild(title);

    // Artwork notes (truncated to 50 characters)
    if (artwork.notes) {
      const notes = document.createElement("p");
      notes.className = "mbr-text mbr-fonts-style display-4 text-muted";
      notes.textContent = truncate(artwork.notes, 50); // Truncate to 50 chars
      content.appendChild(notes);
    }

    const footer = document.createElement("div");
    footer.className = "mbr-section-btn item-footer";

    const button = document.createElement("a");
    button.className = "btn item-btn btn-primary display-4";
    button.href = buildDetailsLink(artwork.id);
    button.textContent = "View Details";

    footer.appendChild(button);

    wrapper.appendChild(imageWrapper);
    wrapper.appendChild(content);
    wrapper.appendChild(footer);
    item.appendChild(wrapper);

    return item;
  };

  const renderSpotlight = (artworks) => {
    if (!spotlightRow) return;
    clearChildren(spotlightRow);

    const spotlight = Array.isArray(artworks)
      ? artworks.filter(
          (artwork) =>
            artwork &&
            (artwork.isSpotlight === "1" || artwork.isSpotlight === true)
        )
      : [];

    if (!spotlight.length) {
      toggleSectionState(
        spotlightRow.closest("section"),
        true,
        "Spotlight artworks will appear here soon."
      );
      return;
    }

    spotlight.forEach((artwork) => {
      spotlightRow.appendChild(buildSpotlightCard(artwork));
    });

    toggleSectionState(spotlightRow.closest("section"), false);
  };

  const initialiseLandingPage = async () => {
    try {
      const [
        artworksResponse,
        categoriesResponse,
        siteContentsResponse,
        spotlightArtworksResponse,
      ] = await Promise.all([
        fetchJson("/api/artworks", {
          query: { limit: 10, isRandom: true },
        }),
        fetchJson("/api/categories", {
          query: { all: true },
        }),
        fetchJson("/api/site-contents", {
          query: { all: true },
        }),
        fetchJson("/api/artworks", {
          query: { isSpotlight: true },
        }),
      ]);

      const artworks = artworksResponse?.artworks || [];
      const categories = categoriesResponse?.categories || [];
      const siteContents = siteContentsResponse?.siteContents || [];
      const spotlightArtworks = spotlightArtworksResponse?.artworks || [];

      renderHero(artworks);
      renderCategories(
        categories.filter((category) => category.name !== "Artist-Bio-Pics")
      );
      renderSpotlight(spotlightArtworks.filter((art) => art.status !== "Sold"));
      renderWelcomeMessage(siteContents);
    } catch (error) {
      console.error("Failed to initialise landing page", error);
      toggleSectionState(
        heroSection,
        true,
        "Unable to load featured artworks."
      );
      categoriesRows.forEach((row) =>
        toggleSectionState(
          row.closest("section"),
          true,
          "Unable to load categories at the moment."
        )
      );
      toggleSectionState(
        spotlightRow?.closest("section"),
        true,
        "Unable to load spotlight artworks."
      );
    }
  };

  document.addEventListener("DOMContentLoaded", initialiseLandingPage);
})();

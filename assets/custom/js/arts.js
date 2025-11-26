(() => {
  const {
    fetchJson,
    resolveImageUrl,
    truncate,
    clearChildren,
    parseQuery,
    getFavorites,
    addFavorite,
    removeFavorite,
    buildDetailsLink,
  } = window.DulcineaUtils || {};

  if (
    !fetchJson ||
    !resolveImageUrl ||
    !truncate ||
    !parseQuery ||
    !getFavorites ||
    !addFavorite ||
    !removeFavorite ||
    !buildDetailsLink
  ) {
    console.error("Dulcinea utilities are missing. Aborting arts page init.");
    return;
  }

  const query = parseQuery();
  const categoryId = query.category;

  const categoryTitle = document.querySelector("[data-category-title]");
  const categoryDescription = document.querySelector(
    "[data-category-description]"
  );
  const favoritesSubtitle = document.querySelector("[data-favorites-subtitle]");
  const favoritesGrid = document.querySelector("[data-favorites-grid]");
  const artworksGrid = document.querySelector("[data-art-grid]");

  if (!categoryId) {
    if (categoryTitle) {
      categoryTitle.textContent = "Category not specified";
    }
    if (categoryDescription) {
      categoryDescription.textContent =
        "Use category links from the landing page to explore curated artworks.";
    }
    return;
  }

  const state = {
    artworks: [],
    favorites: new Set(getFavorites()),
  };

  const updateFavoritesSubtitle = (hasFavorites) => {
    if (!favoritesSubtitle) return;
    favoritesSubtitle.textContent = hasFavorites ? "" : "No favorites";
  };

  const handleFavoriteToggle = (artworkId, shouldFavorite) => {
    if (shouldFavorite) {
      addFavorite(artworkId);
      state.favorites.add(Number(artworkId));
    } else {
      removeFavorite(artworkId);
      state.favorites.delete(Number(artworkId));
    }
    render();
  };

  const buildCard = (artwork, { isFavorite }) => {
    console.log("artwork", artwork);
    const item = document.createElement("div");
    item.className = "item features-image col-12 col-md-6 col-lg-3";

    const wrapper = document.createElement("div");
    wrapper.className = "item-wrapper";

    // IMAGE WRAPPER
    const imageWrapper = document.createElement("div");
    imageWrapper.className = "item-img";

    const image = document.createElement("img");
    image.src = resolveImageUrl(artwork.thumbnail);
    image.alt = artwork.title || "Artwork";
    image.loading = "lazy";

    imageWrapper.appendChild(image);

    // CONTENT BLOCK
    const content = document.createElement("div");
    content.className = "item-content"; // ← required for padding

    // TITLE
    const title = document.createElement("h5");
    title.className = "item-title mbr-fonts-style display-7";
    title.innerHTML = `<strong>${artwork.title || "Untitled"}</strong>`;

    // DESCRIPTION – matching static card: display-4 + <p>
    const description = document.createElement("p");
    description.className = "mbr-text mbr-fonts-style display-4";
    description.textContent = truncate(artwork.notes || "", 50);

    // FOOTER BUTTONS (correct Mobirise layout)
    const footer = document.createElement("div");
    footer.className = "mbr-section-btn item-footer";

    // DETAILS BUTTON
    const detailsLink = document.createElement("a");
    detailsLink.className = "btn item-btn btn-primary display-4";
    detailsLink.href = `${buildDetailsLink(
      artwork.id
    )}&category=${encodeURIComponent(categoryId)}`;
    detailsLink.textContent = "See Details";

    // FAVORITE BUTTON
    const favoriteButton = document.createElement("a");
    favoriteButton.className = isFavorite
      ? "btn item-btn btnwhite btn-danger display-4"
      : "btn item-btn btn-warning btnblack display-4";

    favoriteButton.innerHTML = isFavorite
      ? `<span class="fa fa-heart mbr-iconfont mbr-iconfont-btn" style="color: rgb(249, 44, 80);"></span>Favorite`
      : `<span class="mobi-mbri mobi-mbri-hearth mbr-iconfont mbr-iconfont-btn"></span>Mark As Favorite`;

    favoriteButton.addEventListener("click", (e) => {
      e.preventDefault();
      handleFavoriteToggle(artwork.id, !isFavorite);
    });

    footer.appendChild(detailsLink);
    footer.appendChild(favoriteButton);

    // BUILD CARD
    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(footer);

    wrapper.appendChild(imageWrapper);
    wrapper.appendChild(content);
    item.appendChild(wrapper);

    return item;
  };

  const renderFavorites = () => {
    if (!favoritesGrid) return;
    clearChildren(favoritesGrid);

    const favorites = state.artworks.filter((artwork) =>
      state.favorites.has(Number(artwork.id))
    );

    if (!favorites.length) {
      updateFavoritesSubtitle(false);
      return;
    }

    updateFavoritesSubtitle(true);

    favorites.forEach((artwork) =>
      favoritesGrid.appendChild(buildCard(artwork, { isFavorite: true }))
    );
  };

  const renderAllArtworks = () => {
    if (!artworksGrid) return;
    clearChildren(artworksGrid);

    const remaining = state.artworks.filter(
      (artwork) => !state.favorites.has(Number(artwork.id))
    );

    if (!remaining.length) {
      return;
    }

    remaining.forEach((artwork) =>
      artworksGrid.appendChild(buildCard(artwork, { isFavorite: false }))
    );
  };

  const render = () => {
    renderFavorites();
    renderAllArtworks();
  };

  const hydrateCategoryHeader = (category) => {
    if (categoryTitle) {
      categoryTitle.textContent = category?.name || "Untitled Category";
    }
    if (categoryDescription) {
      console.log("category", category);
      const description =
        (category && category.description) ||
        "Explore the artworks curated for this category.";
      console.log("description", description);
      categoryDescription.textContent = description;
      console.log("categoryDescription", categoryDescription);
    }
    // The theme script adds a "hidden" + animation classes to many elements
    // on load. When we hydrate dynamic content the header elements can remain
    // hidden. Make sure the header title/description/button are visible.
    try {
      const headerWrapper = categoryTitle?.closest(".content-wrapper");
      const headerBtn = headerWrapper?.querySelector(".mbr-section-btn");
      [categoryTitle, categoryDescription, headerBtn].forEach((el) => {
        if (!el) return;
        el.classList.remove(
          "hidden",
          "animate__animated",
          "animate__delay-1s",
          "animate__fadeIn"
        );
        el.style.display = "";
        el.style.opacity = "";
      });
    } catch (err) {}
    // Mark the header as hydrated and add a CSS override so the theme's
    // animation system can't keep these elements invisible.
    try {
      const headerSection = document.querySelector("#header01-1l");
      if (headerSection) {
        headerSection.setAttribute("data-hydrated", "true");

        // Add a one-time style override to force visibility for hydrated header
        if (!document.getElementById("dulcinea-arts-hydrate-style")) {
          const style = document.createElement("style");
          style.id = "dulcinea-arts-hydrate-style";
          style.textContent = `#header01-1l[data-hydrated="true"] .mbr-section-title, #header01-1l[data-hydrated="true"] .mbr-text, #header01-1l[data-hydrated="true"] .mbr-section-btn { visibility: visible !important; opacity: 1 !important; display: block !important; transform: none !important; }`;
          document.head.appendChild(style);
        }

        // Safety: some theme logic may re-add hidden classes later — run a
        // delayed cleanup to remove them again and ensure visibility.
        setTimeout(() => {
          try {
            const hdr = document.querySelector("#header01-1l");
            if (!hdr) return;
            hdr
              .querySelectorAll(
                ".hidden, .animate__animated, .animate__delay-1s, .animate__fadeIn"
              )
              .forEach((n) => {
                n.classList.remove(
                  "hidden",
                  "animate__animated",
                  "animate__delay-1s",
                  "animate__fadeIn"
                );
                n.style.opacity = "";
                n.style.display = "";
              });
          } catch (e) {
            /* ignore */
          }
        }, 700);
        // Ensure the header keeps enough vertical space while the rest of the
        // page is rendered to avoid the visual collapse you described.
        try {
          headerSection.style.minHeight = "350px";
        } catch (e) {
          // ignore
        }
        // (removed dynamic favorites margin — spacing will be handled via CSS)
      }
    } catch (err) {
      // ignore
    }
  };

  const initialise = async () => {
    try {
      const [categoryResponse, artworksResponse] = await Promise.all([
        fetchJson(`/api/categories/${categoryId}`),
        fetchJson("/api/artworks", {
          query: { category: categoryId, all: true },
        }),
      ]);

      if (categoryResponse?.success) {
        hydrateCategoryHeader(categoryResponse.data);
      } else {
        hydrateCategoryHeader(null);
      }

      const artworks = artworksResponse?.artworks || [];
      state.artworks = artworks;
      render();
    } catch (error) {
      console.error("Failed to load category artworks", error);
      hydrateCategoryHeader(null);
    }
  };

  document.addEventListener("DOMContentLoaded", initialise);
})();

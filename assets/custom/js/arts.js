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

  const toggleEmptyNotice = (container, message) => {
    return null;
    // if (!container) return;
    // const noticeSelector = "[data-empty-notice]";
    // let notice = container.querySelector(noticeSelector);

    // if (message) {
    //   if (!notice) {
    //     notice = document.createElement("p");
    //     notice.dataset.emptyNotice = "true";
    //     notice.className = "text-center text-muted mt-4 mb-0 display-7";
    //     container.appendChild(notice);
    //   }
    //   notice.textContent = message;
    // } else if (notice) {
    //   notice.remove();
    // }
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
      toggleEmptyNotice(
        favoritesGrid,
        "You have not marked any favorites yet."
      );
      return;
    }

    updateFavoritesSubtitle(true);
    toggleEmptyNotice(favoritesGrid, null);

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
      toggleEmptyNotice(
        artworksGrid,
        "All artworks for this category are favorited."
      );
      return;
    }

    toggleEmptyNotice(artworksGrid, null);

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
      const description =
        (category && category.description) ||
        "Explore the artworks curated for this category.";
      categoryDescription.textContent = description;
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
      toggleEmptyNotice(
        artworksGrid,
        "Unable to load artworks right now. Please try again later."
      );
    }
  };

  document.addEventListener("DOMContentLoaded", initialise);
})();

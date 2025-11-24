(() => {
  const config = window.DulcineaConfig || {
    API_URL: "http://localhost:5000",
    FAVORITES_STORAGE_KEY: "dulcinea:favorites",
  };

  const PLACEHOLDER_IMAGE = "assets/images/art20coming20soon-500x500.png";

  const normalizeId = (id) =>
    typeof id === "number" ? id : Number.parseInt(id, 10);

  const buildApiEndpoint = (path = "", query = {}) => {
    const sanitizedPath = path.startsWith("/") ? path : `/${path}`;
    const url = new URL(`${config.API_URL}${sanitizedPath}`);

    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        return;
      }
      url.searchParams.append(key, value);
    });

    return url.toString();
  };

  const fetchJson = async (path, { query, headers, ...options } = {}) => {
    const url = buildApiEndpoint(path, query);

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        ...(headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      const error = new Error(
        errorText || `Request failed with status ${response.status}`
      );
      error.status = response.status;
      throw error;
    }

    const raw = await response.text();
    return raw ? JSON.parse(raw) : null;
  };

  const resolveImageUrl = (filename) => {
    if (!filename) {
      return PLACEHOLDER_IMAGE;
    }

    if (/^https?:\/\//i.test(filename)) {
      return filename;
    }

    return `${config.API_URL}/artworks/${filename.replace(/^\/+/, "")}`;
  };

  const truncate = (text, maxLength = 90) => {
    if (!text) {
      return "";
    }
    const clean = String(text).trim();
    if (clean.length <= maxLength) {
      return clean;
    }
    return `${clean.slice(0, maxLength - 1)}…`;
  };

  const clearChildren = (node) => {
    if (!node) return;
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  };

  const parseQuery = () => {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    params.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  };

  const getFavorites = () => {
    try {
      const raw = window.localStorage.getItem(config.FAVORITES_STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed
        .map((value) => normalizeId(value))
        .filter((value) => Number.isInteger(value) && value > 0);
    } catch (error) {
      console.warn("Unable to read favorites from storage", error);
      return [];
    }
  };

  const setFavorites = (ids) => {
    try {
      window.localStorage.setItem(
        config.FAVORITES_STORAGE_KEY,
        JSON.stringify(Array.from(new Set(ids)))
      );
    } catch (error) {
      console.warn("Unable to persist favorites", error);
    }
  };

  const addFavorite = (id) => {
    const normalized = normalizeId(id);
    if (!Number.isInteger(normalized) || normalized <= 0) {
      return;
    }
    const favorites = getFavorites();
    if (!favorites.includes(normalized)) {
      favorites.push(normalized);
      setFavorites(favorites);
    }
  };

  const removeFavorite = (id) => {
    const normalized = normalizeId(id);
    if (!Number.isInteger(normalized) || normalized <= 0) {
      return;
    }
    const favorites = getFavorites().filter((favoriteId) => favoriteId !== normalized);
    setFavorites(favorites);
  };

  const isFavorite = (id) => {
    const normalized = normalizeId(id);
    return getFavorites().includes(normalized);
  };

  const buildDetailsLink = (artworkId) =>
    `details.html?id=${encodeURIComponent(artworkId)}`;

  const buildArtsLink = (categoryId) =>
    `arts.html?category=${encodeURIComponent(categoryId)}`;

  window.DulcineaUtils = {
    buildApiEndpoint,
    fetchJson,
    resolveImageUrl,
    truncate,
    clearChildren,
    parseQuery,
    getFavorites,
    setFavorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    buildDetailsLink,
    buildArtsLink,
    PLACEHOLDER_IMAGE,
  };
})();



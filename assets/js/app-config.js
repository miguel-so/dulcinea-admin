(function () {
  const normalizeUrl = (value) => {
    if (!value) return '';
    try {
      const trimmed = value.trim();
      if (!trimmed) return '';
      const url = new URL(trimmed, window.location.origin);
      return url.origin;
    } catch (error) {
      console.warn('[AppConfig] Invalid BASE_URL provided, falling back to window.location.origin.', error);
      return '';
    }
  };

  const envSources = [
    window.__ENV?.BASE_URL,
    window.ENV?.BASE_URL,
    window.BASE_URL,
    document.querySelector('meta[name="base-url"]')?.getAttribute('content'),
  ];

  const providedBaseUrl = envSources.find((value) => typeof value === 'string' && value.trim().length > 0);
  const resolvedBaseUrl = normalizeUrl(providedBaseUrl) || window.location.origin;

  const buildUrl = (path) => {
    if (!path) return resolvedBaseUrl;
    const pathIsAbsolute = /^https?:\/\//i.test(path);
    if (pathIsAbsolute) return path;
    const normalizedBase = resolvedBaseUrl.replace(/\/$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${normalizedBase}${normalizedPath}`;
  };

  const resolveArtworkAsset = (fileName) => {
    if (!fileName) return '';
    return buildUrl(`/artworks/${fileName}`);
  };

  const getQueryParam = (key) => {
    if (!key) return null;
    return new URLSearchParams(window.location.search).get(key);
  };

  const storageKey = 'favoriteArtworks';

  const getFavorites = () => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return new Set();
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return new Set();
      return new Set(parsed.filter((value) => typeof value === 'string' || typeof value === 'number'));
    } catch (error) {
      console.warn('[Favorites] Failed to parse favorites from localStorage.', error);
      return new Set();
    }
  };

  const saveFavorites = (favoritesSet) => {
    try {
      const list = Array.from(favoritesSet);
      window.localStorage.setItem(storageKey, JSON.stringify(list));
    } catch (error) {
      console.warn('[Favorites] Failed to persist favorites.', error);
    }
  };

  const toggleFavorite = (artworkId) => {
    const favorites = getFavorites();
    if (favorites.has(artworkId)) {
      favorites.delete(artworkId);
    } else {
      favorites.add(artworkId);
    }
    saveFavorites(favorites);
    return favorites.has(artworkId);
  };

  const isFavorite = (artworkId) => getFavorites().has(artworkId);

  const request = async (path, options = {}) => {
    const url = buildUrl(path);
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      const error = new Error(`Request to ${url} failed with status ${response.status}`);
      error.response = response;
      throw error;
    }

    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return response.json();
    }
    return response.text();
  };

  window.App = window.App || {};
  window.App.buildUrl = buildUrl;
  window.App.resolveArtworkAsset = resolveArtworkAsset;
  window.App.getQueryParam = getQueryParam;
  window.App.request = request;
  window.App.toggleFavorite = toggleFavorite;
  window.App.isFavorite = isFavorite;
  window.App.getFavorites = () => Array.from(getFavorites());
  window.App.baseUrl = resolvedBaseUrl;
})();

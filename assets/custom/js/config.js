(() => {
  const DEFAULT_API_URL = "http://localhost:5000";

  const fromWindow =
    typeof window !== "undefined" &&
    window.__ENV__ &&
    typeof window.__ENV__.API_URL === "string"
      ? window.__ENV__.API_URL
      : null;

  const metaTag = document.querySelector('meta[name="api-url"]');
  const fromMeta =
    metaTag && typeof metaTag.content === "string" && metaTag.content.trim()
      ? metaTag.content.trim()
      : null;

  const resolvedUrl =
    fromWindow && fromWindow.trim().length
      ? fromWindow
      : fromMeta && fromMeta.trim().length
      ? fromMeta
      : DEFAULT_API_URL;

  const normalizedUrl = resolvedUrl.replace(/\/+$/, "");

  const config = Object.freeze({
    API_URL: normalizedUrl,
    FAVORITES_STORAGE_KEY: "dulcinea:favorites",
  });

  window.DulcineaConfig = config;
  window.getApiUrl = () => config.API_URL;
})();



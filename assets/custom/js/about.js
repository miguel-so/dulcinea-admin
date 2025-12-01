(() => {
  const { fetchJson } = window.DulcineaUtils || {};

  if (!fetchJson) {
    console.error("Dulcinea utilities missing — aborting about page init.");
    return;
  }

  // DOM Elements
  const nameElement = document.getElementById("artist-name");
  const bioElement = document.getElementById("artist-bio");
  const instaElement = document.getElementById("artist-instagram");

  const loadArtistInfo = async () => {
    try {
      const response = await fetchJson("/api/site-contents", {
        query: { all: true },
      });

      const siteContents = response?.siteContents || [];

      const getValue = (key) =>
        siteContents.find((i) => i.item === key)?.value || "";

      // Extract fields
      const artistName = getValue("Artist Display Name");
      const artistBio = getValue("Artist Bio");
      const instagramLink = getValue("Artist Instagram Link");
      console.log("artistName", artistName);
      console.log("artistBio", artistBio);
      console.log("instagramLink", instagramLink);

      // Update page
      if (nameElement) nameElement.textContent = artistName || "Artist";
      if (bioElement)
        bioElement.textContent =
          artistBio || "Biography information is coming soon.";
      if (instaElement) {
        instaElement.href = instagramLink || "#";
        instaElement.textContent =
          instagramLink || "Instagram link not available";
      }
    } catch (err) {
      console.error("Failed loading artist info:", err);
    }
  };

  document.addEventListener("DOMContentLoaded", loadArtistInfo);
})();

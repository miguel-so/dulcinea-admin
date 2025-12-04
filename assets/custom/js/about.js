(() => {
  const { fetchJson, resolveImageUrl } = window.DulcineaUtils || {};

  if (!fetchJson || !resolveImageUrl) {
    console.error("Dulcinea utilities missing — aborting about page init.");
    return;
  }

  // DOM Elements
  const nameElement = document.getElementById("artist-name");
  const bioElement = document.getElementById("artist-bio");
  const instaElement = document.getElementById("artist-instagram");
  const galleryContainer = document.querySelector(".gallery01 .row");

  const loadArtistInfo = async () => {
    try {
      // Fetch site contents
      const siteContentsResponse = await fetchJson("/api/site-contents", {
        query: { all: true },
      });
      const categoriesResponse = await fetchJson("/api/categories", {
        query: { all: true },
      });

      const categories = categoriesResponse?.categories || [];
      const artistBioCategory = categories.find(
        (cat) => cat.name === "Artist-Bio-Pics"
      );

      let artistBioArtworks = [];
      if (artistBioCategory) {
        const artistBioArtworksResponse = await fetchJson(
          "/api/artworks?category=" + artistBioCategory.id,
          { query: { all: true } }
        );
        artistBioArtworks = artistBioArtworksResponse?.artworks || [];
      }

      const siteContents = siteContentsResponse?.siteContents || [];
      const getValue = (key) =>
        siteContents.find((i) => i.item === key)?.value || "";

      // Update page
      if (nameElement)
        nameElement.textContent = getValue("Artist Display Name") || "Artist";
      if (bioElement)
        bioElement.innerHTML = (
          getValue("Artist Bio") || "Biography information is coming soon."
        ).replace(/\n/g, "<br>");
      if (instaElement) {
        const instaLink = getValue("Artist Instagram Link");
        instaElement.href = instaLink || "#";
        instaElement.textContent = instaLink
          ? "Instagram"
          : "Instagram link not available";
      }

      // Populate gallery dynamically
      if (galleryContainer && artistBioArtworks.length) {
        galleryContainer.innerHTML = ""; // clear existing items
        artistBioArtworks.forEach((artwork) => {
          const col = document.createElement("div");
          col.className = "item features-image col-12 col-lg-2 col-md-6";

          const wrapper = document.createElement("div");
          wrapper.className = "item-wrapper";

          const link = document.createElement("a");
          link.href = "#"; // optionally link to artwork detail page

          const imgDiv = document.createElement("div");
          imgDiv.className = "item-img";

          const img = document.createElement("img");
          img.src = resolveImageUrl(artwork.thumbnail);
          img.alt = artwork.title || "Artist Artwork";

          imgDiv.appendChild(img);
          link.appendChild(imgDiv);
          wrapper.appendChild(link);
          col.appendChild(wrapper);
          galleryContainer.appendChild(col);
        });
      }
    } catch (err) {
      console.error("Failed loading artist info:", err);
    }
  };

  document.addEventListener("DOMContentLoaded", loadArtistInfo);
})();

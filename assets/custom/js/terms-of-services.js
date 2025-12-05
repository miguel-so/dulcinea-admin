(() => {
  const { fetchJson } = window.DulcineaUtils || {};

  if (!fetchJson) {
    console.error(
      "Dulcinea utilities missing — aborting terms of services init."
    );
    return;
  }

  const termsElement = document.getElementById("terms-of-services");

  const loadTermsOfServices = async () => {
    try {
      const siteContentsResponse = await fetchJson("/api/site-contents", {
        query: { all: true },
      });

      const siteContents = siteContentsResponse?.siteContents || [];

      const getValue = (key) =>
        siteContents.find((i) => i.item === key)?.value || "";

      const termsText =
        getValue("Terms of Services") ||
        "Terms of Services content will be updated soon.";

      if (termsElement) {
        termsElement.innerHTML = termsText.replace(/\n/g, "<br>");
      }
    } catch (err) {
      console.error("Failed loading Terms of Services:", err);
    }
  };

  document.addEventListener("DOMContentLoaded", loadTermsOfServices);
})();

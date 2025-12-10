(() => {
  const { fetchJson } = window.DulcineaUtils || {};

  if (!fetchJson) {
    console.error("Dulcinea utilities missing — aborting privacy policy init.");
    return;
  }

  // DOM element that will receive the privacy policy
  const policyElement = document.getElementById("privacy-policy-content");

  const hidePageLoader = () => {
    const loader = document.getElementById("page-loader");
    if (loader) loader.style.display = "none";
  };

  const loadPrivacyPolicy = async () => {
    try {
      const siteContentsResponse = await fetchJson("/api/site-contents", {
        query: { all: true },
      });

      const siteContents = siteContentsResponse?.siteContents || [];

      const getValue = (key) =>
        siteContents.find((i) => i.item === key)?.value || "";

      const policyText =
        getValue("Privacy Policy") ||
        "Privacy policy content will be updated soon.";

      if (policyElement) {
        policyElement.innerHTML = policyText.replace(/\n/g, "<br>");
      }
    } catch (err) {
      console.error("Failed loading privacy policy:", err);
    } finally {
      hidePageLoader();
    }
  };

  document.addEventListener("DOMContentLoaded", loadPrivacyPolicy);
})();

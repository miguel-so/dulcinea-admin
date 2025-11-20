const API_BASE = (window.APP_CONFIG && window.APP_CONFIG.API_URL) || "";

window.App = {
  getQueryParam: (name) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  },
  request: async (endpoint, options = {}) => {
    const url = API_BASE + endpoint;
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
    if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
    return res.json();
  },
};

(function () {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const successAlert = form.querySelector("[data-form-alert]");
  const errorAlert = form.querySelector("[data-form-alert-danger]");
  const submitButton = form.querySelector("[data-contact-submit]");
  const contextElement = document.querySelector("[data-artwork-context]");

  const artworkId = window.App.getQueryParam("artworkId");

  const setAlert = (element, message) => {
    if (!element) return;
    if (!message) {
      element.setAttribute("hidden", "hidden");
      element.textContent = "";
      return;
    }
    element.removeAttribute("hidden");
    element.textContent = message;
  };

  const clearAlerts = () => {
    setAlert(successAlert, "");
    setAlert(errorAlert, "");
  };

  const setLoading = (isLoading) => {
    if (!submitButton) return;
    submitButton.disabled = isLoading;
    submitButton.textContent = isLoading ? "Sending..." : "SEND NOW";
  };

  if (contextElement) {
    if (artworkId) {
      contextElement.removeAttribute("hidden");
      contextElement.textContent = `We will share this message with the artist for artwork.`;
    } else {
      contextElement.setAttribute("hidden", "hidden");
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearAlerts();

    const formData = new FormData(form);
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const phone = formData.get("phone")?.toString().trim();
    const message = formData.get("message")?.toString().trim();

    if (!name || !email || !message) {
      setAlert(errorAlert, "Name, email, and message are required.");
      return;
    }

    const payload = { name, email, phone: phone || "", message };
    if (artworkId) payload.artworkId = artworkId;

    try {
      setLoading(true);
      await window.App.request("/api/contact", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setAlert(
        successAlert,
        "Thanks for reaching out! The artist will be notified shortly."
      );
      form.reset();
    } catch (error) {
      console.error("Failed to submit contact form", error);
      setAlert(
        errorAlert,
        "We were unable to send your message. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  });
})();

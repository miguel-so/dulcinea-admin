(() => {
  const { fetchJson, parseQuery } = window.DulcineaUtils || {};

  if (!fetchJson || !parseQuery) {
    console.error(
      "Dulcinea utilities are missing. Aborting contact form init."
    );
    return;
  }

  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const nameInput = form.querySelector("[data-input-name]");
  const emailInput = form.querySelector("[data-input-email]");
  const phoneInput = form.querySelector("[data-input-phone]");
  const messageInput = form.querySelector("[data-input-message]");
  const submitButton = form.querySelector("[data-submit-button]");
  const successAlert = form.querySelector("[data-success-alert]");
  const errorAlert = form.querySelector("[data-error-alert]");

  // ---- NEW anti-spam fields ----
  const honeypot = form.querySelector("#hp_check");
  const tStart = form.querySelector("#t_start");
  const tokenEl = form.querySelector("#token");

  // Set timestamp + random token
  tStart.value = Date.now().toString();
  tokenEl.value = crypto.randomUUID();

  const query = parseQuery();
  const artworkId = query.artworkId || query.id || null;

  const hideAlerts = () => {
    if (successAlert) successAlert.setAttribute("hidden", "hidden");
    if (errorAlert) errorAlert.setAttribute("hidden", "hidden");
  };

  const showAlert = (element, message) => {
    if (!element) return;
    element.removeAttribute("hidden");
    element.textContent = message;
  };

  const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const canSubmit = () => {
    const name = nameInput?.value.trim();
    const email = emailInput?.value.trim();
    const message = messageInput?.value.trim();
    return Boolean(name && email && message && isValidEmail(email));
  };

  const toggleSubmitState = () => {
    if (!submitButton) return;
    submitButton.disabled = !canSubmit();
  };

  const setSubmitting = (isSubmitting) => {
    if (!submitButton) return;
    submitButton.disabled = isSubmitting || !canSubmit();
    submitButton.textContent = isSubmitting ? "Sending..." : "SEND NOW";
  };

  const resetForm = () => {
    form.reset();
    toggleSubmitState();
  };

  form.addEventListener("input", toggleSubmitState);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    hideAlerts();

    // ---- Anti-spam checks BEFORE sending ----
    if (honeypot.value) {
      console.warn("Spam bot detected (honeypot filled)");
      return;
    }

    const elapsed = Date.now() - Number(tStart.value);
    if (elapsed < 2500) {
      console.warn("Spam bot detected (submitted too fast)");
      return;
    }

    if (!canSubmit()) return;

    setSubmitting(true);

    const payload = {
      name: nameInput?.value.trim(),
      email: emailInput?.value.trim(),
      phone: phoneInput?.value.trim() || undefined,
      message: messageInput?.value.trim(),
      artworkId: artworkId || undefined,
    };

    try {
      await fetchJson("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      showAlert(
        successAlert,
        "Thank you! Your message has been shared with the artist."
      );
      resetForm();
    } catch (error) {
      console.error("Failed to submit contact form", error);
      showAlert(
        errorAlert,
        "We could not send your message. Please try again shortly."
      );
    } finally {
      setSubmitting(false);
    }
  });

  // Initialise button state
  toggleSubmitState();
})();

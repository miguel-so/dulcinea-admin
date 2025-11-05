(function () {
  const grid = document.querySelector('[data-artworks-grid]');
  const feedback = document.querySelector('[data-artworks-feedback]');

  if (!grid || !feedback) {
    return;
  }

  const setFeedback = (message, { hidden = false, tone = 'info' } = {}) => {
    feedback.textContent = message || '';
    feedback.classList.remove('text-success', 'text-danger', 'text-info');

    switch (tone) {
      case 'success':
        feedback.classList.add('text-success');
        break;
      case 'danger':
        feedback.classList.add('text-danger');
        break;
      default:
        feedback.classList.add('text-info');
        break;
    }

    if (hidden || !message) {
      feedback.setAttribute('hidden', 'true');
    } else {
      feedback.removeAttribute('hidden');
    }
  };

  const updateFavoriteButton = (button, artworkId) => {
    const favorite = window.App.isFavorite(String(artworkId));
    button.innerHTML = `<span class="mobi-mbri mobi-mbri-hearth mbr-iconfont mbr-iconfont-btn"></span>${favorite ? 'Favorited' : 'Mark Favorite'}`;
    button.classList.toggle('btn-danger', !favorite);
    button.classList.toggle('btn-success', favorite);
    button.setAttribute('aria-pressed', favorite ? 'true' : 'false');
  };

  const createArtworkCard = (artwork) => {
    const col = document.createElement('div');
    col.className = 'item features-image col-12 col-md-6 col-lg-2';
    col.setAttribute('data-artwork-id', artwork.id);

    const wrapper = document.createElement('div');
    wrapper.className = 'item-wrapper';

    const imageContainer = document.createElement('div');
    imageContainer.className = 'item-img';

    const imgWrap = document.createElement('div');
    imgWrap.className = 'img-wrap';

    const img = document.createElement('img');
    img.alt = artwork.title || 'Artwork thumbnail';
    img.loading = 'lazy';
    const artworkImage = window.App.resolveArtworkAsset(artwork.thumbnail);
    img.src = artworkImage || 'assets/images/bg-365x362.png';

    imgWrap.appendChild(img);
    imageContainer.appendChild(imgWrap);

    const content = document.createElement('div');
    content.className = 'item-content';

    const title = document.createElement('h5');
    title.className = 'item-title mbr-fonts-style display-4';
    title.innerHTML = `<strong>${artwork.title || 'Untitled'}</strong>`;

    const description = document.createElement('h6');
    description.className = 'item-subtitle mbr-fonts-style display-4';
    description.textContent = artwork.note || 'No description available';

    const footer = document.createElement('div');
    footer.className = 'item-footer d-flex flex-column gap-2';

    const detailsButton = document.createElement('a');
    detailsButton.className = 'btn item-btn btn-secondary display-4';
    detailsButton.href = `details.html?id=${encodeURIComponent(artwork.id)}`;
    detailsButton.textContent = 'See Details';

    const favoriteButton = document.createElement('button');
    favoriteButton.type = 'button';
    favoriteButton.className = 'btn item-btn btn-danger display-4';
    favoriteButton.setAttribute('data-favorite-button', 'true');
    favoriteButton.setAttribute('data-artwork-id', artwork.id);

    updateFavoriteButton(favoriteButton, artwork.id);

    footer.appendChild(detailsButton);
    footer.appendChild(favoriteButton);

    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(footer);

    wrapper.appendChild(imageContainer);
    wrapper.appendChild(content);
    col.appendChild(wrapper);

    return col;
  };

  const renderArtworks = (artworks) => {
    grid.innerHTML = '';
    const fragment = document.createDocumentFragment();
    artworks.forEach((artwork) => {
      fragment.appendChild(createArtworkCard(artwork));
    });
    grid.appendChild(fragment);
  };

  const loadArtworks = async () => {
    try {
      setFeedback('Loading artworks...', { hidden: false, tone: 'info' });
      const data = await window.App.request('/api/artworks');

      if (!Array.isArray(data) || data.length === 0) {
        setFeedback('No artworks available at the moment. Please check back later.', { hidden: false, tone: 'info' });
        grid.innerHTML = '';
        return;
      }

      renderArtworks(data);
      setFeedback('', { hidden: true });
    } catch (error) {
      console.error('Failed to load artworks', error);
      setFeedback('We ran into a problem while loading artworks. Please try again shortly.', { hidden: false, tone: 'danger' });
    }
  };

  grid.addEventListener('click', (event) => {
    const favoriteButton = event.target.closest('[data-favorite-button]');
    if (!favoriteButton) return;

    const artworkId = favoriteButton.getAttribute('data-artwork-id');
    if (!artworkId) return;

    const updatedState = window.App.toggleFavorite(String(artworkId));
    updateFavoriteButton(favoriteButton, artworkId);

    favoriteButton.blur();
    setFeedback(updatedState ? 'Added to favorites.' : 'Removed from favorites.', { hidden: false, tone: 'success' });
    window.setTimeout(() => setFeedback('', { hidden: true }), 2500);
  });

  loadArtworks();
})();

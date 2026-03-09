document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------
  // 1. STANDARD LAZY LOAD (IntersectionObserver)
  // ------------------------------

  const lazyLoadImage = (img) => {
    if (!img || img.dataset.loaded === 'true') return;

    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }

    img.dataset.loaded = 'true';
  };

  const observerOptions = {
    root: null,
    threshold: 0.1
  };

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        lazyLoadImage(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const observeImages = (images) => {
    images.forEach(img => {
      if (!img.dataset.loaded) {
        imageObserver.observe(img);
      }
    });
  };

  // Observe initial lazy images
  observeImages(document.querySelectorAll('img.lazyload-image'));


  // ------------------------------
  // 2. HOVER / INTERACTION-BASED LAZY LOAD
  // ------------------------------

  const lazyLoadHoverImage = (img) => {
    if (!img || img.dataset.loaded === 'true') return;

    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }

    img.dataset.loaded = 'true';
  };

  const lazyLoadAllHoverImages = () => {
    document.querySelectorAll('img.lazyload-hover-image').forEach(img => {
      if (!img.dataset.loaded) {
        lazyLoadHoverImage(img);
      }
    });
  };

  const triggerLazyLoadOnInteraction = () => {
    lazyLoadAllHoverImages();
    removeHoverListeners();
  };

  const removeHoverListeners = () => {
    window.removeEventListener('mouseover', triggerLazyLoadOnInteraction);
    window.removeEventListener('scroll', triggerLazyLoadOnInteraction);
    window.removeEventListener('touchstart', triggerLazyLoadOnInteraction);
  };

  window.addEventListener('mouseover', triggerLazyLoadOnInteraction, { once: true });
  window.addEventListener('scroll', triggerLazyLoadOnInteraction, { once: true });
  window.addEventListener('touchstart', triggerLazyLoadOnInteraction, { once: true });


  // ------------------------------
  // 3. MUTATION OBSERVER FOR DYNAMIC ELEMENTS
  // ------------------------------

  const mutationObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) { // Element node

          // Case 1: A single lazyload-image
          if (node.matches?.('img.lazyload-image')) {
            observeImages([node]);
          }

          // Case 2: A single lazyload-hover-image
          if (node.matches?.('img.lazyload-hover-image')) {
            lazyLoadHoverImage(node);
          }

          // Case 3: Descendants
          const lazyImages = node.querySelectorAll?.('img.lazyload-image');
          if (lazyImages?.length) {
            observeImages(lazyImages);
          }

          const hoverImages = node.querySelectorAll?.('img.lazyload-hover-image');
          if (hoverImages?.length) {
            hoverImages.forEach(img => lazyLoadHoverImage(img));
          }

        }
      });
    });
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

});

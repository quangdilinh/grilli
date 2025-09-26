'use strict';



/**
 * PRELOAD
 * 
 * loading will be end after document is loaded
 */

const preloader = document.querySelector("[data-preaload]");

if (preloader) {
  window.addEventListener("load", function () {
    preloader.classList.add("loaded");
    document.body.classList.add("loaded");
  });
}



/**
 * add event listener on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}



/**
 * NAVBAR
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

if (navbar && overlay && navTogglers.length) {
  const toggleNavbar = function () {
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("nav-active");
  }

  addEventOnElements(navTogglers, "click", toggleNavbar);
}



/**
 * HEADER & BACK TOP BTN
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

let lastScrollPos = 0;

const hideHeader = function () {
  const isScrollBottom = lastScrollPos < window.scrollY;
  if (isScrollBottom) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }

  lastScrollPos = window.scrollY;
}

window.addEventListener("scroll", function () {
  if (window.scrollY >= 50) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
    hideHeader();
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});



/**
 * HERO SLIDER
 */

const heroSlider = document.querySelector("[data-hero-slider]");
const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
const heroSliderNextBtn = document.querySelector("[data-next-btn]");

if (heroSlider && heroSliderItems.length && heroSliderPrevBtn && heroSliderNextBtn) {
  let currentSlidePos = 0;
  let lastActiveSliderItem = heroSliderItems[0];

  const updateSliderPos = function () {
    lastActiveSliderItem.classList.remove("active");
    heroSliderItems[currentSlidePos].classList.add("active");
    lastActiveSliderItem = heroSliderItems[currentSlidePos];
  }

  const slideNext = function () {
    if (currentSlidePos >= heroSliderItems.length - 1) {
      currentSlidePos = 0;
    } else {
      currentSlidePos++;
    }

    updateSliderPos();
  }

  const slidePrev = function () {
    if (currentSlidePos <= 0) {
      currentSlidePos = heroSliderItems.length - 1;
    } else {
      currentSlidePos--;
    }

    updateSliderPos();
  }

  heroSliderNextBtn.addEventListener("click", slideNext);
  heroSliderPrevBtn.addEventListener("click", slidePrev);

  /**
   * auto slide
   */

  let autoSlideInterval;

  const autoSlide = function () {
    autoSlideInterval = setInterval(slideNext, 7000);
  }

  addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseover", function () {
    clearInterval(autoSlideInterval);
  });

  addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseout", autoSlide);

  window.addEventListener("load", autoSlide);
}



/**
 * PARALLAX EFFECT
 */

const parallaxItems = document.querySelectorAll("[data-parallax-item]");

let x, y;

if (parallaxItems.length) {
  window.addEventListener("mousemove", function (event) {

    x = (event.clientX / window.innerWidth * 10) - 5;
    y = (event.clientY / window.innerHeight * 10) - 5;

    // reverse the number eg. 20 -> -20, -5 -> 5
    x = x - (x * 2);
    y = y - (y * 2);

    for (let i = 0, len = parallaxItems.length; i < len; i++) {
      const speed = Number(parallaxItems[i].dataset.parallaxSpeed || 1);
      const offsetX = x * speed;
      const offsetY = y * speed;
      parallaxItems[i].style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0px)`;
    }

  });
}


/**
 * MENU FILTER
 */

const menuFilterContainer = document.querySelector("[data-menu-filter]");

if (menuFilterContainer) {
  const filterButtons = menuFilterContainer.querySelectorAll("[data-filter-btn]");
  const menuItems = document.querySelectorAll("[data-menu-item]");
  const emptyState = menuFilterContainer.querySelector("[data-menu-empty]");

  const filterMenu = function (category) {
    const normalizedCategory = category ? category.toLowerCase() : "all";
    let visibleCount = 0;

    menuItems.forEach(function (item) {
      const itemCategory = (item.dataset.category || "").toLowerCase();
      const shouldShow = normalizedCategory === "all" || itemCategory === normalizedCategory;
      item.toggleAttribute("hidden", !shouldShow);

      if (shouldShow) {
        visibleCount++;
      }
    });

    if (emptyState) {
      emptyState.toggleAttribute("hidden", visibleCount !== 0);
    }
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      filterButtons.forEach(function (btn) {
        btn.classList.remove("active");
        btn.setAttribute("aria-selected", "false");
      });

      button.classList.add("active");
      button.setAttribute("aria-selected", "true");

      filterMenu(button.dataset.filter || "all");
    });
  });

  const defaultCategory = menuFilterContainer.querySelector("[data-filter-btn].active")?.dataset.filter || "all";
  filterMenu(defaultCategory);
}


/**
 * CHEF MODAL
 */

const chefCards = document.querySelectorAll("[data-chef-card]");
const chefModal = document.querySelector("[data-chef-modal]");

if (chefCards.length && chefModal) {
  const modalOverlay = chefModal.querySelector("[data-modal-overlay]");
  const modalClose = chefModal.querySelector("[data-modal-close]");
  const modalImg = chefModal.querySelector("[data-modal-img]");
  const modalName = chefModal.querySelector("[data-modal-name]");
  const modalRole = chefModal.querySelector("[data-modal-role]");
  const modalBio = chefModal.querySelector("[data-modal-bio]");
  const modalSpecialty = chefModal.querySelector("[data-modal-specialty]");

  const closeModal = function () {
    chefModal.classList.remove("active");
    document.body.classList.remove("modal-active");
    window.removeEventListener("keydown", handleKeydown);
  }

  const handleKeydown = function (event) {
    if (event.key === "Escape") {
      closeModal();
    }
  }

  const openModal = function (card) {
    const { image, name, role, bio, specialty } = card.dataset;

    if (modalImg && image) {
      modalImg.src = image;
      modalImg.alt = name ? `Portrait of ${name}` : "Chef portrait";
    }

    if (modalName && name) {
      modalName.textContent = name;
    }

    if (modalRole) {
      modalRole.textContent = role || "";
    }

    if (modalBio) {
      modalBio.textContent = bio || "";
    }

    if (modalSpecialty) {
      if (specialty) {
        modalSpecialty.textContent = `Specialty: ${specialty}`;
        modalSpecialty.removeAttribute("hidden");
      } else {
        modalSpecialty.textContent = "";
        modalSpecialty.setAttribute("hidden", "");
      }
    }

    chefModal.classList.add("active");
    document.body.classList.add("modal-active");
    window.addEventListener("keydown", handleKeydown);
  }

  chefCards.forEach(function (card) {
    card.addEventListener("click", function () {
      openModal(card);
    });
  });

  if (modalOverlay) {
    modalOverlay.addEventListener("click", closeModal);
  }

  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }
}
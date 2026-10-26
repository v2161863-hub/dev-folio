/* Dev-Folio interactive behavior built with vanilla JavaScript. */

const loader = document.getElementById("loader");
const navbar = document.getElementById("mainNavbar");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const scrollTopBtn = document.getElementById("scrollTopBtn");
const typingText = document.getElementById("typingText");
const cursorGlow = document.getElementById("cursorGlow");
const contactForm = document.getElementById("contactForm");
const successAlert = document.getElementById("formSuccess");
   console.log('Form submitted successfully!');
const photoInput = document.getElementById("profilePhotoInput");
const profilePreview = document.getElementById("profilePreview");
const photoFrame = document.getElementById("photoFrame");
const removePhotoBtn = document.getElementById("removePhotoBtn");
const uploadHint = document.getElementById("uploadHint");
const startProjectBtn = document.getElementById("startProjectBtn");

const typedPhrases = [
  "semantic HTML5.",
  "responsive Bootstrap layouts.",
  "smooth vanilla JavaScript.",
  "accessible premium UI."
];

let phraseIndex = 0;
let letterIndex = 0;
let isDeleting = false;

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
  setTimeout(() => loader.classList.add("hidden"), 550);

  if (window.AOS) {
    AOS.init({
      duration: 850,
      easing: "ease-out-cubic",
      once: true,
      offset: 90
    });
  }

  if (window.particlesJS) {
    particlesJS("particles-js", {
      particles: {
        number: { value: 58, density: { enable: true, value_area: 900 } },
        color: { value: ["#42e8f5", "#ff5fa2", "#c6ff4a"] },
        shape: { type: "circle" },
        opacity: { value: 0.32, random: true },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 145,
          color: "#42e8f5",
          opacity: 0.14,
          width: 1
        },
        move: {
          enable: true,
          speed: 1.5,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" },
          resize: true
        },
        modes: {
          grab: { distance: 150, line_linked: { opacity: 0.28 } },
          push: { particles_nb: 3 }
        }
      },
      retina_detect: true
    });
  }
});

document.getElementById("currentYear").textContent = new Date().getFullYear();

function typeLoop() {
  const currentPhrase = typedPhrases[phraseIndex];

  if (isDeleting) {
    letterIndex -= 1;
  } else {
    letterIndex += 1;
  }

  typingText.textContent = currentPhrase.slice(0, letterIndex);

  if (!isDeleting && letterIndex === currentPhrase.length) {
    isDeleting = true;
    setTimeout(typeLoop, 1200);
    return;
  }

  if (isDeleting && letterIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % typedPhrases.length;
  }

  setTimeout(typeLoop, isDeleting ? 42 : 78);
}

typeLoop();

function updateNavbar() {
  const scrolled = window.scrollY > 28;
  navbar.classList.toggle("scrolled", scrolled);
  scrollTopBtn.classList.toggle("show", window.scrollY > 520);
}

function updateActiveLink() {
  let currentSection = "home";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 130;

    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentSection}`);
  });
}

window.addEventListener("scroll", () => {
  updateNavbar();
  updateActiveLink();
});

updateNavbar();
updateActiveLink();

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const openMenu = document.querySelector(".navbar-collapse.show");

    if (openMenu && window.bootstrap) {
      bootstrap.Collapse.getOrCreateInstance(openMenu).hide();
    }
  });
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

if (startProjectBtn) {
  startProjectBtn.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
  });
}

document.addEventListener("pointermove", (event) => {
  if (!cursorGlow) return;

  cursorGlow.style.transform = `translate(${event.clientX - 208}px, ${event.clientY - 208}px)`;
});

document.querySelectorAll("[data-tilt]").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 10;
    const rotateX = ((y / rect.height) - 0.5) * -10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

if (photoInput && profilePreview && photoFrame) {
  photoInput.addEventListener("change", () => {
    const selectedPhoto = photoInput.files[0];

    if (!selectedPhoto) return;

    if (!selectedPhoto.type.startsWith("image/")) {
      uploadHint.textContent = "Please upload a valid image file.";
      uploadHint.classList.add("error");
      photoInput.value = "";
      return;
    }

    const reader = new FileReader();

    reader.addEventListener("load", () => {
      profilePreview.src = reader.result;
      photoFrame.classList.add("has-image");
      removePhotoBtn.classList.remove("d-none");
      uploadHint.textContent = selectedPhoto.name;
      uploadHint.classList.remove("error");
    });

    reader.readAsDataURL(selectedPhoto);
  });

  removePhotoBtn.addEventListener("click", () => {
    profilePreview.removeAttribute("src");
    photoFrame.classList.remove("has-image");
    removePhotoBtn.classList.add("d-none");
    photoInput.value = "";
    uploadHint.textContent = "Choose a JPG, PNG, or WebP image.";
    uploadHint.classList.remove("error");
  });
}

const validators = {
  name(value) {
    return value.trim() ? "" : "Name must not be empty.";
  },
  email(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(value.trim()) ? "" : "Enter a valid email address.";
  },
  message(value) {
    return value.trim().length >= 10 ? "" : "Message must contain at least 10 characters.";
  }
};

function setFieldState(field, message) {
  const errorElement = document.getElementById(`${field.id}Error`);

  errorElement.textContent = message;
  field.classList.toggle("is-invalid", Boolean(message));
  field.classList.toggle("is-valid", !message && field.value.trim().length > 0);
}

function validateField(field) {
  const validator = validators[field.id];
  if (!validator) return true;

  const message = validator(field.value);
  setFieldState(field, message);
  return message === "";
}

["name", "email", "message"].forEach((fieldId) => {
  const field = document.getElementById(fieldId);

  field.addEventListener("input", () => {
    validateField(field);
    successAlert.classList.add("d-none");
  });

  field.addEventListener("blur", () => validateField(field));
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const fields = Array.from(contactForm.querySelectorAll("#name, #email, #message"));
  const validationResults = fields.map((field) => validateField(field));
  const formIsValid = validationResults.every(Boolean);

  if (!formIsValid) {
    successAlert.classList.add("d-none");
    return;
  }

  successAlert.classList.remove("d-none");
  contactForm.reset();

  fields.forEach((field) => {
    field.classList.remove("is-valid", "is-invalid");
  });
});

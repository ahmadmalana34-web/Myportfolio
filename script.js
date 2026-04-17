document.addEventListener("DOMContentLoaded", () => {
  // 1. Text Typing Animation
  const textElement = document.querySelector(".animated-text");
  const words = [
    "Frontend Developer",
    "JavaScript ❤",
    "UI/UX Designer",
    "Web Developer",
    "Animation Specialist",
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      textElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      textElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2000; // Pause at the end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 520; // Pause before new word starts
    }

    setTimeout(type, typeSpeed);
  }

  // Start typing effect after a short delay
  setTimeout(type, 1500);

  // 2. GSAP Animations
  // Animate the image from left side
  gsap.fromTo(
    ".left-section",
    { x: -150, opacity: 0 },
    { x: 0, opacity: 1, duration: 1.5, ease: "power3.out" },
  );

  // Animate the text content from right side
  gsap.fromTo(
    ".right-section",
    { x: 150, opacity: 0 },
    { x: 0, opacity: 1, duration: 1.5, ease: "power3.out", delay: 0.3 },
  );

  // Animate the navigation bar from top
  gsap.from(".navbar", {
    y: -100,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
  });

  // Mobile Menu Toggle
  const mobileMenu = document.getElementById("mobile-menu");
  const navLinks = document.querySelector(".nav-links");
  if (mobileMenu && navLinks) {
    mobileMenu.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      const icon = mobileMenu.querySelector("i");
      if (navLinks.classList.contains("active")) {
        icon.classList.replace("fa-bars", "fa-xmark");
      } else {
        icon.classList.replace("fa-xmark", "fa-bars");
      }
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        const icon = mobileMenu.querySelector("i");
        icon.classList.replace("fa-xmark", "fa-bars");
      });
    });
  }

  // --- Gallery Section Animations ---

  // Initialize Particles JS
  if (typeof particlesJS !== "undefined") {
    particlesJS("particles-js", {
      particles: {
        number: { value: 60, density: { enable: true, value_area: 800 } },
        color: { value: ["#38bdf8", "#818cf8", "#c084fc"] },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#38bdf8",
          opacity: 0.2,
          width: 1,
        },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          random: true,
          out_mode: "out",
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" },
          resize: true,
        },
        modes: {
          grab: { distance: 140, line_linked: { opacity: 0.8 } },
          push: { particles_nb: 4 },
        },
      },
      retina_detect: true,
    });
  }

  // Register ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Gallery Card Staggered Entrance + Floating effect
  const galleryCards = document.querySelectorAll(".gallery-card");
  if (galleryCards.length > 0) {
    gsap.fromTo(
      galleryCards,
      { y: 150, opacity: 0 },
      {
        scrollTrigger: {
          trigger: ".gallery-section",
          start: "top 75%",
        },
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        onComplete: () => {
          // Fire continuous bobbing loop AFTER entrance so GSAP timelines don't clash
          galleryCards.forEach((card, index) => {
            gsap.to(card, {
              y: "-=10",
              duration: 2 + (index % 2),
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              delay: index * 0.1,
              overwrite: "auto",
            });
          });
        },
      },
    );
  }

  // Parallax abstract shape
  gsap.to(".abstract-shape", {
    scrollTrigger: {
      trigger: ".gallery-section",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
    y: 200,
    ease: "none",
  });

  // --- Skills Section 3D GSAP Slider ---
  const skillItems = document.querySelectorAll(".skill-item");
  const progressBar = document.querySelector(".progress-bar");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const carouselTrack = document.querySelector(".carousel-track");

  let currentSkillIndex = 0;
  const totalSkills = skillItems.length;

  function updateCarousel(instant = false) {
    if (totalSkills === 0) return;

    // Update Progress Bar directly via GSAP
    const progress = (currentSkillIndex / (totalSkills - 1)) * 100;
    gsap.to(progressBar, {
      width: `${progress}%`,
      duration: 0.5,
      ease: "power2.out",
    });

    skillItems.forEach((item, index) => {
      // Relative distance index from the current focused element
      let relativeIndex = index - currentSkillIndex;

      // Layout logic for 3D depth, spread, and sizing
      let xOffset = relativeIndex * 200; // Left-right spread
      let zOffset = -Math.abs(relativeIndex) * 120; // Push inactive cards deeper into screen
      let zIndexBase = totalSkills - Math.abs(relativeIndex); // Center always tops out
      let scaleOffset = Math.max(0.65, 1 - Math.abs(relativeIndex) * 0.15); // Edge cards shrink
      let opacityOffset = Math.max(0, 1 - Math.abs(relativeIndex) * 0.45); // Fade heavily the further they are
      let rotationY = relativeIndex * -20; // Soft 3D turn toward center

      // Special override: clamp visually off-screen edges to invisible
      if (Math.abs(relativeIndex) > 2) {
        opacityOffset = 0;
      }

      // Set active status to trigger CSS shadow/border highlighting
      if (relativeIndex === 0) {
        item.classList.add("active");
        // Center float bobbing effect
        gsap.to(item, {
          y: "-=8",
          duration: 1.5,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          overwrite: "auto",
          delay: 0.3,
        });
      } else {
        item.classList.remove("active");
        gsap.killTweensOf(item, "y");
        gsap.to(item, { y: 0, duration: 0.3 });
      }

      gsap.to(item, {
        x: xOffset,
        z: zOffset,
        rotateY: rotationY,
        scale: scaleOffset,
        opacity: opacityOffset,
        zIndex: zIndexBase,
        duration: instant ? 0 : 0.6,
        ease: "power3.out",
        overwrite: "auto",
      });
    });
  }

  // Initial Paint
  if (skillItems.length > 0) {
    gsap.set(skillItems, {
      transformPerspective: 1200,
      transformStyle: "preserve-3d",
    });
    updateCarousel(true);
  }

  // Navigation Handlers
  function goNext() {
    if (currentSkillIndex < totalSkills - 1) {
      currentSkillIndex++;
      updateCarousel();
    }
  }

  function goPrev() {
    if (currentSkillIndex > 0) {
      currentSkillIndex--;
      updateCarousel();
    }
  }

  if (nextBtn) nextBtn.addEventListener("click", goNext);
  if (prevBtn) prevBtn.addEventListener("click", goPrev);

  // Drag and Swipe Integrations
  let startX = 0;
  let isDragging = false;

  if (carouselTrack) {
    // Touch Devices
    carouselTrack.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
      },
      { passive: true },
    );

    carouselTrack.addEventListener("touchend", (e) => {
      if (!isDragging) return;
      isDragging = false;
      let endX = e.changedTouches[0].clientX;
      let diff = startX - endX;

      if (diff > 40) goNext();
      else if (diff < -40) goPrev();
    });

    // Mouse Tracking
    carouselTrack.addEventListener("mousedown", (e) => {
      startX = e.clientX;
      isDragging = true;
    });

    carouselTrack.addEventListener("mouseup", (e) => {
      if (!isDragging) return;
      isDragging = false;
      let endX = e.clientX;
      let diff = startX - endX;

      if (diff > 50) goNext();
      else if (diff < -50) goPrev();
    });

    carouselTrack.addEventListener("mouseleave", () => {
      isDragging = false;
    });
  }

  // ScrollTrigger - Fade in from beneath
  gsap.from(".carousel-container", {
    scrollTrigger: {
      trigger: ".skills-section",
      start: "top 75%",
    },
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
  });

  // Background smooth Parallax effect
  gsap.to(".skills-bg", {
    scrollTrigger: {
      trigger: ".skills-section",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
    y: 150,
    ease: "none",
  });

  // --- About Section Animation ---
  const aboutCards = document.querySelectorAll(".about-card");
  const aboutImg = document.querySelector(".about-img-container");

  if (aboutCards.length > 0 && aboutImg) {
    // Smooth image fade/slide from the left
    gsap.fromTo(
      aboutImg,
      { x: -100, opacity: 0 },
      {
        scrollTrigger: {
          trigger: ".about-section",
          start: "top 80%",
        },
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
      },
    );

    // Stagger slide-in from the right for the text cards
    gsap.fromTo(
      aboutCards,
      { x: 100, opacity: 0 },
      {
        scrollTrigger: {
          trigger: ".about-section",
          start: "top 80%",
        },
        x: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.2,
        onComplete: () => {
          aboutCards.forEach((card, index) => {
            gsap.to(card, {
              y: "-=8",
              duration: 2 + (index % 2),
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              delay: index * 0.15,
              overwrite: "auto",
            });
          });
        },
      },
    );
  }

  // --- Contact Section Animation ---
  const contactWrapper = document.querySelector(".contact-wrapper");
  const contactItems = document.querySelectorAll(".contact-item");
  const formGroups = document.querySelectorAll(".input-group");
  const submitBtn = document.querySelector(".submit-btn");

  if (contactWrapper) {
    gsap.fromTo(
      contactWrapper,
      { y: 50, opacity: 0 },
      {
        scrollTrigger: {
          trigger: ".contact-section",
          start: "top 80%",
        },
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
      },
    );

    gsap.fromTo(
      contactItems,
      { x: -40, opacity: 0 },
      {
        scrollTrigger: {
          trigger: ".contact-section",
          start: "top 80%",
        },
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.3,
      },
    );

    gsap.fromTo(
      [...formGroups, submitBtn],
      { x: 40, opacity: 0 },
      {
        scrollTrigger: {
          trigger: ".contact-section",
          start: "top 80%",
        },
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.6,
      },
    );
  }

  // --- Resume PDF Export ---
  const downloadBtn = document.getElementById("download-pdf-btn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      const element = document.getElementById("resume-document");

      const opt = {
        margin: [0.5, 0.5],
        filename: "Muhammad_Ahmad_Resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };

      if (window.html2pdf) {
        html2pdf().set(opt).from(element).save();
      } else {
      }
    });
  }

  // --- Theme Toggle Logic ---
  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeText = document.getElementById("theme-text");
  const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector("i") : null;

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      if (isDark) {
        themeText.textContent = "Light Mood";
        themeIcon.classList.replace("fa-moon", "fa-sun");
      } else {
        themeText.textContent = "Dark Mood";
        themeIcon.classList.replace("fa-sun", "fa-moon");
      }
    });
  }
});

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Parallax effect for hero section
export const initParallaxEffect = (
  element: HTMLElement,
  speed: number = 0.3,
) => {
  if (typeof window === "undefined") return;

  gsap.to(element, {
    y: () => window.innerHeight * speed,
    ease: "none",
    scrollTrigger: {
      trigger: element.parentElement,
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
};

// Fade-in animation for product cards
export const initProductCardAnimations = (cards: HTMLElement[]) => {
  if (typeof window === "undefined") return;

  cards.forEach((card, index) => {
    gsap.from(card, {
      opacity: 0,
      y: 50,
      duration: 0.6,
      delay: index * 0.1,
      scrollTrigger: {
        trigger: card,
        start: "top bottom-=100",
        toggleActions: "play none none none",
      },
    });
  });
};

// Staggered reveal animation for text elements
export const initTextRevealAnimation = (container: HTMLElement) => {
  if (typeof window === "undefined") return;

  const textElements = container.querySelectorAll(".animate-text");

  gsap.from(textElements, {
    opacity: 0,
    y: 20,
    stagger: 0.1,
    duration: 0.8,
    scrollTrigger: {
      trigger: container,
      start: "top bottom-=150",
      toggleActions: "play none none none",
    },
  });
};

// Image hover effect
export const initImageHoverEffect = (imageContainer: HTMLElement) => {
  if (typeof window === "undefined") return;

  const image = imageContainer.querySelector("img");
  if (!image) return;

  imageContainer.addEventListener("mouseenter", () => {
    gsap.to(image, {
      scale: 1.05,
      duration: 0.4,
      ease: "power2.out",
    });
  });

  imageContainer.addEventListener("mouseleave", () => {
    gsap.to(image, {
      scale: 1,
      duration: 0.4,
      ease: "power2.out",
    });
  });
};

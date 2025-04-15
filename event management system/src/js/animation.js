// Animations module for Event Booking System

export class Animation {
  constructor() {
    this.lastScrollTop = 0;
    this.revealElements = document.querySelectorAll('.animate-in, .reveal');
  }

  init() {
    // Initialize animations
    this.initScrollAnimations();
    this.initHoverAnimations();
    this.initButtonAnimations();
    this.initFormAnimations();
    this.initCustomEventListeners();
  }

  initScrollAnimations() {
    // Check for elements in view on page load
    this.checkElementsInView();

    // Add scroll event listener
    window.addEventListener('scroll', () => {
      this.handleScroll();
    });
  }

  handleScroll() {
    // Throttle scroll events for better performance
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.checkElementsInView();
        this.animateHeaderOnScroll();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  checkElementsInView() {
    this.revealElements.forEach(element => {
      if (this.isElementInViewport(element)) {
        element.classList.add('active');
      }
    });
  }

  isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
    );
  }

  animateHeaderOnScroll() {
    const header = document.querySelector('.header');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Add slide-up animation when scrolling down
    if (scrollTop > this.lastScrollTop && scrollTop > 100) {
      header.classList.add('header-hidden');
    } else {
      header.classList.remove('header-hidden');
    }

    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
  }

  initHoverAnimations() {
    // Add hover animations to cards
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.classList.add('hover');
      });

      card.addEventListener('mouseleave', () => {
        card.classList.remove('hover');
      });
    });

    // Add hover animations to navigation items
    const navItems = document.querySelectorAll('.main-nav a');
    navItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        item.classList.add('hover');
      });

      item.addEventListener('mouseleave', () => {
        item.classList.remove('hover');
      });
    });
  }

  initButtonAnimations() {
    // Add click animations to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        button.classList.add('clicked');
        setTimeout(() => {
          button.classList.remove('clicked');
        }, 300);
      });
    });
  }

  initFormAnimations() {
    // Add focus animations to form inputs
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
      });

      input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
      });
    });

    // Add animation when form is submitted
    const form = document.getElementById('bookingForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add any submission animations here
      });
    }
  }

  initCustomEventListeners() {
    // Listen for date selection in the calendar
    document.addEventListener('dateSelected', (e) => {
      // Apply animations to the selected date
      this.animateElement(document.getElementById('eventDate'), 'pulse');
    });

    // Listen for event booking from event cards
    document.addEventListener('selectEventDate', (e) => {
      // Handle any animations when an event is booked from the events section
      this.animateElement(document.querySelector('.calendar-container'), 'pulse');
    });
  }

  animateElement(element, animationClass) {
    if (!element) return;

    element.classList.add(animationClass);
    setTimeout(() => {
      element.classList.remove(animationClass);
    }, 800);
  }

  // Add helper methods for various animations
  fadeIn(element, duration = 300) {
    element.style.opacity = 0;
    element.style.display = 'block';

    let start = null;
    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      element.style.opacity = Math.min(progress / duration, 1);
      if (progress < duration) {
        window.requestAnimationFrame(step);
      }
    }
    window.requestAnimationFrame(step);
  }

  fadeOut(element, duration = 300) {
    element.style.opacity = 1;

    let start = null;
    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      element.style.opacity = 1 - Math.min(progress / duration, 1);
      if (progress < duration) {
        window.requestAnimationFrame(step);
      } else {
        element.style.display = 'none';
      }
    }
    window.requestAnimationFrame(step);
  }

  slideDown(element, duration = 300) {
    // Store the original height
    const height = element.scrollHeight;
    element.style.height = '0px';
    element.style.overflow = 'hidden';
    element.style.display = 'block';

    let start = null;
    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      element.style.height = Math.min(progress / duration * height, height) + 'px';
      if (progress < duration) {
        window.requestAnimationFrame(step);
      } else {
        element.style.height = '';
        element.style.overflow = '';
      }
    }
    window.requestAnimationFrame(step);
  }

  slideUp(element, duration = 300) {
    // Store the original height
    const height = element.scrollHeight;
    element.style.height = height + 'px';
    element.style.overflow = 'hidden';

    let start = null;
    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      element.style.height = (height - Math.min(progress / duration * height, height)) + 'px';
      if (progress < duration) {
        window.requestAnimationFrame(step);
      } else {
        element.style.display = 'none';
        element.style.height = '';
        element.style.overflow = '';
      }
    }
    window.requestAnimationFrame(step);
  }
}

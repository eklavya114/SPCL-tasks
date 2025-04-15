// Main JavaScript File for Event Booking System

// Import other modules
import { Calendar } from './calender.js';
import { FormValidation } from './form.js';
import { Events } from './event.js';
import { Animation } from './animation.js';

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Header Scroll Effect
  initHeaderScroll();

  // Initialize Mobile Menu
  initMobileMenu();

  // Initialize Calendar
  const calendar = new Calendar();
  calendar.init();

  // Initialize Form Validation
  const formValidation = new FormValidation();
  formValidation.init();

  // Load and Display Events
  const events = new Events();
  events.loadEvents();
  events.displayEvents();

  // Initialize Animations
  const animation = new Animation();
  animation.init();

  // Initialize Reveal on Scroll
  initRevealOnScroll();
});

// Header scroll effect
function initHeaderScroll() {
  const header = document.querySelector('.header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// Mobile menu toggle
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('show');

    // Change icon
    const icon = menuToggle.querySelector('i');
    if (mainNav.classList.contains('show')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !mainNav.contains(e.target) && mainNav.classList.contains('show')) {
      mainNav.classList.remove('show');
      const icon = menuToggle.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });

  // Close menu when clicking on a menu item
  const navLinks = document.querySelectorAll('.main-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('show');
      const icon = menuToggle.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    });
  });
}

// Reveal elements on scroll
function initRevealOnScroll() {
  const revealElements = document.querySelectorAll('.section-title, .events-grid, .booking-container');

  revealElements.forEach(element => {
    element.classList.add('reveal');
  });

  function revealOnScroll() {
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (elementTop < windowHeight - 100) {
        element.classList.add('active');
      }
    });
  }

  // Check on initial load
  revealOnScroll();

  // Check on scroll
  window.addEventListener('scroll', revealOnScroll);
}

// Initialize smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();

    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// Form module for Event Booking System

export class FormValidation {
  constructor() {
    // DOM elements
    this.form = document.getElementById('bookingForm');
    this.eventDateInput = document.getElementById('eventDate');
    this.nameInput = document.getElementById('name');
    this.emailInput = document.getElementById('email');
    this.phoneInput = document.getElementById('phone');
    this.eventTypeInput = document.getElementById('eventType');
    this.attendeesInput = document.getElementById('attendees');
    this.notesInput = document.getElementById('notes');

    // Error message elements
    this.nameError = document.getElementById('nameError');
    this.emailError = document.getElementById('emailError');
    this.phoneError = document.getElementById('phoneError');
    this.eventTypeError = document.getElementById('eventTypeError');
    this.attendeesError = document.getElementById('attendeesError');

    // Modal elements
    this.modal = document.getElementById('bookingConfirmation');
    this.closeModalBtn = document.getElementById('closeModal');
    this.closeBtnX = document.querySelector('.close-btn');
    this.bookingSummary = document.getElementById('bookingSummary');
  }

  init() {
    // Set up form validation
    this.setupFormValidation();

    // Set up form submission
    this.setupFormSubmission();

    // Set up modal handling
    this.setupModal();
  }

  setupFormValidation() {
    // Real-time validation
    this.nameInput.addEventListener('input', () => this.validateName());
    this.emailInput.addEventListener('input', () => this.validateEmail());
    this.phoneInput.addEventListener('input', () => this.validatePhone());
    this.eventTypeInput.addEventListener('change', () => this.validateEventType());
    this.attendeesInput.addEventListener('input', () => this.validateAttendees());

    // Format phone number as user types
    this.phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 0) {
        if (value.length <= 3) {
          value = value;
        } else if (value.length <= 6) {
          value = `${value.slice(0, 3)}-${value.slice(3)}`;
        } else {
          value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6, 10)}`;
        }
        e.target.value = value;
      }
    });
  }

  setupFormSubmission() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate all fields
      const isNameValid = this.validateName();
      const isEmailValid = this.validateEmail();
      const isPhoneValid = this.validatePhone();
      const isEventTypeValid = this.validateEventType();
      const isAttendeesValid = this.validateAttendees();
      const isDateSelected = this.validateDate();

      // If all validations pass
      if (isNameValid && isEmailValid && isPhoneValid && isEventTypeValid && isAttendeesValid && isDateSelected) {
        // Show confirmation modal with summary
        this.showConfirmation();
      } else {
        // Shake the form
        this.form.classList.add('shake');
        setTimeout(() => this.form.classList.remove('shake'), 500);
      }
    });
  }

  setupModal() {
    // Close modal when clicking the X button
    this.closeBtnX.addEventListener('click', () => {
      this.hideModal();
    });

    // Close modal when clicking the Close button
    this.closeModalBtn.addEventListener('click', () => {
      this.hideModal();
    });

    // Close modal when clicking outside the modal content
    window.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.hideModal();
      }
    });
  }

  validateName() {
    const name = this.nameInput.value.trim();

    if (name === '') {
      this.showError(this.nameError, 'Name is required');
      return false;
    } else if (name.length < 3) {
      this.showError(this.nameError, 'Name must be at least 3 characters');
      return false;
    } else {
      this.clearError(this.nameError);
      return true;
    }
  }

  validateEmail() {
    const email = this.emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === '') {
      this.showError(this.emailError, 'Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      this.showError(this.emailError, 'Please enter a valid email address');
      return false;
    } else {
      this.clearError(this.emailError);
      return true;
    }
  }

  validatePhone() {
    const phone = this.phoneInput.value.trim();
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;

    if (phone === '') {
      this.showError(this.phoneError, 'Phone number is required');
      return false;
    } else if (!phoneRegex.test(phone)) {
      this.showError(this.phoneError, 'Please enter a valid phone number (xxx-xxx-xxxx)');
      return false;
    } else {
      this.clearError(this.phoneError);
      return true;
    }
  }

  validateEventType() {
    const eventType = this.eventTypeInput.value;

    if (eventType === '') {
      this.showError(this.eventTypeError, 'Please select an event type');
      return false;
    } else {
      this.clearError(this.eventTypeError);
      return true;
    }
  }

  validateAttendees() {
    const attendees = this.attendeesInput.value.trim();

    if (attendees === '') {
      this.showError(this.attendeesError, 'Number of attendees is required');
      return false;
    } else if (isNaN(attendees) || parseInt(attendees) < 1) {
      this.showError(this.attendeesError, 'Please enter a valid number of attendees');
      return false;
    } else {
      this.clearError(this.attendeesError);
      return true;
    }
  }

  validateDate() {
    const date = this.eventDateInput.value.trim();

    if (date === '') {
      // Scroll to calendar and highlight it
      const calendarContainer = document.querySelector('.calendar-container');
      calendarContainer.scrollIntoView({ behavior: 'smooth' });
      calendarContainer.classList.add('shake');
      setTimeout(() => calendarContainer.classList.remove('shake'), 500);
      return false;
    }

    return true;
  }

  showError(element, message) {
    element.textContent = message;
    element.parentElement.classList.add('error');
  }

  clearError(element) {
    element.textContent = '';
    element.parentElement.classList.remove('error');
  }

  showConfirmation() {
    // Create booking summary
    this.bookingSummary.innerHTML = `
      <div><strong>Date:</strong> ${this.eventDateInput.value}</div>
      <div><strong>Name:</strong> ${this.nameInput.value}</div>
      <div><strong>Email:</strong> ${this.emailInput.value}</div>
      <div><strong>Phone:</strong> ${this.phoneInput.value}</div>
      <div><strong>Event Type:</strong> ${this.eventTypeInput.options[this.eventTypeInput.selectedIndex].text}</div>
      <div><strong>Attendees:</strong> ${this.attendeesInput.value}</div>
      ${this.notesInput.value ? `<div><strong>Notes:</strong> ${this.notesInput.value}</div>` : ''}
    `;

    // Show modal
    this.showModal();

    // Reset form
    setTimeout(() => {
      this.form.reset();
      document.querySelector('.calendar-day.selected')?.classList.remove('selected');
    }, 300);
  }

  showModal() {
    this.modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }

  hideModal() {
    this.modal.classList.remove('show');
    document.body.style.overflow = ''; // Re-enable scrolling
  }
}

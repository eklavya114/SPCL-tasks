// Events module for Event Booking System

export class Events {
  constructor() {
    this.eventsGrid = document.querySelector('.events-grid');

    // Sample event data (In a real application, this would come from an API)
    this.events = [
      {
        id: 1,
        title: 'Wedding Expo',
        date: new Date(2023, 7, 15),
        location: 'Grand Ballroom',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
        description: 'Discover the latest wedding trends and meet top vendors.',
        category: 'expo'
      },
      {
        id: 2,
        title: 'Tech Conference',
        date: new Date(2023, 7, 20),
        location: 'Innovation Center',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
        description: 'Join industry leaders for talks on emerging technologies.',
        category: 'conference'
      },
      {
        id: 3,
        title: 'Music Festival',
        date: new Date(2023, 7, 25),
        location: 'Riverside Park',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
        description: 'A weekend of live music, food, and fun activities.',
        category: 'festival'
      },
      {
        id: 4,
        title: 'Charity Gala',
        date: new Date(2023, 8, 5),
        location: 'Crystal Hall',
        image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf',
        description: 'An elegant evening supporting local community initiatives.',
        category: 'gala'
      },
      {
        id: 5,
        title: 'Food & Wine Festival',
        date: new Date(2023, 8, 12),
        location: 'City Plaza',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
        description: 'Taste exquisite wines and gourmet foods from local chefs.',
        category: 'festival'
      },
      {
        id: 6,
        title: 'Business Networking',
        date: new Date(2023, 8, 18),
        location: 'Business Center',
        image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786',
        description: 'Connect with professionals and expand your network.',
        category: 'networking'
      }
    ];
  }

  loadEvents() {
    // In a real application, this would fetch events from an API
    console.log('Events loaded:', this.events.length);

    // You could add filtering, sorting, or pagination here
  }

  displayEvents() {
    if (!this.eventsGrid) return;

    // Clear events grid
    this.eventsGrid.innerHTML = '';

    // Sort events by date (upcoming first)
    const sortedEvents = [...this.events].sort((a, b) => a.date - b.date);

    // Display only future and recent events
    const today = new Date();
    const relevantEvents = sortedEvents.filter(event => {
      const eventDate = new Date(event.date);
      const timeDiff = eventDate - today;
      const daysDiff = timeDiff / (1000 * 3600 * 24);

      // Show events that are upcoming or happened within the last 7 days
      return daysDiff > -7;
    });

    // Create event cards
    relevantEvents.forEach(event => {
      const eventCard = this.createEventCard(event);
      this.eventsGrid.appendChild(eventCard);
    });

    // Add animation to events with delay
    const eventCards = this.eventsGrid.querySelectorAll('.event-card');
    eventCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-in');
      }, index * 100);
    });

    // If no events, show a message
    if (relevantEvents.length === 0) {
      const noEvents = document.createElement('div');
      noEvents.className = 'no-events';
      noEvents.innerHTML = '<p>No upcoming events at the moment. Check back soon!</p>';
      this.eventsGrid.appendChild(noEvents);
    }
  }

  createEventCard(event) {
    const eventCard = document.createElement('div');
    eventCard.className = 'event-card';

    const formattedDate = this.formatDate(event.date);

    eventCard.innerHTML = `
      <div class="event-image" style="background-image: url('${event.image}')"></div>
      <div class="event-content">
        <h3>${event.title}</h3>
        <div class="event-info">
          <i class="fas fa-calendar-alt"></i>
          <span>${formattedDate}</span>
        </div>
        <div class="event-info">
          <i class="fas fa-map-marker-alt"></i>
          <span>${event.location}</span>
        </div>
        <p>${event.description}</p>
        <div class="event-action">
          <a href="#booking" class="btn btn-primary btn-sm" data-event-id="${event.id}">Book Now</a>
        </div>
      </div>
    `;

    // Add click event to the "Book Now" button
    const bookButton = eventCard.querySelector('.btn');
    bookButton.addEventListener('click', () => {
      this.handleEventBooking(event);
    });

    return eventCard;
  }

  handleEventBooking(event) {
    // Scroll to booking section
    const bookingSection = document.getElementById('booking');
    bookingSection.scrollIntoView({ behavior: 'smooth' });

    // Fill in event date in the form
    const eventDateInput = document.getElementById('eventDate');
    eventDateInput.value = this.formatDate(event.date);

    // Select event date in the calendar
    // This would ideally trigger a custom event that the calendar can listen to
    const selectDateEvent = new CustomEvent('selectEventDate', { detail: { date: event.date } });
    document.dispatchEvent(selectDateEvent);

    // Pre-fill event type in the form if it matches one of the options
    const eventTypeInput = document.getElementById('eventType');
    const eventCategory = event.category;

    for (let i = 0; i < eventTypeInput.options.length; i++) {
      const option = eventTypeInput.options[i];
      if (option.value && option.value.toLowerCase() === eventCategory.toLowerCase()) {
        eventTypeInput.selectedIndex = i;
        break;
      }
    }

    // Highlight the form with a pulse animation
    const formContainer = document.querySelector('.form-container');
    formContainer.classList.add('pulse');
    setTimeout(() => formContainer.classList.remove('pulse'), 800);
  }

  formatDate(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  }
}

// Calendar module for Event Booking System

export class Calendar {
  constructor() {
    // DOM elements
    this.calendarDays = document.getElementById('calendarDays');
    this.currentMonthElement = document.getElementById('currentMonth');
    this.prevMonthBtn = document.getElementById('prevMonth');
    this.nextMonthBtn = document.getElementById('nextMonth');
    this.eventDateInput = document.getElementById('eventDate');

    // Calendar state
    this.currentDate = new Date();
    this.selectedDate = null;

    // Sample event data (In a real application, this would come from an API)
    this.events = [
      { date: new Date(2023, 7, 5), status: 'booked', title: 'Corporate Meeting', details: 'Annual strategy meeting for ABC Corp' },
      { date: new Date(2023, 7, 12), status: 'booked', title: 'Wedding Ceremony', details: 'Smith-Johnson Wedding' },
      { date: new Date(2023, 7, 15), status: 'available', title: 'Available Slot', details: 'Morning and afternoon slots available' },
      { date: new Date(2023, 7, 18), status: 'available', title: 'Available Slot', details: 'Full day availability' },
      { date: new Date(2023, 7, 22), status: 'booked', title: 'Birthday Party', details: 'Private birthday celebration' },
      { date: new Date(2023, 7, 25), status: 'available', title: 'Available Slot', details: 'Evening slot available' },
      { date: new Date(2023, 7, 28), status: 'booked', title: 'Conference', details: 'Tech industry conference' },
    ];
  }

  init() {
    // Initial render
    this.renderCalendar();

    // Event listeners
    this.prevMonthBtn.addEventListener('click', () => this.changeMonth(-1));
    this.nextMonthBtn.addEventListener('click', () => this.changeMonth(1));

    // Event tooltip
    this.initEventTooltip();
  }

  renderCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // Update month and year display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    this.currentMonthElement.textContent = `${monthNames[month]} ${year}`;

    // Clear previous days
    this.calendarDays.innerHTML = '';

    // Get the first day of the month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Add days from previous month
    const firstDayIndex = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayElement = this.createDayElement(prevMonthLastDay - i, 'prev-month disabled');
      this.calendarDays.appendChild(dayElement);
    }

    // Add days of current month
    const currentMonthDays = lastDay.getDate();
    const today = new Date();

    for (let i = 1; i <= currentMonthDays; i++) {
      const date = new Date(year, month, i);
      const isToday = this.isSameDate(date, today);
      const isSelected = this.selectedDate && this.isSameDate(date, this.selectedDate);

      let classes = '';
      if (isToday) classes += 'today ';
      if (isSelected) classes += 'selected ';

      // Check if the date has an event
      const event = this.getEventForDate(date);
      if (event) {
        classes += `${event.status} `;
      }

      const dayElement = this.createDayElement(i, classes.trim());
      dayElement.dataset.date = `${year}-${month + 1}-${i}`;

      if (event) {
        dayElement.dataset.eventTitle = event.title;
        dayElement.dataset.eventDetails = event.details;
      }

      dayElement.addEventListener('click', () => this.selectDate(date, dayElement));

      this.calendarDays.appendChild(dayElement);
    }

    // Add days from next month
    const totalCells = 42; // 6 rows of 7 days
    const nextMonthDays = totalCells - (firstDayIndex + currentMonthDays);

    for (let i = 1; i <= nextMonthDays; i++) {
      const dayElement = this.createDayElement(i, 'next-month disabled');
      this.calendarDays.appendChild(dayElement);
    }
  }

  createDayElement(day, classes) {
    const dayElement = document.createElement('div');
    dayElement.className = `calendar-day ${classes}`;
    dayElement.textContent = day;
    return dayElement;
  }

  selectDate(date, element) {
    // Don't allow selection of disabled dates
    if (element.classList.contains('disabled')) {
      return;
    }

    // Don't allow selection of booked dates
    if (element.classList.contains('booked')) {
      this.shakeElement(element);
      return;
    }

    // Remove selected class from previously selected date
    const selectedElement = this.calendarDays.querySelector('.selected');
    if (selectedElement) {
      selectedElement.classList.remove('selected');
    }

    // Add selected class to new date
    element.classList.add('selected');

    // Update selected date
    this.selectedDate = date;

    // Update the input field
    this.updateDateInput();

    // Trigger a custom event
    const event = new CustomEvent('dateSelected', { detail: { date } });
    document.dispatchEvent(event);
  }

  updateDateInput() {
    if (this.selectedDate) {
      const formattedDate = this.formatDate(this.selectedDate);
      this.eventDateInput.value = formattedDate;
    } else {
      this.eventDateInput.value = '';
    }
  }

  changeMonth(delta) {
    // Apply animation class
    this.calendarDays.classList.add(delta > 0 ? 'slide-left' : 'slide-right');

    setTimeout(() => {
      // Update current date
      this.currentDate.setMonth(this.currentDate.getMonth() + delta);

      // Re-render calendar
      this.renderCalendar();

      // Remove animation class and add fade-in
      this.calendarDays.classList.remove('slide-left', 'slide-right');
      this.calendarDays.classList.add('fade-in');

      // Remove fade-in class after animation completes
      setTimeout(() => {
        this.calendarDays.classList.remove('fade-in');
      }, 300);
    }, 300);
  }

  getEventForDate(date) {
    return this.events.find(event => this.isSameDate(event.date, date));
  }

  isSameDate(date1, date2) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  }

  shakeElement(element) {
    element.classList.add('shake');
    setTimeout(() => element.classList.remove('shake'), 500);
  }

  initEventTooltip() {
    const tooltip = document.getElementById('eventDetails');
    let currentTooltipDay = null;

    // Add mouseover event to calendar days
    this.calendarDays.addEventListener('mouseover', (e) => {
      const day = e.target.closest('.calendar-day');
      if (!day || !day.dataset.eventTitle || day === currentTooltipDay) return;

      currentTooltipDay = day;

      // Position tooltip
      const rect = day.getBoundingClientRect();
      tooltip.style.top = `${rect.top + window.scrollY - 10}px`;
      tooltip.style.left = `${rect.left + window.scrollX + rect.width + 10}px`;

      // Set tooltip content
      tooltip.innerHTML = `
        <h4>${day.dataset.eventTitle}</h4>
        <p>${day.dataset.eventDetails}</p>
        <p><strong>Date:</strong> ${day.dataset.date}</p>
      `;

      // Show tooltip
      tooltip.classList.add('show');
    });

    // Hide tooltip on mouseout
    this.calendarDays.addEventListener('mouseout', (e) => {
      const day = e.target.closest('.calendar-day');
      if (!day || !day.dataset.eventTitle) return;

      currentTooltipDay = null;
      tooltip.classList.remove('show');
    });
  }
}

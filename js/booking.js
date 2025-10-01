// ===== APPOINTMENT BOOKING SYSTEM =====
class AppointmentBooking {
    constructor() {
        this.availableSlots = this.generateAvailableSlots();
        this.selectedDate = null;
        this.selectedTime = null;
        this.init();
    }
    
    init() {
        this.createBookingModal();
        this.bindEvents();
    }
    
    generateAvailableSlots() {
        // Verfügbare Zeiten: Mo-Fr 9:00-17:00, in 30-Min-Slots
        const slots = [];
        const workDays = [1, 2, 3, 4, 5]; // Monday to Friday
        const startHour = 9;
        const endHour = 17;
        
        // Generate slots for next 30 days
        const today = new Date();
        for (let i = 1; i <= 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            
            // Skip weekends
            if (workDays.includes(date.getDay())) {
                const dateStr = date.toISOString().split('T')[0];
                slots[dateStr] = [];
                
                for (let hour = startHour; hour < endHour; hour++) {
                    for (let minute = 0; minute < 60; minute += 30) {
                        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                        slots[dateStr].push({
                            time: timeStr,
                            available: Math.random() > 0.3 // Simulate some booked slots
                        });
                    }
                }
            }
        }
        
        return slots;
    }
    
    createBookingModal() {
        const modal = document.createElement('div');
        modal.id = 'booking-modal';
        modal.className = 'booking-modal';
        modal.innerHTML = `
            <div class="booking-modal-content">
                <div class="booking-header">
                    <h3 data-de="Erstberatung vereinbaren" data-en="Schedule Initial Consultation">Erstberatung vereinbaren</h3>
                    <button class="close-booking" aria-label="Schließen">&times;</button>
                </div>
                
                <div class="booking-steps">
                    <div class="step active" data-step="1">
                        <span class="step-number">1</span>
                        <span data-de="Datum wählen" data-en="Select Date">Datum wählen</span>
                    </div>
                    <div class="step" data-step="2">
                        <span class="step-number">2</span>
                        <span data-de="Uhrzeit wählen" data-en="Select Time">Uhrzeit wählen</span>
                    </div>
                    <div class="step" data-step="3">
                        <span class="step-number">3</span>
                        <span data-de="Kontaktdaten" data-en="Contact Details">Kontaktdaten</span>
                    </div>
                </div>
                
                <div class="booking-content">
                    <!-- Step 1: Date Selection -->
                    <div class="booking-step" id="step-1">
                        <h4 data-de="Verfügbare Termine" data-en="Available Dates">Verfügbare Termine</h4>
                        <div class="calendar-container">
                            <div class="calendar-header">
                                <button class="prev-month" aria-label="Vorheriger Monat">&lt;</button>
                                <h5 class="current-month"></h5>
                                <button class="next-month" aria-label="Nächster Monat">&gt;</button>
                            </div>
                            <div class="calendar-grid"></div>
                        </div>
                    </div>
                    
                    <!-- Step 2: Time Selection -->
                    <div class="booking-step" id="step-2" style="display: none;">
                        <h4 data-de="Verfügbare Uhrzeiten" data-en="Available Times">Verfügbare Uhrzeiten</h4>
                        <div class="selected-date-info"></div>
                        <div class="time-slots"></div>
                        <button class="btn btn-secondary back-to-date" data-de="Zurück zum Datum" data-en="Back to Date">Zurück zum Datum</button>
                    </div>
                    
                    <!-- Step 3: Contact Form -->
                    <div class="booking-step" id="step-3" style="display: none;">
                        <h4 data-de="Ihre Kontaktdaten" data-en="Your Contact Details">Ihre Kontaktdaten</h4>
                        <div class="appointment-summary"></div>
                        
                        <form class="booking-form" id="booking-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="booking-name" data-de="Name *" data-en="Name *">Name *</label>
                                    <input type="text" id="booking-name" name="name" required>
                                </div>
                                <div class="form-group">
                                    <label for="booking-email" data-de="E-Mail *" data-en="Email *">E-Mail *</label>
                                    <input type="email" id="booking-email" name="email" required>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="booking-phone" data-de="Telefon" data-en="Phone">Telefon</label>
                                    <input type="tel" id="booking-phone" name="phone">
                                </div>
                                <div class="form-group">
                                    <label for="booking-company" data-de="Unternehmen" data-en="Company">Unternehmen</label>
                                    <input type="text" id="booking-company" name="company">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="booking-topic" data-de="Gesprächsthema" data-en="Discussion Topic">Gesprächsthema</label>
                                <select id="booking-topic" name="topic">
                                    <option value="" data-de="Bitte wählen..." data-en="Please select...">Bitte wählen...</option>
                                    <option value="kickstart" data-de="Kickstart-Paket" data-en="Kickstart Package">Kickstart-Paket</option>
                                    <option value="audit" data-de="Audit & Bewertung" data-en="Audit & Assessment">Audit & Bewertung</option>
                                    <option value="turnaround" data-de="Turnaround-Support" data-en="Turnaround Support">Turnaround-Support</option>
                                    <option value="retainer" data-de="Retainer-Service" data-en="Retainer Service">Retainer-Service</option>
                                    <option value="interim" data-de="Interimsmanagement" data-en="Interim Management">Interimsmanagement</option>
                                    <option value="general" data-de="Allgemeine Beratung" data-en="General Consultation">Allgemeine Beratung</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="booking-message" data-de="Zusätzliche Informationen" data-en="Additional Information">Zusätzliche Informationen</label>
                                <textarea id="booking-message" name="message" rows="3" placeholder="Kurze Beschreibung Ihres Projekts oder Ihrer Herausforderung..."></textarea>
                            </div>
                            
                            <div class="form-group checkbox">
                                <input type="checkbox" id="booking-privacy" name="privacy" required>
                                <label for="booking-privacy" data-de="Ich stimme der Verarbeitung meiner Daten zu. *" data-en="I agree to the processing of my data. *">
                                    Ich stimme der Verarbeitung meiner Daten zu. *
                                </label>
                            </div>
                            
                            <div class="booking-actions">
                                <button type="button" class="btn btn-secondary back-to-time" data-de="Zurück" data-en="Back">Zurück</button>
                                <button type="submit" class="btn btn-primary" data-de="Termin buchen" data-en="Book Appointment">
                                    <i class="fas fa-calendar-plus"></i>
                                    Termin buchen
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    bindEvents() {
        // Open booking modal
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-booking-trigger]')) {
                e.preventDefault();
                this.openBookingModal();
            }
        });
        
        // Close modal
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-booking') || e.target.classList.contains('booking-modal')) {
                this.closeBookingModal();
            }
        });
        
        // Navigation between steps
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('back-to-date')) {
                this.showStep(1);
            } else if (e.target.classList.contains('back-to-time')) {
                this.showStep(2);
            }
        });
        
        // Form submission
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'booking-form') {
                e.preventDefault();
                this.handleBookingSubmission(e.target);
            }
        });
        
        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeBookingModal();
            }
        });
    }
    
    openBookingModal() {
        const modal = document.getElementById('booking-modal');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        this.initializeCalendar();
        this.showStep(1);
    }
    
    closeBookingModal() {
        const modal = document.getElementById('booking-modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.resetBooking();
    }
    
    showStep(stepNumber) {
        // Update step indicators
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active', 'completed');
            const stepNum = parseInt(step.getAttribute('data-step'));
            if (stepNum < stepNumber) {
                step.classList.add('completed');
            } else if (stepNum === stepNumber) {
                step.classList.add('active');
            }
        });
        
        // Show/hide step content
        document.querySelectorAll('.booking-step').forEach(step => {
            step.style.display = 'none';
        });
        document.getElementById(`step-${stepNumber}`).style.display = 'block';
    }
    
    initializeCalendar() {
        const today = new Date();
        this.currentCalendarDate = new Date(today.getFullYear(), today.getMonth(), 1);
        this.renderCalendar();
        this.bindCalendarEvents();
    }
    
    renderCalendar() {
        const monthNames = [
            'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
            'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
        ];
        
        const currentMonthEl = document.querySelector('.current-month');
        currentMonthEl.textContent = `${monthNames[this.currentCalendarDate.getMonth()]} ${this.currentCalendarDate.getFullYear()}`;
        
        const calendarGrid = document.querySelector('.calendar-grid');
        calendarGrid.innerHTML = '';
        
        // Add weekday headers
        const weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
        weekdays.forEach(day => {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-weekday';
            dayEl.textContent = day;
            calendarGrid.appendChild(dayEl);
        });
        
        // Get first day of month and number of days
        const firstDay = new Date(this.currentCalendarDate.getFullYear(), this.currentCalendarDate.getMonth(), 1);
        const lastDay = new Date(this.currentCalendarDate.getFullYear(), this.currentCalendarDate.getMonth() + 1, 0);
        const firstDayWeekday = (firstDay.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDayWeekday; i++) {
            const emptyEl = document.createElement('div');
            emptyEl.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyEl);
        }
        
        // Add days of the month
        const today = new Date();
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayDate = new Date(this.currentCalendarDate.getFullYear(), this.currentCalendarDate.getMonth(), day);
            const dateStr = dayDate.toISOString().split('T')[0];
            
            const dayEl = document.createElement('button');
            dayEl.className = 'calendar-day';
            dayEl.textContent = day;
            dayEl.setAttribute('data-date', dateStr);
            
            // Disable past dates
            if (dayDate < today) {
                dayEl.classList.add('disabled');
                dayEl.disabled = true;
            }
            
            // Check if date has available slots
            if (this.availableSlots[dateStr] && this.availableSlots[dateStr].some(slot => slot.available)) {
                dayEl.classList.add('available');
            } else if (dayDate >= today) {
                dayEl.classList.add('unavailable');
                dayEl.disabled = true;
            }
            
            calendarGrid.appendChild(dayEl);
        }
    }
    
    bindCalendarEvents() {
        document.querySelector('.prev-month').onclick = () => {
            this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() - 1);
            this.renderCalendar();
        };
        
        document.querySelector('.next-month').onclick = () => {
            this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() + 1);
            this.renderCalendar();
        };
        
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('calendar-day') && e.target.classList.contains('available')) {
                this.selectDate(e.target.getAttribute('data-date'));
            }
        });
    }
    
    selectDate(dateStr) {
        this.selectedDate = dateStr;
        this.showTimeSlots(dateStr);
        this.showStep(2);
    }
    
    showTimeSlots(dateStr) {
        const date = new Date(dateStr);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateDisplay = date.toLocaleDateString('de-DE', options);
        
        document.querySelector('.selected-date-info').innerHTML = `
            <div class="selected-date">
                <i class="fas fa-calendar"></i>
                <strong>${dateDisplay}</strong>
            </div>
        `;
        
        const timeSlotsContainer = document.querySelector('.time-slots');
        timeSlotsContainer.innerHTML = '';
        
        const slots = this.availableSlots[dateStr] || [];
        const availableSlots = slots.filter(slot => slot.available);
        
        if (availableSlots.length === 0) {
            timeSlotsContainer.innerHTML = '<p>Keine verfügbaren Termine an diesem Tag.</p>';
            return;
        }
        
        availableSlots.forEach(slot => {
            const timeButton = document.createElement('button');
            timeButton.className = 'time-slot';
            timeButton.textContent = slot.time;
            timeButton.onclick = () => this.selectTime(slot.time);
            timeSlotsContainer.appendChild(timeButton);
        });
    }
    
    selectTime(time) {
        this.selectedTime = time;
        
        // Update selected time visual feedback
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });
        event.target.classList.add('selected');
        
        // Show appointment summary
        this.showAppointmentSummary();
        this.showStep(3);
    }
    
    showAppointmentSummary() {
        const date = new Date(this.selectedDate);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateDisplay = date.toLocaleDateString('de-DE', options);
        
        document.querySelector('.appointment-summary').innerHTML = `
            <div class="appointment-details">
                <h5>Termindetails</h5>
                <div class="detail-item">
                    <i class="fas fa-calendar"></i>
                    <span>${dateDisplay}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span>${this.selectedTime} Uhr</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-video"></i>
                    <span>Online-Meeting (Microsoft Teams)</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-hourglass-half"></i>
                    <span>Dauer: ca. 30 Minuten</span>
                </div>
            </div>
        `;
    }
    
    handleBookingSubmission(form) {
        const formData = new FormData(form);
        const appointmentData = {
            date: this.selectedDate,
            time: this.selectedTime,
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            company: formData.get('company'),
            topic: formData.get('topic'),
            message: formData.get('message')
        };
        
        // Generate Outlook invitation
        this.generateOutlookInvitation(appointmentData);
        
        // Show success message
        this.showBookingSuccess(appointmentData);
    }
    
    generateOutlookInvitation(data) {
        const startDate = new Date(`${data.date}T${data.time}:00`);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later
        
        const formatDate = (date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };
        
        const subject = encodeURIComponent(`Erstberatung - ${data.name}`);
        const details = encodeURIComponent(`
Erstberatung mit ${data.name}

Unternehmen: ${data.company || 'Nicht angegeben'}
Telefon: ${data.phone || 'Nicht angegeben'}
Thema: ${data.topic || 'Allgemeine Beratung'}

Zusätzliche Informationen:
${data.message || 'Keine zusätzlichen Informationen'}

Meeting-Link wird separat versendet.
        `.trim());
        
        // Create Outlook web link
        const outlookWebUrl = `https://outlook.live.com/calendar/0/deeplink/compose?` +
            `subject=${subject}&` +
            `startdt=${formatDate(startDate)}&` +
            `enddt=${formatDate(endDate)}&` +
            `body=${details}&` +
            `location=Online%20Meeting`;
        
        // Create ICS file for download
        const icsContent = this.generateICSFile(data, startDate, endDate);
        this.downloadICSFile(icsContent, `Termin_${data.name}_${data.date}.ics`);
        
        // Open Outlook (optional)
        // window.open(outlookWebUrl, '_blank');
    }
    
    generateICSFile(data, startDate, endDate) {
        const formatICSDate = (date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };
        
        return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SupportedProject//Appointment Booking//EN
BEGIN:VEVENT
UID:${Date.now()}@supportedproject.de
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:Erstberatung - ${data.name}
DESCRIPTION:Erstberatung mit ${data.name}\\n\\nUnternehmen: ${data.company || 'Nicht angegeben'}\\nTelefon: ${data.phone || 'Nicht angegeben'}\\nThema: ${data.topic || 'Allgemeine Beratung'}\\n\\nZusätzliche Informationen:\\n${data.message || 'Keine zusätzlichen Informationen'}
LOCATION:Online Meeting
ORGANIZER:mailto:kontakt@supportedproject.de
ATTENDEE:mailto:${data.email}
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:Reminder: Erstberatung in 15 Minuten
END:VALARM
END:VEVENT
END:VCALENDAR`;
    }
    
    downloadICSFile(content, filename) {
        const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    showBookingSuccess(data) {
        const modal = document.getElementById('booking-modal');
        modal.querySelector('.booking-modal-content').innerHTML = `
            <div class="booking-success">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Termin erfolgreich gebucht!</h3>
                <p>Vielen Dank, ${data.name}! Ihr Beratungstermin wurde erfolgreich gebucht.</p>
                
                <div class="success-details">
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <span>${new Date(data.date).toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>${data.time} Uhr</span>
                    </div>
                </div>
                
                <div class="next-steps">
                    <h4>Nächste Schritte:</h4>
                    <ul>
                        <li><i class="fas fa-download"></i> Kalendereintrag wurde automatisch heruntergeladen</li>
                        <li><i class="fas fa-envelope"></i> Sie erhalten eine Bestätigungs-E-Mail mit Meeting-Link</li>
                        <li><i class="fas fa-phone"></i> Bei Fragen erreichen Sie mich unter kontakt@supportedproject.de</li>
                    </ul>
                </div>
                
                <div class="success-actions">
                    <button class="btn btn-primary" onclick="document.getElementById('booking-modal').style.display='none'; document.body.style.overflow='auto';">
                        <i class="fas fa-check"></i>
                        Alles klar!
                    </button>
                </div>
            </div>
        `;
        
        // Auto-close after 10 seconds
        setTimeout(() => {
            this.closeBookingModal();
        }, 10000);
    }
    
    resetBooking() {
        this.selectedDate = null;
        this.selectedTime = null;
        this.showStep(1);
    }
}

// Initialize booking system
document.addEventListener('DOMContentLoaded', () => {
    new AppointmentBooking();
});
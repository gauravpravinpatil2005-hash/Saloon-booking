// Owner's WhatsApp number

const OWNER_PASSWORD = "MG@123"; // change per salon

const OWNER_WHATSAPP = '918767628056';

// Available time slots
const TIME_SLOTS = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
];

// Initialize localStorage for bookings
let bookings = JSON.parse(localStorage.getItem('salonBookings')) || [];
let selectedServices = [];
let selectedTime = null;
let selectedDate = null;
let selectedPayment = null;

// Initialize date picker
const dateInput = document.getElementById('bookingDate');
const today = new Date().toISOString().split('T')[0];
dateInput.min = today;

// Service selection (multiple)
document.querySelectorAll('.service-item').forEach(item => {
    item.addEventListener('click', function() {
        const serviceId = this.dataset.service;
        const serviceName = this.querySelector('h3').textContent;
        const servicePrice = parseInt(this.dataset.price);
        const serviceDuration = parseInt(this.dataset.duration);

        if (this.classList.contains('selected')) {
            // Deselect
            this.classList.remove('selected');
            selectedServices = selectedServices.filter(s => s.id !== serviceId);
        } else {
            // Select
            this.classList.add('selected');
            selectedServices.push({
                id: serviceId,
                name: serviceName,
                price: servicePrice,
                duration: serviceDuration
            });
        }

        updateSelectedServicesList();
        updateSummary();
        checkFormComplete();
    });
});

function updateSelectedServicesList() {
    const section = document.getElementById('selectedServicesSection');
    const list = document.getElementById('selectedServicesList');

    if (selectedServices.length > 0) {
        section.style.display = 'block';
        list.innerHTML = selectedServices.map(service => `
            <span class="selected-service-badge">
                ${service.name} - ₹${service.price}
                <span class="remove-service" onclick="removeService('${service.id}')">✕</span>
            </span>
        `).join('');
    } else {
        section.style.display = 'none';
    }
}

function removeService(serviceId) {
    selectedServices = selectedServices.filter(s => s.id !== serviceId);
    document.querySelector(`[data-service="${serviceId}"]`).classList.remove('selected');
    updateSelectedServicesList();
    updateSummary();
    checkFormComplete();
}

// Date selection
dateInput.addEventListener('change', function() {
    selectedDate = this.value;
    generateTimeSlots();
    updateSummary();
    checkFormComplete();
});

// Generate time slots
function generateTimeSlots() {
    const container = document.getElementById('timeSlots');
    container.innerHTML = '';

    // Get booked slots for selected date
    const bookedSlots = bookings
        .filter(b => b.date === selectedDate)
        .map(b => b.time);

    TIME_SLOTS.forEach(time => {
        const slot = document.createElement('div');
        slot.className = 'time-slot';
        slot.textContent = time;

        if (bookedSlots.includes(time)) {
            slot.classList.add('unavailable');
        } else {
            slot.addEventListener('click', function() {
                document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
                this.classList.add('selected');
                selectedTime = time;
                updateSummary();
                checkFormComplete();
            });
        }

        container.appendChild(slot);
    });
}

// Payment method selection
document.querySelectorAll('.payment-option').forEach(option => {
    option.addEventListener('click', function() {
        document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
        this.classList.add('selected');
        selectedPayment = this.dataset.payment;
        checkFormComplete();
    });
});

// Update summary box
function updateSummary() {
    const summaryBox = document.getElementById('summaryBox');

    if (selectedServices.length > 0) {
        summaryBox.style.display = 'block';

        const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
        const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

        document.getElementById('summaryServiceCount').textContent = `${selectedServices.length} service${selectedServices.length > 1 ? 's' : ''}`;
        document.getElementById('summaryDuration').textContent = `${totalDuration} min`;
        document.getElementById('summaryPrice').textContent = `₹${totalPrice}`;

        if (selectedDate && selectedTime) {
            const formattedDate = new Date(selectedDate).toLocaleDateString('en-IN', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            document.getElementById('summaryDateTime').textContent = `${formattedDate}, ${selectedTime}`;
        }
    } else {
        summaryBox.style.display = 'none';
    }
}

// Check if form is complete
function checkFormComplete() {
    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    const bookBtn = document.getElementById('bookBtn');

    if (name && phone && selectedServices.length > 0 && selectedDate && selectedTime && selectedPayment) {
        bookBtn.disabled = false;
    } else {
        bookBtn.disabled = true;
    }
}

// Add input listeners
document.getElementById('customerName').addEventListener('input', checkFormComplete);
document.getElementById('customerPhone').addEventListener('input', checkFormComplete);

// Book appointment
document.getElementById('bookBtn').addEventListener('click', function() {
    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    const email = document.getElementById('customerEmail').value;

    const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
    const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

    // Generate booking ID
    const bookingId = 'BK' + Date.now().toString().slice(-8);

    // Create booking object
    const booking = {
        id: bookingId,
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        services: selectedServices,
        date: selectedDate,
        time: selectedTime,
        totalPrice: totalPrice,
        totalDuration: totalDuration,
        paymentMethod: selectedPayment,
        paymentStatus: selectedPayment === 'cash' ? 'Pending' : 'Paid',
        timestamp: new Date().toISOString()
    };

    // Save to localStorage
    bookings.push(booking);
    localStorage.setItem('salonBookings', JSON.stringify(bookings));

    // Format WhatsApp message
    const servicesList = selectedServices.map(s => `  • ${s.name} (${s.duration} min) - ₹${s.price}`).join('\n');
    
    const message = `🎉 *NEW BOOKING CONFIRMED*

━━━━━━━━━━━━━━━━━━━
📋 *BOOKING DETAILS*
━━━━━━━━━━━━━━━━━━━

🆔 *Booking ID:* ${bookingId}

👤 *Customer Information:*
Name: ${name}
Phone: ${phone}
${email ? `Email: ${email}` : ''}

💅 *Services Booked:*
${servicesList}

📅 *Appointment Schedule:*
Date: ${new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Time: ${selectedTime}
Duration: ${totalDuration} minutes

💰 *Payment Details:*
Total Amount: ₹${totalPrice}
Payment Method: ${selectedPayment.toUpperCase()}
Status: ${selectedPayment === 'cash' ? '⏳ Pending (Pay at Salon)' : '✅ Paid'}

━━━━━━━━━━━━━━━━━━━
Please prepare for this appointment.`;

    // Send to owner via WhatsApp
    const whatsappURL = `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');

    // Show success modal
    document.getElementById('bookingIdDisplay').textContent = bookingId;
    document.getElementById('successModal').classList.add('active');
});

function closeModal() {
    document.getElementById('successModal').classList.remove('active');

    // Reset form
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('customerEmail').value = '';
    dateInput.value = '';
    document.querySelectorAll('.service-item').forEach(s => s.classList.remove('selected'));
    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
    document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
    document.getElementById('summaryBox').style.display = 'none';
    document.getElementById('selectedServicesSection').style.display = 'none';
    selectedServices = [];
    selectedTime = null;
    selectedDate = null;
    selectedPayment = null;
    checkFormComplete();
}

// Dashboard functions
function showDashboard() {
    document.getElementById('customerView').style.display = 'none';
    document.getElementById('ownerView').style.display = 'block'; // ✅ FIX
    updateDashboard();
}


function showCustomerView() {
    document.getElementById('ownerView').style.display = 'none';
    document.getElementById('customerView').style.display = 'block';
}


function updateDashboard() {
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter(b => b.date === today);
    const totalRevenue = bookings.reduce((sum, b) => b.paymentStatus === 'Paid' ? sum + b.totalPrice : sum, 0);
    const pendingPayments = bookings.filter(b => b.paymentStatus === 'Pending').length;

    document.getElementById('totalBookings').textContent = bookings.length;
    document.getElementById('todayBookings').textContent = todayBookings.length;
    document.getElementById('totalRevenue').textContent = `₹${totalRevenue}`;
    document.getElementById('pendingPayments').textContent = pendingPayments;

    renderBookingsTable();
}

function renderBookingsTable() {
    const container = document.getElementById('bookingsTableContainer');

    if (bookings.length === 0) {
        container.innerHTML = `
            <div class="no-bookings">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <h3>No bookings yet</h3>
                <p>Bookings will appear here once customers make appointments</p>
            </div>
        `;
        return;
    }

    const sortedBookings = [...bookings].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Booking ID</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Services</th>
                    <th>Date & Time</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${sortedBookings.map(booking => `
                    <tr>
                        <td><strong>${booking.id}</strong></td>
                        <td>${booking.customerName}</td>
                        <td>${booking.customerPhone}</td>
                        <td>
                            ${booking.services.map(s => s.name).join(', ')}
                            <br><small style="color: var(--text-light);">(${booking.totalDuration} min)</small>
                        </td>
                        <td>
                            ${new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            <br><small>${booking.time}</small>
                        </td>
                        <td><strong>₹${booking.totalPrice}</strong></td>
                        <td>${booking.paymentMethod.toUpperCase()}</td>
                        <td>
                            <span class="status-badge status-${booking.paymentStatus.toLowerCase()}">
                                ${booking.paymentStatus}
                            </span>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    container.innerHTML = tableHTML;
}

// Initialize on load
window.addEventListener('load', function() {
    // Check if there's a hash to show dashboard
    if (window.location.hash === '#dashboard') {
        showDashboard();
    }
});


function ownerLogin() {
    const entered = prompt("Enter salon password");

    if (entered === OWNER_PASSWORD) {
        localStorage.setItem("ownerLoggedIn", "true");
        showDashboard(); // ✅ use existing function
    } else {
        alert("Incorrect password");
    }
}


window.addEventListener("load", () => {
    if (localStorage.getItem("ownerLoggedIn") === "true") {
        showDashboard();
    }
});


function ownerLogout() {
    localStorage.removeItem("ownerLoggedIn");
    showCustomerView();
    alert("Logged out");
}



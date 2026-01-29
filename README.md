# Luxe Salon Booking System

A modern, elegant salon booking web application with WhatsApp integration and owner dashboard.

## 📁 Project Structure

```
salon-booking/
├── index.html       # Main HTML structure
├── styles.css       # All styling and animations
├── script.js        # Booking logic and functionality
└── README.md        # This file
```

## 🚀 Quick Start

1. **Open the Application**
   - Simply open `index.html` in any modern web browser
   - No server or installation required!

2. **For Customers**
   - Select one or more services
   - Fill in your details (name, phone, email)
   - Choose date and time slot
   - Select payment method
   - Click "Proceed to Payment & Book"
   - Owner receives WhatsApp notification

3. **For Owner**
   - Click "Owner Dashboard" button (top-right)
   - View all bookings, statistics, and revenue
   - Track payment status

## ⚙️ Customization Guide

### 1. Change Owner WhatsApp Number
**File:** `script.js` (Line 2)
```javascript
const OWNER_WHATSAPP = '918767628056'; // Change this number
```
Format: Country code (91) + 10-digit number (no spaces or +)

### 2. Change Salon Name & Tagline
**File:** `index.html` (Lines 11-12)
```html
<h1>Luxe Salon</h1>
<p class="tagline">Elegance Redefined</p>
```

### 3. Modify Services
**File:** `index.html` (Find service items around lines 20-80)

Each service has this structure:
```html
<div class="service-item" data-service="haircut" data-price="1200" data-duration="45">
    <div class="service-info">
        <h3>Signature Haircut</h3>
        <p class="service-duration">45 minutes</p>
    </div>
    <div class="service-price">₹1,200</div>
</div>
```

**To add a new service:**
1. Copy an existing service block
2. Change `data-service` to unique ID (e.g., "new-service")
3. Change `data-price` (price in rupees, no commas)
4. Change `data-duration` (duration in minutes)
5. Update the service name, duration text, and price display

**To remove a service:**
- Delete the entire `<div class="service-item">...</div>` block

### 4. Change Time Slots
**File:** `script.js` (Lines 5-8)
```javascript
const TIME_SLOTS = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
];
```
Add or remove time slots as needed.

### 5. Change Colors
**File:** `styles.css` (Lines 1-12)
```css
:root {
    --primary: #8B7355;        /* Main brown color */
    --primary-light: #A68968;  /* Lighter brown */
    --primary-dark: #6B5845;   /* Darker brown */
    --accent: #D4AF37;         /* Gold accent */
    --bg-cream: #FAF8F5;       /* Background cream */
    --bg-white: #FFFFFF;       /* White background */
    --text-dark: #2C2420;      /* Dark text */
    --text-light: #8B8580;     /* Light text */
}
```

### 6. Modify Payment Options
**File:** `index.html` (Find payment-options section around line 140)

Add/remove payment options:
```html
<div class="payment-option" data-payment="upi">
    <div class="payment-option-icon">📱</div>
    <div class="payment-option-name">UPI / PhonePe</div>
</div>
```

## 🎨 Features

### Customer Features
- ✅ Multiple service selection
- ✅ Interactive calendar date picker
- ✅ Real-time time slot availability
- ✅ Live booking summary
- ✅ Multiple payment methods
- ✅ WhatsApp confirmation to owner
- ✅ Booking ID generation

### Owner Features
- ✅ Complete booking dashboard
- ✅ Real-time statistics
  - Total bookings
  - Today's bookings
  - Total revenue
  - Pending payments
- ✅ Detailed booking table
- ✅ Payment status tracking
- ✅ Persistent data storage (localStorage)

## 📱 WhatsApp Integration

When a customer books:
1. A formatted message is sent to the owner's WhatsApp
2. Message includes:
   - Booking ID
   - Customer details
   - All selected services
   - Date, time, and duration
   - Payment method and status

## 💾 Data Storage

- All bookings are saved in browser's localStorage
- Data persists even after closing the browser
- No database or backend required
- Each browser instance maintains its own data

### To Clear All Bookings
Open browser console (F12) and run:
```javascript
localStorage.removeItem('salonBookings');
location.reload();
```

## 🌐 Browser Compatibility

Works on all modern browsers:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📤 Deployment

### Option 1: Local Use
Just open `index.html` in a browser

### Option 2: Host on Web
Upload all three files to any web hosting:
- GitHub Pages (Free)
- Netlify (Free)
- Vercel (Free)
- Any web hosting service

**Important:** All three files (index.html, styles.css, script.js) must be in the same folder!

## 🛠️ Troubleshooting

### WhatsApp doesn't open
- Check the owner's WhatsApp number format in `script.js`
- Format should be: `918767628056` (country code + number)

### Styles not loading
- Make sure `styles.css` is in the same folder as `index.html`
- Check the file name matches exactly (case-sensitive)

### JavaScript not working
- Make sure `script.js` is in the same folder as `index.html`
- Open browser console (F12) to check for errors

### Bookings not saving
- Check if browser allows localStorage
- Try a different browser
- Clear browser cache and reload

## 📝 Notes

- This is a client-side application (no backend required)
- Data is stored locally in the browser
- For production use, consider adding a backend database
- WhatsApp integration requires user to click "Send" in WhatsApp

## 🎯 Future Enhancements (Optional)

If you want to add more features:
- Email notifications
- SMS integration
- Database backend (Firebase, MongoDB)
- User authentication
- Calendar sync
- Payment gateway integration
- Advanced analytics
- Multi-language support

## 📞 Support

For customization help, refer to the inline comments in each file.

---

**Created with ❤️ for Luxe Salon**

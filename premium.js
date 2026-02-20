/* ========================================
   PREMIUM JAVASCRIPT - INTERACTIVE FEATURES
   ======================================== */

// ========================================
// PARALLAX SCROLLING
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  initParallax();
  displayBookings();
  updateWelcomeMessage();
  initializeStorage();
});

function initializeStorage() {
  const user = localStorage.getItem('user');
  const email = localStorage.getItem('user-email');
  
  if (user && email && !localStorage.getItem('user_data')) {
    storage.setUser({
      name: user,
      email: email
    });
  }
}

function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  window.addEventListener('scroll', () => {
    parallaxElements.forEach(element => {
      const speed = parseFloat(element.getAttribute('data-parallax'));
      const yPos = window.pageYOffset * speed;
      element.style.transform = `translateY(${yPos}px)`;
    });
  });
}

// ========================================
// SMOOTH SCROLL NAVIGATION
// ========================================

function scrollToServices() {
  const servicesSection = document.getElementById('services');
  servicesSection.scrollIntoView({ behavior: 'smooth' });
}

// ========================================
// BOOKING SYSTEM
// ========================================

function generateBookingID() {
  return 'QHP-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function getETA(service) {
  const etas = {
    'Cleaning': { min: 30, max: 45 },
    'Plumbing': { min: 20, max: 35 },
    'Electrician': { min: 25, max: 40 },
    'Cooking': { min: 60, max: 90 }
  };
  
  const range = etas[service] || { min: 30, max: 45 };
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

function bookService(service) {
  // Use storage manager
  const booking = storage.addBooking({
    service: service,
    eta: getETA(service),
    timestamp: new Date().toLocaleTimeString(),
    date: new Date().toLocaleDateString()
  });

  showPremiumToast(`✓ Booking Confirmed!`, `ID: ${booking.id} • ETA: ${booking.eta} mins`, 'success');

  setTimeout(() => {
    displayBookings();
    const bookingsSection = document.getElementById('bookings');
    if (bookingsSection) {
      bookingsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, 500);
}

// ========================================
// PREMIUM TOAST NOTIFICATIONS
// ========================================

function showPremiumToast(title, message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `premium-toast premium-toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <div class="toast-close" onclick="this.parentElement.remove()">×</div>
  `;
  
  document.body.appendChild(toast);

  // Add CSS for toast if not already added
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.innerHTML = `
      .premium-toast {
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(30px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 16px;
        padding: 20px 24px;
        max-width: 400px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        z-index: 2000;
        animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      }

      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(100px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes slideOutRight {
        from {
          opacity: 1;
          transform: translateX(0);
        }
        to {
          opacity: 0;
          transform: translateX(100px);
        }
      }

      .premium-toast.removing {
        animation: slideOutRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .premium-toast-success {
        border-color: rgba(16, 185, 129, 0.3);
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
      }

      .premium-toast-success .toast-title {
        color: #10B981;
      }

      .premium-toast-error {
        border-color: rgba(239, 68, 68, 0.3);
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05));
      }

      .premium-toast-error .toast-title {
        color: #EF4444;
      }

      .toast-content {
        flex: 1;
      }

      .toast-title {
        font-weight: 700;
        font-size: 16px;
        margin-bottom: 4px;
      }

      .toast-message {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
      }

      .toast-close {
        font-size: 24px;
        cursor: pointer;
        color: rgba(255, 255, 255, 0.6);
        transition: all 0.2s;
        background: rgba(255, 255, 255, 0.1);
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
      }

      .toast-close:hover {
        color: white;
        background: rgba(255, 255, 255, 0.2);
      }

      @media (max-width: 768px) {
        .premium-toast {
          top: auto;
          bottom: 20px;
          right: 20px;
          left: 20px;
          max-width: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Auto remove after 5 seconds
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 400);
  }, 5000);
}

// ========================================
// DISPLAY BOOKINGS
// ========================================

function displayBookings() {
  const list = document.getElementById('bookingList');
  const emptyState = document.getElementById('emptyState');
  let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

  if (bookings.length === 0) {
    list.innerHTML = '';
    emptyState.style.display = 'flex';
    emptyState.style.flexDirection = 'column';
    emptyState.style.alignItems = 'center';
  if (!list) return;
  
  const emptyState = document.getElementById('emptyState');
  let bookings = storage.getBookings();

  if (bookings.length === 0) {
    list.innerHTML = '';
    if (emptyState) {
      emptyState.style.display = 'flex';
      emptyState.style.flexDirection = 'column';
      emptyState.style.alignItems = 'center';
      emptyState.style.justifyContent = 'center';
    }
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  list.innerHTML = '';

  bookings.forEach((booking, index) => {
    const bookingElement = document.createElement('div');
    bookingElement.className = 'booking-item';
    bookingElement.style.animation = `slideUp 0.5s ease-out ${index * 0.1}s backwards`;
    
    const statusClass = booking.status === 'confirmed' ? 'success' : 'pending';
    
    bookingElement.innerHTML = `
      <div class="booking-info">
        <h4>📍 ${booking.service}</h4>
        <div class="booking-details">
          <div class="booking-detail">
            <span>🆔</span> <strong>${booking.id}</strong>
          </div>
          <div class="booking-detail">
            <span>⏱️</span> <strong>${booking.eta} mins</strong>
          </div>
          <div class="booking-detail">
            <span>📅</span> <span>${booking.date} at ${booking.timestamp}</span>
          </div>
        </div>
      </div>
      <div class="status-badge ${statusClass}">${booking.status.toUpperCase()
// ========================================

function updateWelcomeMessage() {
  const user = localStorage.getItem('user') || 'Guest';
  const welcomeText = document.getElementById('welcomeText');
  const userGreeting = document.getElementById('userGreeting');
  
  const hour = new Date().getHours();
  let greeting = 'Welcome back';
  
  if (hour < 12) {
    greeting = 'Good morning';
  } else if (hour < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }
  
  welcomeText.textContent = `${greeting}, ${user}! 👋`;
  userGreeting.textContent = 'Ready to book premium services?';
}

// ========================================
// LOGOUT FUNCTION
// ========================================

function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('bookings');
  
  showPremiumToast('Logged Out', 'See you soon!', 'success');
  
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
}

// ========================================
// ADVANCED ANIMATIONS ON SCROLL
// ========================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = `fadeInUp 0.6s ease-out forwards`;
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.service-card, .feature-card, .booking-item').forEach(el => {
    observer.observe(el);
  });
});

// ========================================
// CURSOR GLOW EFFECT
// ========================================

document.addEventListener('mousemove', (e) => {
  const cards = document.querySelectorAll('.service-card, .feature-card, .glassmorphism-card');
  
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Only apply if cursor is near the card
    const distance = Math.hypot(x - rect.width / 2, y - rect.height / 2);
    if (distance < 200) {
      card.style.setProperty('--cursor-x', `${x}px`);
      card.style.setProperty('--cursor-y', `${y}px`);
    }
  });
});

// ========================================
// PAGE VISIBILITY OPTIMIZATION
// ========================================

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    document.querySelectorAll('[class*="animation"]').forEach(el => {
      el.style.animationPlayState = 'paused';
    });
  } else {
    document.querySelectorAll('[class*="animation"]').forEach(el => {
      el.style.animationPlayState = 'running';
    });
  }
});

// ========================================
// PERFORMANCE OPTIMIZATION - LAZY LOADING
// ========================================

if ('IntersectionObserver' in window) {
  const lazyElements = document.querySelectorAll('[data-parallax]');
  
  const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.willChange = 'transform';
        lazyObserver.unobserve(entry.target);
      }
    });
  });
  
  lazyElements.forEach(el => lazyObserver.observe(el));
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================

document.addEventListener('keydown', (e) => {
  // ESC to scroll to top
  if (e.key === 'Escape') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // CMD/CTRL + K to scroll to services
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    scrollToServices();
  }
});

console.log('🎨 Premium Design System Loaded - Apple Standards Activated');

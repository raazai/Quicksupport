/* ========================================
   LOCAL STORAGE DATA MANAGEMENT SYSTEM
   ======================================== */

class StorageManager {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem('qhp_initialized')) {
      this.initializeDefaults();
    }
  }

  initializeDefaults() {
    // Initialize test users with passwords
    const testUsers = [
      {
        id: 'user1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '(555) 123-4567',
        avatar: '👨',
        joinDate: new Date().toISOString(),
        address: '123 Main St',
        city: 'New York',
        postalCode: '10001'
      },
      {
        id: 'user2',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        password: 'password123',
        phone: '(555) 234-5678',
        avatar: '👩',
        joinDate: new Date().toISOString(),
        address: '456 Oak Ave',
        city: 'Los Angeles',
        postalCode: '90001'
      },
      {
        id: 'user3',
        name: 'Mike Smith',
        email: 'mike@example.com',
        password: 'password123',
        phone: '(555) 345-6789',
        avatar: '👨‍💼',
        joinDate: new Date().toISOString(),
        address: '789 Pine Rd',
        city: 'Chicago',
        postalCode: '60601'
      }
    ];
    
    localStorage.setItem('test_users', JSON.stringify(testUsers));
    localStorage.setItem('current_user', 'null');
    
    // Initialize collections
    localStorage.setItem('bookings', JSON.stringify([]));
    localStorage.setItem('services_history', JSON.stringify([]));
    localStorage.setItem('favorites', JSON.stringify([]));
    localStorage.setItem('reviews', JSON.stringify([]));
    localStorage.setItem('user_preferences', JSON.stringify({
      notifications: true,
      smsAlerts: true,
      emailUpdates: true,
      darkMode: true
    }));
    
    localStorage.setItem('qhp_initialized', 'true');
  }

  // ======== AUTHENTICATION ========
  loginUser(email, password) {
    const users = this.getAllUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      localStorage.setItem('current_user', JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, message: 'Invalid email or password' };
  }

  signupUser(name, email, password) {
    const users = this.getAllUsers();
    
    // Check if email already exists
    if (users.some(u => u.email === email)) {
      return { success: false, message: 'Email already registered' };
    }
    
    // Create new user
    const newUser = {
      id: 'user_' + Date.now(),
      name,
      email,
      password,
      phone: '',
      avatar: '👤',
      joinDate: new Date().toISOString(),
      address: '',
      city: '',
      postalCode: ''
    };
    
    users.push(newUser);
    localStorage.setItem('test_users', JSON.stringify(users));
    localStorage.setItem('current_user', JSON.stringify(newUser));
    
    return { success: true, user: newUser };
  }

  logoutUser() {
    localStorage.setItem('current_user', 'null');
  }

  getCurrentUser() {
    const user = localStorage.getItem('current_user');
    return user && user !== 'null' ? JSON.parse(user) : null;
  }

  getAllUsers() {
    const users = localStorage.getItem('test_users');
    return users ? JSON.parse(users) : [];
  }

  // ======== USER MANAGEMENT ========
  setUser(userData) {
    localStorage.setItem('user_data', JSON.stringify({
      name: userData.name || 'Guest',
      email: userData.email || 'user@example.com',
      phone: userData.phone || '',
      avatar: userData.avatar || '',
      joinDate: userData.joinDate || new Date().toISOString(),
      address: userData.address || '',
      city: userData.city || '',
      postalCode: userData.postalCode || '',
      preferences: userData.preferences || {}
    }));
  }

  getUser() {
    const data = localStorage.getItem('user_data');
    return data ? JSON.parse(data) : { name: 'Guest', email: 'user@example.com' };
  }

  // ======== BOOKING MANAGEMENT ========
  addBooking(booking) {
    const bookings = this.getBookings();
    const newBooking = {
      id: 'QHP-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      ...booking,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      rating: 0,
      review: ''
    };
    bookings.push(newBooking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Add to history
    this.addToHistory(newBooking);
    return newBooking;
  }

  getBookings() {
    const data = localStorage.getItem('bookings');
    return data ? JSON.parse(data) : [];
  }

  getBookingById(id) {
    return this.getBookings().find(b => b.id === id);
  }

  updateBooking(id, updates) {
    let bookings = this.getBookings();
    bookings = bookings.map(b => b.id === id ? { ...b, ...updates } : b);
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }

  cancelBooking(id) {
    this.updateBooking(id, { status: 'cancelled', cancelledAt: new Date().toISOString() });
  }

  // ======== SERVICE HISTORY ========
  addToHistory(booking) {
    const history = JSON.parse(localStorage.getItem('services_history')) || [];
    history.unshift({
      ...booking,
      completedAt: new Date().toISOString()
    });
    localStorage.setItem('services_history', JSON.stringify(history.slice(0, 100))); // Keep last 100
  }

  getServiceHistory() {
    return JSON.parse(localStorage.getItem('services_history')) || [];
  }

  // ======== FAVORITES ========
  addFavorite(service) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.find(f => f.id === service.id)) {
      favorites.push({ ...service, favoritedAt: new Date().toISOString() });
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }

  removeFavorite(serviceId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(f => f.id !== serviceId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
  }

  isFavorited(serviceId) {
    const favorites = this.getFavorites();
    return favorites.some(f => f.id === serviceId);
  }

  // ======== REVIEWS & RATINGS ========
  addReview(bookingId, rating, reviewText) {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    reviews.push({
      id: 'REV-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      bookingId,
      rating,
      review: reviewText,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('reviews', JSON.stringify(reviews));
    this.updateBooking(bookingId, { rating, review: reviewText, reviewed: true });
  }

  getReviews() {
    return JSON.parse(localStorage.getItem('reviews')) || [];
  }

  getReviewsByService(serviceName) {
    const reviews = this.getReviews();
    const history = this.getServiceHistory();
    const serviceBookings = history.filter(h => h.service === serviceName);
    return reviews.filter(r => serviceBookings.some(sb => sb.id === r.bookingId));
  }

  // ======== USER PREFERENCES ========
  setPreferences(preferences) {
    localStorage.setItem('user_preferences', JSON.stringify(preferences));
  }

  getPreferences() {
    const data = localStorage.getItem('user_preferences');
    return data ? JSON.parse(data) : {};
  }

  // ======== STATISTICS ========
  getStats() {
    const bookings = this.getBookings();
    const history = this.getServiceHistory();
    const reviews = this.getReviews();
    
    const completed = history.length;
    const active = bookings.filter(b => b.status === 'confirmed' || b.status === 'assigned').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    
    const avgRating = reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    return {
      totalBookings: bookings.length,
      completedServices: completed,
      activeBookings: active,
      cancelledBookings: cancelled,
      averageRating: avgRating,
      favoriteServices: this.getFavorites().length,
      totalReviews: reviews.length
    };
  }

  // ======== WALLET & PAYMENTS ========
  getWallet() {
    const data = localStorage.getItem('wallet');
    return data ? JSON.parse(data) : { balance: 0, transactions: [] };
  }

  addTransaction(transaction) {
    const wallet = this.getWallet();
    wallet.transactions.unshift({
      id: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      ...transaction,
      timestamp: new Date().toISOString()
    });
    wallet.balance += transaction.amount;
    localStorage.setItem('wallet', JSON.stringify(wallet));
  }

  // ======== PROMO CODES ========
  getPromos() {
    return JSON.parse(localStorage.getItem('promos')) || [];
  }

  addPromo(promoCode) {
    const promos = this.getPromos();
    if (!promos.find(p => p.code === promoCode.code)) {
      promos.push({
        ...promoCode,
        appliedAt: new Date().toISOString()
      });
      localStorage.setItem('promos', JSON.stringify(promos));
      return true;
    }
    return false;
  }
}

// Initialize globally
const storage = new StorageManager();

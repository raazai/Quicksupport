function login() {
  const username = document.getElementById("username").value;
  if (username === "") {
    alert("Enter username");
    return;
  }
  localStorage.setItem("user", username);
  window.location = "dashboard.html";
}

function generateBookingID() {
  return "QH" + Math.floor(Math.random() * 10000);
}

function getETA(service) {
  if (service === "Cleaning") return 15;
  if (service === "Plumbing") return 15;
  if (service === "Electrician") return 15;
  if (service === "Cooking") return 15;
  if (service=="")
}

function bookService(service) {
  const bookingID = generateBookingID();
  const eta = getETA(service);

  const booking = {
    id: bookingID,
    service: service,
    eta: eta,
    status: "Assigned"
  };

  let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  bookings.push(booking);
  localStorage.setItem("bookings", JSON.stringify(bookings));

  alert(`Booking Confirmed!\nID: ${bookingID}\nHelper arriving in ${eta} minutes`);

  displayBookings();
}

function displayBookings() {
  const list = document.getElementById("bookingList");
  let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

  list.innerHTML = "";
  bookings.forEach(b => {
    list.innerHTML += `
      <p>
      ID: ${b.id} | Service: ${b.service} |
      ETA: ${b.eta} mins | Status: ${b.status}
      </p>
    `;
  });
}

if (window.location.pathname.includes("dashboard.html")) {
  displayBookings();
}

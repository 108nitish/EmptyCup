let listings = [];

async function fetchListings() {
  const response = await fetch('https://emptycupback.onrender.com/api/listings');
  listings = await response.json(); 
  renderListings();
}

fetchListings();


let showShortlisted = false;
const container = document.getElementById('listingContainer');

function renderListings() {
  container.innerHTML = '';

  const toShow = showShortlisted
    ? listings.filter(l => l.shortlisted)
    : listings;

  toShow.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    const totalStars = 5;
    const filledStars = Math.round(item.rating); 
    const unfilledStars = totalStars - filledStars;
    const stars = '★'.repeat(filledStars) + '☆'.repeat(unfilledStars);


    card.innerHTML = `
    <div class="card-l">
      <h3>${item.name}</h3>
      <div class="stars">${stars}</div>
      <p>${item.description}</p>
      <div class="info">
        <div><strong>${item.projects}</strong><br>Projects</div>
        <div><strong>${item.years}</strong><br>Years</div>
        <div><strong>${item.price}$</strong><br>Price</div>
      </div>
      <p class="phones">
        <span>+91 - ${item.phone1}</span>
        <span>+91 - ${item.phone2}</span>
      </p>

    </div>
    <div class="card-r">
      <div class="actions">
        <button class="action-btn">
          <img src="icons/details.svg" alt="Details">
          <span>Details</span>
        </button>

        <button class="action-btn">
          <img src="icons/hide.svg" alt="Hide">
          <span>Hide</span>
        </button>

        <button class="action-btn" onclick="toggleShortlist('${item._id}')">
          <img src="icons/${item.shortlisted ? 'Shortlist.svg' : 'Shortlist-2.svg'}" alt="Shortlist">
          <span>Shortlist</span>
        </button>

        <button class="action-btn">
          <img src="icons/Report.svg" alt="Report">
          <span>Report</span>
        </button>
      </div>
    </div>
    `;
    container.appendChild(card);
  });
}

async function toggleShortlist(id) {
  try {
    const res = await fetch(`https://emptycupback.onrender.com/api/toggle-shortlist/${id}`, {
      method: 'POST',
    });
    const data = await res.json();
    if (data.success) {
      const target = listings.find(l => l._id === id);
      target.shortlisted = data.shortlisted;
      renderListings();
    }
  } catch (err) {
    console.error("Toggle failed:", err);
  }
}


document.getElementById('shortlistFilter').addEventListener('click', () => {
  showShortlisted = !showShortlisted;
  document.getElementById('shortlistFilter').classList.toggle('active', showShortlisted);
  renderListings();
});

// renderListings();

// Task 6: Fetch travel recommendations and log to console
function fetchTravelData() {
    return fetch('travel_recommendation_api.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response failed');
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched Travel API Data:', data); // Verification log
        return data;
      })
      .catch(error => console.error('Error fetching data:', error));
  }
  
  // Task 10: Helper function to get current time for a given timezone
  function getLocalTimeString(timeZone) {
    if (!timeZone) return '';
    try {
      const options = {
        timeZone: timeZone,
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      };
      return new Date().toLocaleTimeString('en-US', options);
    } catch (e) {
      console.error('Invalid TimeZone:', timeZone);
      return '';
    }
  }
  
  // Task 7 & Task 8: Search Keyword Handler and Display Recommendations
  function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('searchResults');
    
    if (!searchInput || !resultsContainer) return;
  
    // Task 7: Normalize user input to lower case
    const keyword = searchInput.value.toLowerCase().trim();
    resultsContainer.innerHTML = '';
  
    if (!keyword) {
      resultsContainer.innerHTML = '<p class="error-msg">Please enter a keyword to search.</p>';
      return;
    }
  
    fetchTravelData().then(data => {
      if (!data) return;
  
      let matchedItems = [];
  
      // Task 7: Accept variations (beach/beaches, temple/temples, country/countries, specific names)
      if (keyword.includes('beach')) {
        matchedItems = data.beaches || [];
      } else if (keyword.includes('temple')) {
        matchedItems = data.temples || [];
      } else if (keyword.includes('country') || keyword.includes('countries')) {
        // Return cities from all countries if 'country' is searched
        data.countries.forEach(country => {
          matchedItems.push(...country.cities.map(city => ({ ...city, timeZone: country.timeZone })));
        });
      } else {
        // Search specific country or city names
        data.countries.forEach(country => {
          if (country.name.toLowerCase().includes(keyword)) {
            matchedItems.push(...country.cities.map(city => ({ ...city, timeZone: country.timeZone })));
          } else {
            country.cities.forEach(city => {
              if (city.name.toLowerCase().includes(keyword)) {
                matchedItems.push({ ...city, timeZone: country.timeZone });
              }
            });
          }
        });
      }
  
      // Task 8: Render recommendations
      displayRecommendations(matchedItems);
    });
  }
  
  // Render result cards into DOM
  function displayRecommendations(items) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';
  
    if (items.length === 0) {
      resultsContainer.innerHTML = '<p class="error-msg">No recommendations found. Try "beach", "temple", or "japan".</p>';
      return;
    }
  
    // Display heading above grid
    const heading = document.createElement('h2');
    heading.className = 'results-heading';
    heading.innerText = 'Search Results';
    resultsContainer.appendChild(heading);
  
    // Grid wrapper for cards
    const gridDiv = document.createElement('div');
    gridDiv.className = 'recommendations-grid';
  
    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'recommendation-card';
  
      // Task 10: Calculate local time for country/destination
      const localTime = item.timeZone ? getLocalTimeString(item.timeZone) : '';
      const timeDisplay = localTime ? `<p class="card-time">Current Time: <span>${localTime}</span></p>` : '';
  
      card.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}" />
        <div class="card-content">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          ${timeDisplay}
          <button class="btn-visit" onclick="alert('Exploring ${item.name}!')">Visit</button>
        </div>
      `;
      gridDiv.appendChild(card);
    });
  
    resultsContainer.appendChild(gridDiv);
  }
  
  // Task 9: Clear results and search box
  function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('searchResults');
  
    if (searchInput) searchInput.value = '';
    if (resultsContainer) resultsContainer.innerHTML = '';
  }
  
  // Event Listeners setup
  document.addEventListener('DOMContentLoaded', () => {
    const btnSearch = document.getElementById('btnSearch');
    const btnClear = document.getElementById('btnClear');
  
    if (btnSearch) btnSearch.addEventListener('click', handleSearch);
    if (btnClear) btnClear.addEventListener('click', clearSearch);
  });
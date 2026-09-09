function fetchTravelData() {
    return fetch('horizon_quest_api.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response failed');
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched Travel API Data:', data);
        return data;
      })
      .catch(error => console.error('Error fetching data:', error));
  }
  
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
  
  function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('searchResults');
    
    if (!searchInput || !resultsContainer) return;
  
    const keyword = searchInput.value.toLowerCase().trim();
    resultsContainer.innerHTML = '';
  
    if (!keyword) {
      resultsContainer.innerHTML = '<p class="error-msg">Please enter a keyword to search.</p>';
      return;
    }
  
    fetchTravelData().then(data => {
      if (!data) return;
  
      let matchedItems = [];
  
      if (keyword.includes('beach')) {
        matchedItems = data.beaches || [];
      } else if (keyword.includes('temple')) {
        matchedItems = data.temples || [];
      } else if (keyword.includes('country') || keyword.includes('countries')) {
        data.countries.forEach(country => {
          matchedItems.push(...country.cities.map(city => ({ ...city, timeZone: country.timeZone })));
        });
      } else {
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
  
      displayRecommendations(matchedItems);
    });
  }
  
  function displayRecommendations(items) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';
  
    if (items.length === 0) {
      resultsContainer.innerHTML = '<p class="error-msg">No recommendations found. Try "beach", "temple", or "japan".</p>';
      return;
    }
  
    const gridDiv = document.createElement('div');
    gridDiv.className = 'recommendations-grid';
  
    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'result-card';
  
      const localTime = item.timeZone ? getLocalTimeString(item.timeZone) : '';
      const timeDisplay = localTime ? `<p class="card-time">Current Time: <span>${localTime}</span></p>` : '';
  
      card.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}" />
        <div class="result-card-body">
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
  
  function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('searchResults');
  
    if (searchInput) searchInput.value = '';
    if (resultsContainer) resultsContainer.innerHTML = '';
  }
// Function to get the current time in a specific timezone
function getTimeByTimeZone(timeZone) {
    const options = { 
      timeZone: timeZone, 
      hour12: true, 
      hour: 'numeric', 
      minute: 'numeric', 
      second: 'numeric' 
    };
    return new Date().toLocaleTimeString('en-US', options);
  }
  
  // Function to display the current time for a recommended country
  function displayCountryTime(country, timeZone) {
    const countryTime = getTimeByTimeZone(timeZone);
    const timeContainer = document.getElementById('time-container');
  
    const timeElement = document.createElement('div');
    timeElement.className = 'time-entry';
    timeElement.innerHTML = `
      <p>Current time in ${country}: <strong>${countryTime}</strong></p>
    `;
    timeContainer.appendChild(timeElement);
  }
  
  // Example usage: Display time for a few countries
  function displayTimes() {
    displayCountryTime("New York, USA", "America/New_York");
    displayCountryTime("Sydney, Australia", "Australia/Sydney");
    displayCountryTime("Tokyo, Japan", "Asia/Tokyo");
  }
  
  // Call the function to display times on page load
  document.addEventListener('DOMContentLoaded', () => {
    displayTimes();
  });
  


  // Function to fetch data from the JSON file
async function fetchRecommendations() {
    try {
      const response = await fetch('travel_recommendation_api.json');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  }
  
  // Function to render recommendations
  function renderRecommendations(results) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results
  
    if (results.length === 0) {
      resultsContainer.innerHTML = '<p>No results found. Please try a different keyword.</p>';
      return;
    }
  
    results.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'recommendation-card';
  
      card.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
      `;
  
      resultsContainer.appendChild(card);
    });
  }
  
  // Function to handle the search logic
  async function handleSearch() {
    const searchBar = document.getElementById('searchBar');
    const query = searchBar.value.trim().toLowerCase();
    if (!query) {
      alert('Please enter a keyword to search.');
      return;
    }
  
    const data = await fetchRecommendations();
    let results = [];
  
    // Match keywords to categories
    if (query.includes('beach')) {
      results = data.beaches;
    } else if (query.includes('temple')) {
      results = data.temples;
    } else {
      // Match country or city names
      data.countries.forEach((country) => {
        const matchedCities = country.cities.filter((city) =>
          city.name.toLowerCase().includes(query)
        );
        if (country.name.toLowerCase().includes(query)) {
          results.push(...country.cities);
        } else {
          results.push(...matchedCities);
        }
      });
    }
  
    renderRecommendations(results);
  }
  
  // Function to reset search results
  function resetSearch() {
    document.getElementById('searchBar').value = '';
    document.getElementById('results').innerHTML = '';
  }
  
  // Add event listeners to the Search and Reset buttons
  document.getElementById('searchButton').addEventListener('click', handleSearch);
  document.getElementById('resetButton').addEventListener('click', resetSearch);
  